# dual-actual

An example docker-based solution for single-currency budgeting with multi-currency connected bank accounts in [Actual](https://actualbudget.org/).

## Installation

Add an empty `.env` file to the root of the project and start Actual with:

```bash
docker compose up -d --build
```

Log in, set up your accounts, and find the sync ID of your budget under Advanced Settings. This example repository uses [Twelve Data](https://twelvedata.com/docs) for exchange rates, which provides a free plan of 800 API calls per month. Should be more than enough as we're fetching (long) time series with a single call.

> **Recommended**: connect your bank accounts to Actual to be able to import your latest transactions with the click of a button. See Actual's instructions [here](https://actualbudget.org/docs/advanced/bank-sync/).

Replace the values in the `.env` with your own:

```bash
TWELVE_DATA_API_KEY="<your-twelve-data-api-key>"
ACTUAL_PASSWORD="<your-password>"
# ACTUAL_SERVER_URL="<your-url>"  # Optional, defaults to "http://localhost:5006"
```

Next, update `config.js` with your values. First add your `syncId`. Then to find the individual account IDs of the accounts you wish to convert, execute:

```bash
docker exec -it dual-actual node lib/listAccounts
```

Add the relevant ids to the `convertAccounts` array in `config.js`.

Finally restart the Actual container with the new environment variables and config:

```bash
docker compose up -d --force-recreate
```

Note that any subsequent startups of the docker compose will automatically take the values from the `.env` file you have set.

## Usage

The script `convert.js` updates all transaction amounts in the specified accounts that have not previously been converted, to the currency specified by `toCurrency`. Converted transactions are prefixed in their notes with your selected currency code.

Manually run the script with:

```bash
docker exec -it dual-actual node convert
```

Alternatively, uncomment line 22 in `docker-compose.yml` to execute the conversions on startup.
