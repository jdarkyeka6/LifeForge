/* ============================================================
   mafia.js — organized crime ranks & jobs.
   Rising costs "respect"; jobs pay cash but carry risk.
   ============================================================ */
window.GAME = window.GAME || {};
window.GAME.mafiaRanks = ["Associate","Soldier","Capo","Underboss","Boss"];
window.GAME.mafiaJobs = [
  {id:"collect", name:"Collect a Debt",   icon:"fedora", reward:[500,3000],   risk:0.20, respect:3,  karma:-4},
  {id:"smuggle", name:"Run Contraband",   icon:"car",    reward:[3000,15000], risk:0.35, respect:6,  karma:-8},
  {id:"protect", name:"Protection Racket", icon:"crest",  reward:[2000,9000],  risk:0.30, respect:5,  karma:-7},
  {id:"heist",   name:"Pull a Heist",      icon:"crime",  reward:[15000,80000],risk:0.50, respect:12, karma:-15},
  {id:"hit",     name:"Take a Contract",   icon:"crime",  reward:[20000,120000],risk:0.6, respect:18, karma:-30},
];
