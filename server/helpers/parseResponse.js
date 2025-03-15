export function parseInvoiceResponse(responseString) {
  // Extract the JSON string from the code block
  const jsonString = responseString.replace(/```json\n|```/g, "");

  try {
    // 2. Parse the JSON string
    const parsedResponse = JSON.parse(jsonString);

    // 3. Extract the reply and invoiceUpdates
    const reply = parsedResponse.reply;
    const invoiceUpdates = parsedResponse.invoiceUpdates;

    // 4. Use the extracted data
    console.log("Reply:", reply);
    console.log("Invoice Updates:", invoiceUpdates);

    return {
      reply,
      invoiceUpdates,
    };
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
}

// Export the function
export default parseInvoiceResponse;
