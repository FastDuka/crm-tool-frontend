
import axios from 'axios';
import store from "@/store/index.js";

/**
 * Service for generating and managing PDF invoices
 */
const pdfService = {
  /**
   * Generate a PDF from the invoice data
   * 
   * @param {Object} invoiceData - The complete invoice data object
   * @returns {Promise} - Promise that resolves to the PDF response from the API
   */
  generatePDF(invoiceData) {
    // You can use your API base URL from environment variables
    const apiUrl = process.env.VUE_APP_API_URL || 'http://localhost:8000';
    
    return axios.post(`${apiUrl}/api/invoice/v2/generate-pdf/`, invoiceData, {
      responseType: 'blob', // Important: This ensures the response is treated as binary data
      headers: {
        'Content-Type': 'application/json',
        // Include authentication headers if required
        'Authorization': `Bearer ${store.getters.token}`
      }
    });
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
  }
};

export default pdfService;