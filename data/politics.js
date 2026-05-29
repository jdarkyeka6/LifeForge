/* ============================================================
   politics.js — the ladder of political offices.
   You can run for the office one rung above your current one.
   difficulty = base hurdle (0–1). Higher offices need more
   fame, approval, smarts and campaign cash to win.
   ============================================================ */
window.GAME = window.GAME || {};
window.GAME.parties = ["Progress Party","Unity Party","Liberty Party","Green Future","People's Front","Independent"];
window.GAME.offices = [
  {id:"council",  name:"City Council",   icon:"podium", minAge:18, salary:35000,  term:4, difficulty:0.05, fameReq:0},
  {id:"mayor",    name:"Mayor",          icon:"podium", minAge:25, salary:75000,  term:4, difficulty:0.15, fameReq:5},
  {id:"governor", name:"Governor",       icon:"ballot", minAge:30, salary:130000, term:4, difficulty:0.28, fameReq:20},
  {id:"senator",  name:"Senator",        icon:"ballot", minAge:30, salary:150000, term:6, difficulty:0.32, fameReq:25},
  {id:"president", name:"President",      icon:"ballot", minAge:40, salary:280000, term:4, difficulty:0.5,  fameReq:50},
];
