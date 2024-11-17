import api from "@actual-app/api";

(async () => {
  await api.init({
    // Budget data will be cached locally here, in subdirectories for each file.
    dataDir: "./actual-cache",
    // This is the URL of your running server
    serverURL: "http://localhost:5006",
    // This is the password you use to log into the server
    password: process.env.ACTUAL_PASSWORD,
  });

  // This is the ID from Settings → Show advanced settings → Sync ID
  await api.downloadBudget("160f19e6-efef-4be1-9ae8-8f6f418448b9");
  // or, if you have end-to-end encryption enabled:
  // await api.downloadBudget("1cfdbb80-6274-49bf-b0c2-737235a4c81f", {
  //   password: "password1",
  // });

  let budget = await api.getBudgetMonth("2024-10");
  console.log(budget);
  await api.shutdown();
})();
