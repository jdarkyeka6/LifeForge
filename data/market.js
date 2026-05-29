/* ============================================================
   market.js — investments & businesses (the "money empire").
   Prices random-walk each year using volatility (0–1).
   ============================================================ */
window.GAME = window.GAME || {};
window.GAME.stocks = [
  {sym:"NOVA",  name:"Nova Tech",        base:120, vol:0.30},
  {sym:"ORCH",  name:"Orchard Devices",  base:180, vol:0.22},
  {sym:"VOLT",  name:"Voltride Motors",  base:90,  vol:0.40},
  {sym:"GRN",   name:"GreenGrid Energy", base:55,  vol:0.28},
  {sym:"MED",   name:"MediCore Health",  base:140, vol:0.18},
  {sym:"BUZZ",  name:"Buzz Social",      base:48,  vol:0.45},
  {sym:"FOOD",  name:"Harvest Foods",    base:70,  vol:0.14},
  {sym:"BANC",  name:"Sterling Bank",    base:110, vol:0.20},
];
window.GAME.cryptos = [
  {sym:"BITZ",  name:"Bitzcoin",   base:9000, vol:0.65},
  {sym:"ETHR",  name:"Ethereal",   base:600,  vol:0.70},
  {sym:"DOGE2", name:"DogeTwo",    base:0.4,  vol:1.10},
  {sym:"SOLR",  name:"SolarChain", base:35,   vol:0.85},
];
window.GAME.businessTypes = [
  {id:"coffee",   name:"Coffee Shop",     icon:"☕", startup:25000,  baseProfit:6000,  risk:0.15},
  {id:"food",     name:"Restaurant",      icon:"👨‍🍳", startup:80000,  baseProfit:20000, risk:0.25},
  {id:"shop",     name:"Clothing Brand",  icon:"👕", startup:60000,  baseProfit:16000, risk:0.30},
  {id:"gym",      name:"Fitness Gym",     icon:"🏋️", startup:120000, baseProfit:30000, risk:0.20},
  {id:"tech",     name:"Tech Startup",    icon:"💻", startup:200000, baseProfit:70000, risk:0.55},
  {id:"realty",   name:"Real Estate Firm",icon:"🏢", startup:300000, baseProfit:90000, risk:0.35},
];
