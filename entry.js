import api from "@actual-app/api";
import { convertAccount } from "./lib/converters/ing/index.js";

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
