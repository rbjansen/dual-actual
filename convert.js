import api from "@actual-app/api";
import Exchange from "./lib/exchangeRates.js";
import Config from "./config.js";

(async () => {
  await api.init({
    dataDir: "./actual-cache",
    serverURL: process.env.ACTUAL_SERVER_URL || "http://localhost:5006",
    password: process.env.ACTUAL_PASSWORD,
  });

  await api.downloadBudget(Config.budgetId);

  for (let account of Config.convertAccounts) {
    try {
      const exchange = new Exchange({
        fromCurrency: account.fromCurrency,
        toCurrency: Config.toCurrency,
        history: Config.history,
      });
      await exchange.getRates();
      let transactions = await api.getTransactions(account.id);
      let count = 0;
      for (let transaction of transactions) {
        // Skip transactions that have already been converted.
        if (transaction.notes?.startsWith(`${Config.toCurrency}: `)) {
          continue;
        }
        // NOTE: values are in cents; rounded after conversion.
        await api.updateTransaction(transaction.id, {
          notes: `${Config.toCurrency}: ` + transaction.notes,
          amount: exchange.applyRate(transaction.amount, transaction.date),
        });
        count++;
      }
      console.log("Converted", count, "transactions.");
    } catch (e) {
      console.error(e);
    }
  }

  await api.shutdown();
})();
