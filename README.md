# dual-actual

An example docker-based solution for single-currency budgeting with multi-currency connected bank accounts in [Actual](https://actualbudget.org/).

## Installation

Start Actual with:

```bash
docker compose up -d --build
```

Log in, set up your accounts, and determine the ID of the account you want to apply the conversions to. Inspect your accounts with the following command:

```bash
docker exec -it dual-actual node lib/listAccounts
```

> **Recommended**: connect your bank accounts to Actual to be able to import your latest transactions with the click of a button. See Actual's instructions [here](https://actualbudget.org/docs/advanced/bank-sync/).

Set the values in `config.js` and add a `.env` file to the root of the project with the following keys, replacing the values with your own:

```bash
SYNTH_API_KEY="<your-synth-api-key>"
ACTUAL_PASSWORD="<your-password>"
# ACTUAL_SERVER_URL="<your-url>"  # Optional, defaults to "http://localhost:5006"
```

For the exchange rates, this example uses [Synth](https://synthfinance.com/), which provides a free plan of 1000 API calls per month. Should be more than enough.

Restart the Actual container with the new environment variables and config:

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