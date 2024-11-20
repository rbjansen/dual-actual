import api from "@actual-app/api";
import * as exchangeRates from "ecb-euro-exchange-rates";

(async () => {
  await api.init({
    // Budget data will be cached locally here, in subdirectories for each file.
    dataDir: "./actual-cache",
    // This is the URL of your running server
    serverURL: "http://localhost:5006",
    // This is the password you use to log into the server
    password: process.env.ACTUAL_PASSWORD,
  });

  // First, open a budget file
  // This is the ID from Settings → Show advanced settings → Sync ID
  await api.downloadBudget("160f19e6-efef-4be1-9ae8-8f6f418448b9");

  // Example methods...

  // let budget = await api.getBudgetMonth("2024-10");
  // console.log(budget);

  try {
    let accounts = await api.getAccounts();
    console.log(accounts);
  } catch (e) {
    console.error(e);
  }

  const rates = await exchangeRates.fetchHistoric();
  let timeToRate = {};
  for (let rate of rates) {
    timeToRate[rate.time] = rate.rates.SEK;
  }
  console.log(timeToRate["2024-10-01"]);

  await api.shutdown();
})();
