import api from "@actual-app/api";
import Config from "../config.js";

(async () => {
  await api.init({
    dataDir: "./actual-cache",
    serverURL: process.env.ACTUAL_SERVER_URL || "http://localhost:5006",
    password: process.env.ACTUAL_PASSWORD,
  });

  await api.downloadBudget(Config.budgetId);

  try {
    const accounts = await api.getAccounts();
    console.log(accounts);
  } catch (e) {
    console.error(e);
  }

  await api.shutdown();
})();
