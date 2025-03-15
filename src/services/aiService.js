// src/services/baseAIService.js
import axios from "axios";

const PROXY_API_URL = "http://localhost:3000/api/chat";

class BaseAIService {
  constructor(defaultModel) {
    this.defaultModel = defaultModel;
    this.axios = axios.create({
      baseURL: PROXY_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  sanitizeInvoiceData(invoiceData) {
    const sanitized = { ...invoiceData };
    if (sanitized.company) {
      delete sanitized.company.logo;
    }
    return sanitized;
  }

  getSystemPrompt(invoiceData) {
    return `You are an invoice creation assistant. Your role is to help users create and modify invoices.
      
When creating a new invoice:
- Extract company name and details
- Get customer information
- Set appropriate currency
- Handle any specific requirements

When adding products:
- Get product name, quantity, and price
- Apply appropriate tax rates
- Add to existing items list

For any modifications:
- Always return full JSON object
- Keep the original data unless asked to change it
- Maintain existing data structure
- Validate changes before applying

Current invoice data: ${JSON.stringify(
      this.sanitizeInvoiceData(invoiceData),
      null,
      2
    )}

Please provide response in this exact JSON format:
{
  "reply": "Your natural language response to the user",
  "invoiceUpdates": {
    // Only include fields that need to be updated
  }
}
Do not format this as markdown, return exact json
  `;
  }

  async sendMessage(message, invoiceData, model = null) {
    try {
      const response = await this.axios.post("", {
        model: model || this.defaultModel,
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt(invoiceData),
          },
          {
            role: "user",
            content: message,
          },
        ],
      });

      return response.data;
    } catch (error) {
      console.error(`Error calling AI API (${this.defaultModel}):`, error);
      throw error;
    }
  }
}

// src/services/claudeService.js
export class ClaudeService extends BaseAIService {
  constructor() {
    super("claude-3-opus-20240229");
  }
}

// src/services/openAIService.js
export class OpenAIService extends BaseAIService {
  constructor() {
    super("gpt-4");
  }
}

// src/services/googleAIService.js
export class GoogleAIService extends BaseAIService {
  constructor() {
    super("gemini-pro");
  }
}

// src/services/aiService.js
class AIServiceFactory {
  constructor() {
    this.claude = new ClaudeService();
    this.openai = new OpenAIService();
    this.google = new GoogleAIService();
    this.defaultService = this.claude;
  }

  getService(provider = "claude") {
    switch (provider.toLowerCase()) {
      case "claude":
        return this.claude;
      case "openai":
        return this.openai;
      case "google":
        return this.google;
      default:
        return this.defaultService;
    }
  }
}

export default new AIServiceFactory();
