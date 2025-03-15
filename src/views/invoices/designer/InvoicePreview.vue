// Modified version of InvoicePreview.vue with HTML-to-PDF generation

<template>
  <div class="">
    <!-- Header Actions -->
    <div class="flex md:flex-row flex-col items-start md:items-center justify-between mb-6">
      <h2 class="text-2xl font-bold">Preview</h2>
      <div class="flex space-x-4">
        <button class="btn-outline"
                @click="generatePdf"
                :disabled="isGeneratingPdf">
          <i class="fas fa-file-pdf mr-2"></i>
          {{ isGeneratingPdf ? 'Generating...' : 'Download PDF' }}
        </button>
        <button class="btn-outline">
          <i class="fas fa-envelope mr-2"></i>
          Send Email (coming soon)
        </button>
      </div>
    </div>

    <!-- PDF Generation Status Message -->
    <div v-if="pdfMessage"
         class="mb-4 p-3 rounded-md"
         :class="pdfMessageType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'">
      {{ pdfMessage }}
    </div>

    <!-- Invoice Preview Card -->
    <div class="p-2 min-h-[800px]"
         ref="invoicePreview">
      <!-- Company and Invoice Details Header -->
      <div class="flex justify-between items-start mb-8">
        <div class="flex flex-col justify-start">
          <CompanyLogoPreview :logo="invoiceData.company.logo"
                              :company-name="invoiceData.company.name"
                              size="large"
                              class="mb-4" />

          <AddressPreview :invoice-data="invoiceData"></AddressPreview>
        </div>
        <div class="text-right">
          <h1 class="text-2xl font-bold mb-2">INVOICE</h1>
          <div class="text-gray-600">
            <p class="mb-1"># {{ invoiceData.invoiceNumber }}</p>
            <p class="mb-1">Issue Date: {{ formatDate(invoiceData.date) }}</p>
            <p>Due Date: {{ formatDate(invoiceData.dueDate) }}</p>
          </div>
        </div>
      </div>

      <!-- Subject -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-2">{{ invoiceData.subject }}</h2>
      </div>

      <!-- Customer Billing Addresses -->
      <div class="grid grid-cols-2 gap-8 mb-8">
        <!-- Bill To -->
        <div>
          <h3 class="text-gray-500 text-sm font-medium mb-2">BILL TO</h3>
          <div class="text-gray-800">
            <p class="font-semibold">{{ invoiceData.customer.name }}</p>
            <p>{{ invoiceData.customer.address }}</p>
            <p>{{ invoiceData.customer.email }}</p>
            <p>{{ invoiceData.customer.phone }}</p>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <ProductList :items="invoiceData.items"
                   :currency="invoiceData.currency" />

      <!-- Totals Section -->
      <div class="w-80 ml-auto">
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-500">Subtotal</span>
            <span>{{ formatCurrency(calculateSubtotal) }}</span>
          </div>

          <div v-if="invoiceData.discount.enabled"
               class="flex justify-between">
            <span class="text-gray-500">
              Discount ({{ invoiceData.discount.value }}%)
            </span>
            <span class="text-red-500">
              -{{ formatCurrency(calculateDiscount) }}
            </span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-500">Tax</span>
            <span>{{ formatCurrency(calculateTax) }}</span>
          </div>

          <div class="flex justify-between pt-3 border-t font-bold">
            <span>Total</span>
            <span>{{ formatCurrency(calculateTotal) }}</span>
          </div>
        </div>
      </div>

      <!-- Notes Section -->
      <div class="mt-12 pt-8 border-t text-gray-600">
        <h3 class="text-gray-500 text-sm font-medium mb-2">NOTES</h3>
        <p>{{ invoiceData.notes }}</p>
        <p class="mt-4">Payment Terms: {{ invoiceData.paymentTerms }}</p>
      </div>
      <div class="flex w-full cursor-pointer">
        <p class="bottom-4 text-center absolute capitalize">Invoice Was created at <a class="text-blue-400"
             href="https://fastduka.netlify.app/designer">FastDuka
            Invoicing</a>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import CompanyLogoPreview from "@/views/invoices/designer/components/preview/CompanyLogoPreview.vue";
