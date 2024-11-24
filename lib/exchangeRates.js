import * as exchangeRates from "ecb-euro-exchange-rates";

class Exchange {
  constructor(currency = "SEK") {
    this.currency = currency;
    this.rates = {};
  }

  async getRates() {
    const rates = await exchangeRates.fetchHistoric();
    for (let rate of rates) {
      this.rates[rate.time] = rate.rates[this.currency];
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
      // TODO: Handle alternative fallback/interpolation strategies.
    }
    // Round to nearest cent.
    return Math.round(amount * rate);
  }
}

export default Exchange;
