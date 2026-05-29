/* ============================================================
   traits.js — personality traits assigned at birth.
   Each can give a small yearly passive (applied by the engine)
   and gate events via cond:{trait:"brave"}.
   ============================================================ */
window.GAME = window.GAME || {};
window.GAME.traits = [
  {id:"brave",      name:"Brave",       icon:"crest",  passive:{}},
  {id:"genius",     name:"Genius",      icon:"brain",  passive:{smarts:1}},
  {id:"athletic",   name:"Athletic",    icon:"dumbbell",passive:{fitness:1}},
  {id:"charming",   name:"Charming",    icon:"smile",  passive:{}},
  {id:"kind",       name:"Kind",        icon:"heart",  passive:{karma:1}},
  {id:"ambitious",  name:"Ambitious",   icon:"chart",  passive:{}},
  {id:"creative",   name:"Creative",    icon:"palette",passive:{}},
  {id:"lazy",       name:"Lazy",        icon:"leaf",   passive:{fitness:-1}},
  {id:"hothead",    name:"Hot-headed",  icon:"flame",  passive:{}},
  {id:"frugal",     name:"Frugal",      icon:"coin",   passive:{}},
  {id:"rebel",      name:"Rebellious",  icon:"crime",  passive:{}},
  {id:"shy",        name:"Shy",         icon:"person", passive:{}},
  {id:"optimist",   name:"Optimist",    icon:"sun",    passive:{happiness:1}},
  {id:"greedy",     name:"Greedy",      icon:"coin",   passive:{karma:-1}},
  {id:"loyal",      name:"Loyal",       icon:"people", passive:{}},
];
