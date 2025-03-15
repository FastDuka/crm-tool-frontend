<template>
  <div
    ref="chatContainer"
    v-if="isChatVisible"
    class="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl transition-all duration-300 ease-in-out z-50 overflow-hidden"
    :class="[
      isMinimized ? 'w-60 h-14' : '',
      isExpanded
        ? 'bottom-0 right-0 rounded-none w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-5/6'
        : '',
    ]"
    :style="
      !isMinimized && !isExpanded
        ? {
            width: chatWidth + 'px',
            height: chatHeight + 'px',
          }
        : {}
    "
  >
    <!-- Top resize handle -->
    <div
      v-if="!isMinimized && !isExpanded"
      class="absolute top-0 left-0 h-1.5 w-full cursor-n-resize"
      @mousedown="startResize('n', $event)"
    ></div>

    <!-- Left resize handle -->
    <div
      v-if="!isMinimized && !isExpanded"
      class="absolute top-0 left-0 w-1.5 h-full cursor-w-resize"
      @mousedown="startResize('w', $event)"
    ></div>

    <!-- Top-left corner resize handle -->
    <div
      v-if="!isMinimized && !isExpanded"
      class="absolute top-0 left-0 w-3 h-3 cursor-nw-resize border-t border-l border-gray-400 rounded-tl"
      @mousedown="startResize('nw', $event)"
    ></div>

    <!-- Header with controls -->
    <div
      class="p-4 border-b flex items-center justify-between cursor-pointer"
      @click="isMinimized ? toggleMinimize() : null"
    >
      <div class="flex items-center gap-2">
        <i class="fas fa-robot w-5 h-5"></i>
        <h3 class="font-semibold">AI Invoice Assistant</h3>
      </div>
      <div class="flex items-center space-x-2">
        <!-- Model selector (only visible when not minimized) -->
        <select
          v-if="!isMinimized"
          v-model="selectedModel"
          class="text-sm border rounded-md px-2 py-1"
          :disabled="isLoading"
        >
          <option
            v-for="model in availableModels"
            :key="model.id"
            :value="model.id"
          >
            {{ model.name }}
          </option>
        </select>

        <!-- Expand/collapse button -->
        <button
          v-if="!isMinimized"
          @click.stop="toggleExpand"
          class="p-1 rounded-md hover:bg-gray-100"
          :title="isExpanded ? 'Collapse' : 'Expand'"
        >
          <Maximize2 v-if="!isExpanded" class="w-4 h-4 text-gray-600" />
          <Minimize2 v-else class="w-4 h-4 text-gray-600" />
        </button>

        <!-- Minimize/maximize button -->
        <button
          @click.stop="toggleMinimize"
          class="p-1 rounded-md hover:bg-gray-100"
          :title="isMinimized ? 'Expand' : 'Minimize'"
        >
          <ChevronDown v-if="!isMinimized" class="w-4 h-4 text-gray-600" />
          <ChevronUp v-else class="w-4 h-4 text-gray-600" />
        </button>

        <!-- Close button -->
        <button
          v-if="!isMinimized"
          @click.stop="closeChat"
          class="p-1 rounded-md hover:bg-gray-100 hover:text-red-500"
          title="Close"
        >
          <X class="w-4 h-4 text-gray-600 hover:text-red-500" />
        </button>
      </div>
    </div>

    <!-- Chat area (only visible when not minimized) -->
    <div
      v-if="!isMinimized"
      class="relative flex flex-col h-[calc(100%-56px)] pb-2"
    >
      <!-- Messages container -->
      <div class="h-full overflow-y-auto p-4 space-y-4" ref="messagesContainer">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="[
            'p-3 rounded-lg max-w-[80%]',
            msg.sender === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100',
          ]"
        >
          <div
            v-if="msg.sender === 'bot' && msg.loading"
            class="flex space-x-2"
          >
            <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div
              class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
              style="animation-delay: 0.1s"
            ></div>
            <div
              class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
              style="animation-delay: 0.2s"
            ></div>
          </div>
          <template v-else>
            {{ msg.text }}
          </template>
        </div>
      </div>

      <!-- Input area -->
      <form @submit.prevent="handleSubmit" class="p-4 border-t mt-auto">
        <div class="flex gap-2 items-start">
          <textarea
            v-model="input"
            placeholder="Type your message..."
            class="flex-1 p-3 border rounded-md min-h-[60px] max-h-[120px] resize-none overflow-y-auto"
            :disabled="isLoading"
            @keydown="
              (e) => {
                if (!e.shiftKey && e.key === 'Enter') {
                  e.preventDefault();
                  !isLoading && handleSubmit();
                }
              }
            "
            style="line-height: 1.5"
            ref="inputArea"
            @input="autoGrow"
          ></textarea>
          <button
            type="submit"
            class="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center h-[60px] w-[60px]"
            :disabled="isLoading"
          >
            <SendIcon class="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import {
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Send as SendIcon,
  X,
} from "lucide-vue-next";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import aiService from "../../../services/aiService";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const messages = ref([]);
const input = ref("");
const messagesContainer = ref(null);
const isLoading = ref(false);
const isMinimized = ref(false);
const isExpanded = ref(false);
const isChatVisible = ref(true);
const chatContainer = ref(null);

