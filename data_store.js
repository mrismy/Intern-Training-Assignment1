export default class DataStore {
  constructor() {
    this.stocks = [];
    this.exchangeMap = new Map();
  }

  addStock(stock) {
    if (!stock) {
      return;
    }
    this.stocks.push(stock);
    const key = stock.exchange;
    if (!this.exchangeMap.has(key)) this.exchangeMap.set(key, []);
    this.exchangeMap.get(key).push(stock);
  }

  getStocksByExchange(exchange) {
    return this.exchangeMap.get(exchange) || [];
  }

  getAllStocks() {
    return this.stocks;
  }
}
