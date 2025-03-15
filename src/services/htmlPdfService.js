// src/services/pdfService.js

import axios from 'axios';
import store from "@/store/index.js";

/**
 * Service for generating and managing PDF invoices
 */
const pdfService = {
  /**
   * Generate a PDF from the invoice HTML content
   * 
   * @param {Object} data - Object containing HTML content, CSS, and metadata
   * @returns {Promise} - Promise that resolves to the PDF response from the API
   */
  generateHTMLPDF(data) {
    // You can use your API base URL from environment variables
    const apiUrl = process.env.VUE_APP_API_URL || 'http://localhost:8000';
    
    return axios.post(`${apiUrl}/api/invoices/html-to-pdf/`, data, {
      responseType: 'blob', // Important: This ensures the response is treated as binary data
      headers: {
        'Content-Type': 'application/json',
        // Include authentication headers if required
        'Authorization': `Bearer ${store.getters.token}`
      }
    });
  },
  
  /**
   * Generate a PDF from the invoice data using the JSON approach
   * (Kept for backward compatibility)
   * 
   * @param {Object} invoiceData - The complete invoice data object
   * @returns {Promise} - Promise that resolves to the PDF response from the API
   */
  generateDataPDF(invoiceData) {
    // You can use your API base URL from environment variables
    const apiUrl = process.env.VUE_APP_API_URL || 'http://localhost:8000';
    
    return axios.post(`${apiUrl}/api/invoices/generate-pdf/`, invoiceData, {
      responseType: 'blob', // Important: This ensures the response is treated as binary data
      headers: {
        'Content-Type': 'application/json',
        // Include authentication headers if required
        'Authorization': `Bearer ${store.getters.token}`
      }
    });
  },
  
  /**
   * Collect all CSS from the document
   * 
   * @returns {String} - Concatenated CSS from all stylesheets
   */
  collectCSS() {
    const styleSheets = [...document.styleSheets];
    let cssText = '';
    
    // Collect CSS from all stylesheets
    styleSheets.forEach(sheet => {
      try {
        // Get CSS rules from the stylesheet
        const rules = sheet.cssRules || sheet.rules;
        for (let i = 0; i < rules.length; i++) {
          cssText += rules[i].cssText + '\n';
        }
      } catch (e) {
        // Some stylesheets might be from different origins and can't be accessed
        console.log('Could not access stylesheet', e);
      }
    });
    
    // Add print-specific CSS
    cssText += `
      @page {
        size: A4;
        margin: 1cm;
      }
      body {
        font-family: 'Helvetica', 'Arial', sans-serif;
      }
      @media print {
        .no-print {
          display: none !important;
        }
        .page-break {
          page-break-after: always;
        }
      }
    `;
    
    return cssText;
  },
  
  /**
   * Create a complete HTML document from a fragment
   * 
   * @param {String} htmlContent - The HTML content (usually just the invoice section)
   * @param {String} title - The title for the document
   * @returns {String} - Complete HTML document
   */
  createCompleteHTML(htmlContent, title) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${title || 'Invoice'}</title>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;
  },
  
  /**
   * Download the generated PDF with a proper filename
   * 
   * @param {Blob} pdfBlob - The PDF blob data
   * @param {String} filename - The name to give the downloaded file
   */
  downloadPDF(pdfBlob, filename) {
    // Create a URL for the blob
    const blobUrl = window.URL.createObjectURL(pdfBlob);
    
    // Create a temporary link element
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = filename || 'invoice.pdf';
    
    // Append to the document, click it to start the download, then remove it
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Clean up the blob URL
    window.URL.revokeObjectURL(blobUrl);
  },
  
  /**
   * Generate and download a PDF in one step
   * 
   * @param {HTMLElement} element - The element to convert to PDF
   * @param {String} invoiceNumber - The invoice number
   * @param {String} customerName - The customer name
   * @returns {Promise} - Promise that resolves when PDF is downloaded
   */
  async generateAndDownloadPDF(element, invoiceNumber, customerName) {
    try {
      // Get HTML content
      const htmlContent = element.outerHTML;
      
      // Get CSS
      const cssContent = this.collectCSS();
      
      // Create a complete HTML document
      const completeHTML = this.createCompleteHTML(
        htmlContent, 
        `Invoice - ${invoiceNumber}`
      );
      
      // Generate PDF
      const response = await this.generateHTMLPDF({
        html_content: completeHTML,
        css_content: cssContent,
        invoice_number: invoiceNumber,
        title: `Invoice - ${customerName}`
      });
      
      // Create filename
      const safeCustomerName = customerName?.replace(/\s+/g, '_') || 'customer';
      const safeInvoiceNumber = invoiceNumber?.replace(/[^\w-]/g, '') || 'invoice';
      const filename = `invoice_${safeInvoiceNumber}_${safeCustomerName}.pdf`;
      
      // Download PDF
      this.downloadPDF(response.data, filename);
      
      return { success: true };
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }
};

export default pdfService;