// Size state and default values
const chatWidth = ref(380); // Default width
const chatHeight = ref(500); // Default height
const resizing = ref(false);
const resizeDirection = ref(null);
const startX = ref(0);
const startY = ref(0);
const startWidth = ref(0);
const startHeight = ref(0);

const availableModels = [
  { id: "google", name: "Google AI" },
  { id: "claude", name: "Claude" },
  { id: "openai", name: "OpenAI" },
];

const selectedModel = ref("google"); // Set Google as default

// Toggle minimize/maximize state
const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value;
  if (isMinimized.value) {
    isExpanded.value = false;
  }
};

// Toggle expanded/collapsed state
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

// Close the chat interface
const closeChat = () => {
  isChatVisible.value = false;

  // For demonstration, we'll just hide it and allow reopening with a timeout
  setTimeout(() => {
    isChatVisible.value = true;
    isMinimized.value = true;
  }, 5000);
};

// Resize functionality
const startResize = (direction, event) => {
  event.preventDefault();

  if (chatContainer.value) {
    resizing.value = true;
    resizeDirection.value = direction;

    const rect = chatContainer.value.getBoundingClientRect();
    startX.value = event.clientX;
    startY.value = event.clientY;
    startWidth.value = rect.width;
    startHeight.value = rect.height;

    document.addEventListener("mousemove", onResize);
    document.addEventListener("mouseup", stopResize);
  }
};

const onResize = (event) => {
  if (!resizing.value) return;

  const dx = event.clientX - startX.value;
  const dy = event.clientY - startY.value;
  const direction = resizeDirection.value;

  // Handle different resize directions
  if (direction.includes("w")) {
    // When resizing from the left, only change the width
    const newWidth = Math.max(
      320,
      Math.min(window.innerWidth * 0.95, startWidth.value - dx)
    );
    chatWidth.value = newWidth;
  }
  if (direction.includes("n")) {
    // When resizing from the top, only change the height
    const newHeight = Math.max(
      300,
      Math.min(window.innerHeight * 0.9, startHeight.value - dy)
    );
    chatHeight.value = newHeight;
  }
};

const stopResize = () => {
  resizing.value = false;
  document.removeEventListener("mousemove", onResize);
  document.removeEventListener("mouseup", stopResize);
};

// Auto-grow textarea based on content
const inputArea = ref(null);
const autoGrow = () => {
  if (inputArea.value) {
    inputArea.value.style.height = "60px"; // Reset height
    const scrollHeight = inputArea.value.scrollHeight;
    inputArea.value.style.height = Math.min(scrollHeight, 120) + "px";

    // Enable scrolling when content exceeds max height
    if (scrollHeight > 120) {
      inputArea.value.style.overflowY = "auto";
    } else {
      inputArea.value.style.overflowY = "hidden";
    }
  }
};

// Scroll to bottom when messages change
watch(messages, () => {
  setTimeout(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  }, 0);
});

const mergeDeep = (target, source) => {
  if (!source) return target;

  const output = { ...target };

  Object.keys(source).forEach((key) => {
    if (isObject(source[key]) && isObject(target[key])) {
      // If both values are objects, recursively merge them
      output[key] = mergeDeep(target[key], source[key]);
    } else {
      // Otherwise just assign the new value
      output[key] = source[key];
    }
  });

  return output;
};

// Helper function to check if a value is an object
const isObject = (item) => {
  return item && typeof item === "object" && !Array.isArray(item);
};

const handleSubmit = async () => {
  if (!input.value.trim() || isLoading.value) return;

  const userMessage = { text: input.value, sender: "user" };
  const loadingMessage = { text: "", sender: "bot", loading: true };

  messages.value = [...messages.value, userMessage, loadingMessage];
  isLoading.value = true;
  input.value = "";

  // If minimized, maximize on user input
  if (isMinimized.value) {
    isMinimized.value = false;
  }

  try {
    const service = aiService.getService(selectedModel.value);
    const response = await service.sendMessage(
      userMessage.text,
      props.modelValue
    );

    // Remove loading message and add AI response
    messages.value = messages.value.slice(0, -1);
    messages.value.push({
      text: response.reply,
      sender: "bot",
      model: selectedModel.value,
    });
    console.log("resp", response);

    // Update invoice data if there are any changes
    if (response.invoiceUpdates) {
      emit(
        "update:modelValue",
        mergeDeep(props.modelValue, response.invoiceUpdates)
      );
    }
  } catch (error) {
    console.error("Error:", error);
    // Remove loading message and add error message
    messages.value = messages.value.slice(0, -1);
    messages.value.push({
      text: `Sorry, I encountered an error with ${selectedModel.value}. Please try again or switch to a different model.`,
      sender: "bot",
    });
  } finally {
    isLoading.value = false;
  }
};

// Add initial welcome message
onMounted(() => {
  messages.value = [
    {
      text: 'Welcome to FastDuka Invoice Assistant! Try this: "Create an invoice for Acme Corp with my company FastTech Solutions. Add 3 website development services at 25,000 KES each with 16% tax, and a maintenance package for 8,000 KES. Set payment terms to Net 14."',
      sender: "bot",
      model: "google",
    },
  ];
});

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", onResize);
  document.removeEventListener("mouseup", stopResize);
});
</script>
