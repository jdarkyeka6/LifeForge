/* ============================================================
   travel.js — vacation destinations.
   cost scales with the player's country wealth at runtime.
   ============================================================ */
window.GAME = window.GAME || {};
window.GAME.destinations = [
  {id:"paris",  name:"Paris",        icon:"crown", cost:3500, vibe:"romance & art"},
  {id:"tokyo",  name:"Tokyo",        icon:"office",cost:4500, vibe:"neon & culture"},
  {id:"bali",   name:"Bali",         icon:"sun",   cost:3000, vibe:"beaches & calm"},
  {id:"nyc",    name:"New York City", icon:"office",cost:4000, vibe:"the big city"},
  {id:"rome",   name:"Rome",         icon:"crown", cost:3200, vibe:"history & food"},
  {id:"safari", name:"African Safari", icon:"plant",cost:6000, vibe:"wild adventure"},
  {id:"alps",   name:"Swiss Alps",   icon:"plant", cost:5000, vibe:"snow & peaks"},
  {id:"rio",    name:"Rio de Janeiro",icon:"sun",  cost:3800, vibe:"carnival & sun"},
  {id:"dubai",  name:"Dubai",        icon:"office",cost:5500, vibe:"luxury & gold"},
  {id:"cruise", name:"World Cruise",  icon:"boat",  cost:9000, vibe:"the high seas"},
];
