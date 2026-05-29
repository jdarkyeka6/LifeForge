/* ============================================================
   scenarios.js — alternate ways to start a life.
   "apply(s)" tweaks the freshly-created character state.
   ============================================================ */
window.GAME = window.GAME || {};
window.GAME.scenarios = [
  {id:"normal",  name:"Normal Life",   icon:"smile",  desc:"A regular start. Anything is possible.", apply:s=>{}},
  {id:"rich",    name:"Born Wealthy",  icon:"coin",   desc:"Rich, well-connected family.",
    apply:s=>{ s.money=250000; s.happiness=Math.min(100,s.happiness+10); s.looks=Math.min(100,s.looks+10); }},
  {id:"royal",   name:"Royal Heir",    icon:"crown",  desc:"Born into a royal family. Fame & fortune.",
    apply:s=>{ s.money=2000000; s.fame=40; s.looks=Math.min(100,s.looks+15); s.royal=true; }},
  {id:"poor",    name:"Rags to Riches",icon:"house",  desc:"Born with nothing. Claw your way up.",
    apply:s=>{ s.money=0; s.happiness=Math.max(20,s.happiness-15); s.wealthFactor=Math.min(s.wealthFactor,0.4); }},
  {id:"orphan",  name:"Orphan",        icon:"person", desc:"No parents. The world is yours to face alone.",
    apply:s=>{ s.people=s.people.filter(p=>p.relation==="sibling"); s.money=0; s.happiness=Math.max(20,s.happiness-20); s.mental=Math.max(25,s.mental-15); }},
  {id:"genius",  name:"Child Prodigy", icon:"brain",  desc:"Born brilliant. A genius from day one.",
    apply:s=>{ s.smarts=Math.max(s.smarts,90); s.skills&&(s.skills.science=40); }},
  {id:"star",    name:"Celebrity Kid", icon:"star",   desc:"Born to famous parents. Fame from the cradle.",
    apply:s=>{ s.fame=35; s.followers=50000; s.looks=Math.min(100,s.looks+10); s.money=120000; }},
];
