import api from "@actual-app/api";
import Exchange from "./lib/exchangeRates.js";

const exchange = new Exchange({ curreny: process.env.ACTUAL_CURRENCY });

(async () => {
  await api.init({
    dataDir: "./actual-cache",
    serverURL: process.env.ACTUAL_SERVER_URL || "http://localhost:5006",
    password: process.env.ACTUAL_PASSWORD,
  });

  await api.downloadBudget(process.env.ACTUAL_BUDGET_ID);
  await exchange.getRates();

  try {
    let transactions = await api.getTransactions(
      process.env.ACTUAL_CONVERT_ACCOUNT_ID
    );
    let count = 0;
    for (let transaction of transactions) {
      // Skip transactions that have already been converted.
      if (transaction.notes?.startsWith(`${process.env.ACTUAL_CURRENCY}: `)) {
        continue;
      }
      // NOTE: values are in cents; rounded after conversion.
      await api.updateTransaction(transaction.id, {
        notes: `${process.env.ACTUAL_CURRENCY}: ` + transaction.notes,
        amount: exchange.applyRate(transaction.amount, transaction.date),
      });
      count++;
    }
    console.log("Converted", count, "transactions.");
  } catch (e) {
    console.error(e);
  }

  await api.shutdown();
})();
