import moment from "moment";

class Exchange {
  constructor({ fromCurrency, toCurrency, history }) {
    this.fromCurrency = fromCurrency;
    this.toCurrency = toCurrency;
    this.dateStart = moment().subtract(history, "days").format("YYYY-MM-DD");
    this.dateEnd = moment().format("YYYY-MM-DD");
    this.rates = {};
  }

  // Fetch time series to get more bang for the API buck.
  async getRates() {
    const baseUrl = "https://api.twelvedata.com/time_series?";
    const call =
      baseUrl +
      `symbol=${this.fromCurrency}/${this.toCurrency}&` +
      `interval=1day&` +
      `apikey=${process.env.TWELVE_DATA_API_KEY}&` +
      `start_date=${this.dateStart}&` +
      `end_date=${this.dateEnd}`;
    console.log(call);
    const response = await fetch(call, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TWELVE_DATA_API_KEY}`,
      },
    });
    const rates = await response.json();
    for (let rate of rates.values) {
      this.rates[rate.datetime] = rate.close;
    }
  }

  applyRate(amount, date) {
    let rate = this.rates[date];
    if (date < this.dateStart || date > this.dateEnd) {
      console.warn(
        `Date ${date} is outside the range of fetched rates (${this.dateStart} to ${this.dateEnd}). No conversion will be applied. Extend the history parameter in config.js if needed.`
      );
      return;
    }
    if (!rate) {
      // Fall back to latest previous rate.
      const dates = Object.keys(this.rates).sort();
      for (let i = dates.length - 1; i >= 0; i--) {
        if (dates[i] < date) {
          rate = this.rates[dates[i]];
          break;
        }
      }
      console.warn(
        `No rate found for ${date}, ${
          rate
            ? `falling back to previous rate ${rate}.`
            : "no previous rate found either. No conversion will be applied."
        }`
      );
      // TODO: Handle alternative fallback/interpolation strategies.
    }
    if (!rate) {
      return;
    }
    // Round to nearest cent.
    return Math.round(amount * rate);
  }
}

export default Exchange;
