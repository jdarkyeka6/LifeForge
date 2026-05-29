/* ============================================================
   heists.js — big-score targets and the crew you can hire.
   ============================================================ */
window.GAME = window.GAME || {};
window.GAME.heists = [
  {id:"store",   name:"Jewelry Store",  icon:"ring",    difficulty:0.30, reward:[20000,80000]},
  {id:"armored", name:"Armored Truck",  icon:"car",     difficulty:0.42, reward:[60000,200000]},
  {id:"museum",  name:"Art Museum",     icon:"picture", difficulty:0.52, reward:[100000,400000]},
  {id:"casino",  name:"Casino Vault",   icon:"slots",   difficulty:0.62, reward:[150000,600000]},
  {id:"bank",    name:"Central Bank",   icon:"coin",    difficulty:0.74, reward:[400000,1800000]},
];
window.GAME.heistCrew = [
  {id:"hacker", name:"Hacker",          icon:"controller", cost:8000,  bonus:0.12},
  {id:"driver", name:"Getaway Driver",  icon:"car",        cost:6000,  bonus:0.10},
  {id:"muscle", name:"The Muscle",      icon:"crime",      cost:5000,  bonus:0.08},
  {id:"inside", name:"Inside Man",      icon:"fedora",     cost:12000, bonus:0.16},
];
