import Stock from "./stock.js";
import DataStore from "./data_store.js";

const Store = new DataStore();

const SampleSymbols = {
  TDWL: ["1010", "1020", "1090", "2040", "1040"],
  DFM: ["EMAAR", "DFM", "DIB", "SHUAA", "UPP"],
};

function randPrice(min = 1, max = 500) {
  return +(Math.random() * (max - min)).toFixed(2);
}

function randDateWithinYear() {
  const Start = new Date("2026-01-01T00:00:00.000Z").getTime();
  const End = new Date("2026-04-31T23:59:59.999Z").getTime();
  const RandomTime = Start + Math.random() * (End - Start);
  return new Date(RandomTime).toISOString().slice(0, 10);
}

function makeStock(exchange, symbol) {
  const Open = randPrice();
  const High = +(Open + Math.random() * 5).toFixed(2);
  const Low = +(Open - Math.random() * 5).toFixed(2);
  const Close = +(Math.random() * (High - Low) + Low).toFixed(2);
  const Bid = +(Close - Math.random() * 0.5).toFixed(2);
  const Ask = +(Close + Math.random() * 0.5).toFixed(2);
  const TradeDate = randDateWithinYear();
  
  return new Stock(
    symbol,
    exchange,
    Open,
    High,
    Low,
    Close,
    Bid,
    Ask,
    TradeDate,
  );
}

Object.entries(SampleSymbols)
  .map(([exchange, symbols]) =>
    symbols.map((symbol) => makeStock(exchange, symbol)),
  )
  .flat()
  .forEach((stock) => Store.addStock(stock));

function renderTable(exchange) {
  const Tbody = document.getElementById("stockBody");

  if (!Tbody) {
    return;
  }

  Tbody.innerHTML = "";
  const StocksToRender =
    exchange === "ALL"
      ? Store.getAllStocks()
      : Store.getStocksByExchange(exchange);

  for (const Stock of StocksToRender) {
    const Tr = document.createElement("tr");
    Tr.innerHTML = `
      <td>${Stock.symbol}</td>
      <td>${Stock.open}</td>
      <td>${Stock.high}</td>
      <td>${Stock.low}</td>
      <td>${Stock.close}</td>
      <td>${Stock.bid}</td>
      <td>${Stock.ask}</td>
      <td>${Stock.tradeDate.slice(0, 10)}</td>
    `;
    Tbody.appendChild(Tr);
  }
}

function updateStockPrices() {
  for (const Stock of Store.stocks) {
    Stock.open = randPrice();
    Stock.high = +(Stock.open + Math.random() * 5).toFixed(2);
    Stock.low = +(Stock.open - Math.random() * 5).toFixed(2);
    Stock.close = +(
      Math.random() * (Stock.high - Stock.low) +
      Stock.low
    ).toFixed(2);
    Stock.bid = +(Stock.close - Math.random() * 0.5).toFixed(2);
    Stock.ask = +(Stock.close + Math.random() * 0.5).toFixed(2);
    Stock.tradeDate = randDateWithinYear();
  }
}

const select = document.getElementById("exchangeSelect");

if (select) {
  select.addEventListener("change", (e) => renderTable(e.target.value));
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
