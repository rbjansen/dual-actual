# dual-actual

An example docker-based solution for single-currency budgeting with multi-currency connected bank accounts in [Actual](https://actualbudget.com/).

## Installation

Start Actual with:

```bash
docker compose up -d --build
```

Log in, set up your accounts, and determine the ID of the account you want to apply the conversions to.

> Recommended: link your bank accounts to Actual to be able to import your latest transactions with the click of a button. See Actual's instruction [here](https://actualbudget.org/docs/advanced/bank-sync/).

Add a `.env` file to the root of the project with the following keys, replacing the values with your own:

```bash
ACTUAL_BUDGET_ID="<your-budget-id>"
ACTUAL_CURRENCY="<your-currency>"  # e.g. "SEK"
ACTUAL_CONVERT_ACCOUNT_ID="<your-account-id>"
ACTUAL_PASSWORD="<your-password>"
ACTUAL_PORT="<your-port>"  # e.g. 5006
```

Restart the Actual container with the new environment variables:

```bash
docker compose up -d --force-recreate
```

Note that any subsequent startups of the docker compose will automatically take the values from the `.env` file you have set.

## Usage

The script `entry.js` updates all transaction amounts in the specified account `ACTUAL_CONVERT_ACCOUNT_ID` that have not previously been converted, to the currency specified by `ACTUAL_CURRENCY`. The example in this repository uses exchange rates provided by the European Central Bank (ECB) via [ecb-euro-exchange-rates](https://www.npmjs.com/package/ecb-euro-exchange-rates).

Manually run the script with:

```bash
docker exec -it dual-actual node entry
```

Alternatively, uncomment line 22 in `docker-compose.yml` to execute the conversion script on startup.