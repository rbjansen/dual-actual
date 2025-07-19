const Config = {
  syncId: "<your-sync-id>", // Replace with your sync ID
  history: 90, // Days of historical exchange rate data to fetch
  convertAccounts: [
    {
      id: "<your-account-id>",
      fromCurrency: "EUR", // ISO 4217 currency code
    },
    // Any further accounts can be added here...
  ],
  toCurrency: "SEK", // ISO 4217 currency code
};

export default Config;
