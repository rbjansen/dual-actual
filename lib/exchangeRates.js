import moment from "moment";

class Exchange {
  constructor({ fromCurrency, toCurrency, history }) {
    this.fromCurrency = fromCurrency;
    this.toCurrency = toCurrency;
    this.dateStart = moment().subtract(history, "days").format("YYYY-MM-DD");
    this.dateEnd = moment().format("YYYY-MM-DD");
    this.rates = {};
  }

  async getRates() {
    const baseUrl = "https://api.synthfinance.com/rates/historical-range?";
    const call =
      baseUrl +
      `date_start=${this.dateStart}&` +
      `date_end=${this.dateEnd}&` +
      `from=${this.fromCurrency}&` +
      `to=${this.toCurrency}`;
    console.log(call);
    const response = await fetch(call, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.SYNTH_API_KEY}`,
      },
    });
    const rates = await response.json();
    for (let rate of rates.data) {
      this.rates[rate.date] = rate.rates[this.toCurrency];
    }
  }

  applyRate(amount, date) {
    let rate = this.rates[date];
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
        `No rate for ${date}, falling back to previous rate ${rate}`
      );
      // TODO: Handle alternative fallback/interpolation strategies.
    }
    // Round to nearest cent.
    return Math.round(amount * rate);
  }
}

export default Exchange;
