import api from "@actual-app/api";

const data = {};

async function run() {
  for (let account of data.accounts) {
    let acctId = await api.createAccount(convertAccount(account));
    await api.addTransactions(
      acctId,
      data.transactions
        .filter((t) => t.acctId === acctId)
        .map(convertTransaction)
    );
  }
}

api.runImport("My-Budget", run);
