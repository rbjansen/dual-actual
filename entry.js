import api from "@actual-app/api";
import Exchange from "./lib/exchangeRates.js";

const acctId = "56d03adc-e474-48ff-968a-1e23bea963ea";
const exchange = new Exchange();

(async () => {
  await api.init({
    dataDir: "./actual-cache",
    serverURL: "http://localhost:5006",
    password: process.env.ACTUAL_PASSWORD,
  });

  await api.downloadBudget("160f19e6-efef-4be1-9ae8-8f6f418448b9");
  await exchange.getRates();

  try {
    let transactions = await api.getTransactions(acctId);
    for (let transaction of transactions) {
      // Skip transactions that have already been converted
      if (transaction.notes?.startsWith("SEK: ")) {
        continue;
      }
      console.log(exchange.applyRate(transaction.amount, transaction.date));
      // await api.updateTransaction(transaction.id, {
      //   notes: "SEK: " + transaction.notes,
      //   amount: exchange.applyRate(transaction.amount, transaction.date),
      // });
    }
  } catch (e) {
    console.error(e);
  }

  await api.shutdown();
})();
