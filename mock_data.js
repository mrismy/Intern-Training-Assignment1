import Stock from './stock.js';
import DataStore from './data_store.js';

const Store = new DataStore();

const SampleSymbols = [
  ['1010', 'TDWL'],
  ['1020', 'TDWL'],
  ['1090', 'TDWL'],
  ['2040', 'TDWL'],
  ['1040', 'TDWL'],
  ['EMAAR', 'DFM'],
  ['DFM', 'DFM'],
  ['DIB', 'DFM'],
  ['SHUAA', 'DFM'],
  ['UPP', 'DFM']
];

function randPrice(min = 1, max = 500) {
  return +(Math.random() * (max - min) + min).toFixed(2);
}

function randDateWithinYear() {
  const Days = Math.floor(Math.random() * 365);
  return new Date(Date.now() - Days * 24 * 60 * 60 * 1000).toISOString();
}

function makeStock(symbol, exchange) {
  const Open = randPrice();
  const High = +(Open + Math.random() * 5).toFixed(2);
  const Low = +(Open - Math.random() * 5).toFixed(2);
  const Close = +(Math.random() * (High - Low) + Low).toFixed(2);
  const Bid = +(Close - Math.random() * 0.5).toFixed(2);
  const Ask = +(Close + Math.random() * 0.5).toFixed(2);
  const TradeDate = randDateWithinYear();
  return new Stock(symbol, exchange, Open, High, Low, Close, Bid, Ask, TradeDate);
}

const Stocks = SampleSymbols.map(([symbol, exchange]) => makeStock(symbol, exchange));
Store.addStocks(Stocks);

function renderTable(exchange) {
  const Tbody = document.getElementById('stockBody');
  if (!Tbody) return;
  Tbody.innerHTML = '';
  if(exchange === 'ALL') {
    for (const Stock of Store.stocks) {
      const Tr = document.createElement('tr');
      Tr.innerHTML = `
        <td>${Stock.symbol}</td>
        <td>${Stock.open}</td>
        <td>${Stock.high}</td>
        <td>${Stock.low}</td>
        <td>${Stock.close}</td>
        <td>${Stock.bid}</td>
        <td>${Stock.ask}</td>
        <td>${Stock.tradeDate}</td>
      `;
      Tbody.appendChild(Tr);
    }
  } else {
  const StocksByExchange = Store.getStocksByExchange(exchange);
  for (const R of StocksByExchange) {
      const Tr = document.createElement('tr');
      Tr.innerHTML = `
        <td>${R.symbol}</td>
        <td>${R.open}</td>
        <td>${R.high}</td>
        <td>${R.low}</td>
        <td>${R.close}</td>
        <td>${R.bid}</td>
        <td>${R.ask}</td>
        <td>${R.tradeDate}</td>
      `;
      Tbody.appendChild(Tr);
    }
  }
}

function updateStockPrices() {
  for (const Stock of Store.stocks) {
    Stock.open = randPrice();
    Stock.high = +(Stock.open + Math.random() * 5).toFixed(2);
    Stock.low = +(Stock.open - Math.random() * 5).toFixed(2);
    Stock.close = +(Math.random() * (Stock.high - Stock.low) + Stock.low).toFixed(2);
    Stock.bid = +(Stock.close - Math.random() * 0.5).toFixed(2);
    Stock.ask = +(Stock.close + Math.random() * 0.5).toFixed(2);
    Stock.tradeDate = randDateWithinYear();
  }
}


const select = document.getElementById('exchangeSelect');
if (select) {
  select.addEventListener('change', (e) => renderTable(e.target.value));
  renderTable(select.value);
  
  function scheduleUpdate() {
    setTimeout(() => {
      updateStockPrices();
      renderTable(select.value);
      scheduleUpdate();
    }, 2000);
  }
  
  scheduleUpdate();
}
