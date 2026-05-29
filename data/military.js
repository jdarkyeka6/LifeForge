/* ============================================================
   military.js — branches & rank ladder.
   ============================================================ */
window.GAME = window.GAME || {};
window.GAME.militaryBranches = [
  {id:"army", name:"Army",      icon:"medal"},
  {id:"navy", name:"Navy",      icon:"boat"},
  {id:"air",  name:"Air Force", icon:"plane"},
  {id:"marines",name:"Marines", icon:"crest"},
];
window.GAME.militaryRanks = ["Recruit","Private","Corporal","Sergeant","Lieutenant","Captain","Major","Colonel","General"];
window.GAME.militaryBasePay = 32000;