import ProductList from "@/views/invoices/designer/components/preview/ProductList.vue";
import axios from "axios";
import { ElNotification } from "element-plus";
import { computed, ref } from "vue";
import { baseUrl } from "../../../utility/constants";
import AddressPreview from "./components/preview/CompanyAddressPreview.vue";

const props = defineProps({
  invoiceData: {
    type: Object,
    required: true,
  },
});

// Refs for PDF generation
const isGeneratingPdf = ref(false);
const pdfMessage = ref('');
const pdfMessageType = ref('info');
const invoicePreview = ref(null);

const calculateSubtotal = computed(() => {
  return props.invoiceData.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
});

const calculateTax = computed(() => {
  return props.invoiceData.items.reduce(
    (sum, item) => sum + item.price * item.quantity * (item.tax / 100),
    0
  );
});

const calculateDiscount = computed(() => {
  const subtotal = calculateSubtotal.value;
  return props.invoiceData.discount.enabled
    ? subtotal * (props.invoiceData.discount.value / 100)
    : 0;
});

const calculateTotal = computed(() => {
  return calculateSubtotal.value + calculateTax.value - calculateDiscount.value;
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const formatCurrency = (number) => {
  return `${props.invoiceData.currency} ${number.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Generate PDF from the current HTML content of the invoice preview
 */
const generatePdf = async () => {
  isGeneratingPdf.value = true;
  pdfMessage.value = '';

  try {
    const invoiceHTML = invoicePreview.value.outerHTML;

    // Get the Tailwind CSS stylesheet
    const tailwindStylesheet = Array.from(document.styleSheets)
      .find(sheet => {
        // Look for the main stylesheet that contains Tailwind classes
        // This might need adjustment based on your build setup
        try {
          return sheet.cssRules &&
            Array.from(sheet.cssRules).some(rule =>
              rule.cssText && rule.cssText.includes('.bg-blue-500') ||
              rule.cssText.includes('.text-gray-600'));
        } catch (e) {
          return false;
        }
      });

    let tailwindCSS = '';

    if (tailwindStylesheet) {
      try {
        // Extract all CSS rules from the Tailwind stylesheet
        Array.from(tailwindStylesheet.cssRules).forEach(rule => {
          tailwindCSS += rule.cssText + '\n';
        });
      } catch (e) {
        console.warn('Could not extract Tailwind CSS rules:', e);
      }
    }

    const printCSS = `
        @font-face {
          font-family: 'Josefin Sans';
          src: url('https://fonts.gstatic.com/s/josefinsans/v25/Qw3aZQNVED7rKGKxtqIqX5EUDXx4.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
        }
        
        @font-face {
          font-family: 'Josefin Sans';
          src: url('https://fonts.gstatic.com/s/josefinsans/v25/Qw3aZQNVED7rKGKxtqIqX5EUDXx4.woff2') format('woff2');
          font-weight: 600;
          font-style: normal;
        }
        
        @page { size: A4; margin: 1cm; }
        
        body { 
          font-family: 'Josefin Sans', Arial, sans-serif !important; 
        }
      `;

    // Send to backend
    const response = await axios.post(baseUrl + 'invoice/v2/html-to-pdf/', {
      html_content: invoiceHTML,
      css_content: tailwindCSS + printCSS,
      invoice_number: props.invoiceData.invoiceNumber,
      title: `Invoice - ${props.invoiceData.customer.name}`
    }, {
      responseType: 'blob'
    });


    // Create a filename based on invoice details
    const customerName = props.invoiceData.customer.name?.replace(/\s+/g, '_') || 'customer';
    const invoiceNumber = props.invoiceData.invoiceNumber?.replace(/[^\w-]/g, '') || 'invoice';
    const filename = `invoice_${invoiceNumber}_${customerName}.pdf`;

    // Create a download link for the PDF blob
    const blobUrl = window.URL.createObjectURL(response.data);
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = filename;

    // Trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Clean up the blob URL
    window.URL.revokeObjectURL(blobUrl);

    // Show success notification
    ElNotification({
      title: 'Success',
      message: 'PDF generated and downloaded successfully',
      type: 'success',
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    pdfMessage.value = 'Failed to generate PDF. Please try again.';
    pdfMessageType.value = 'error';

    ElNotification({
      title: 'Error',
      message: 'Failed to generate PDF. Please try again.',
      type: 'error',
    });
  } finally {
    isGeneratingPdf.value = false;
  }
};
</script>