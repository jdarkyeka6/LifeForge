/* ============================================================
   skills.js — learnable skills (0–100 each).
   "boosts" tells the engine which career ids / actions a high
   level helps (used for hiring odds, fame, crime, etc.).
   ============================================================ */
window.GAME = window.GAME || {};
window.GAME.skills = [
  {id:"charisma", name:"Charisma",  icon:"smile",    desc:"Win people over",      boosts:["politician","realtor","finance","actor"]},
  {id:"fighting", name:"Fighting",  icon:"crime",    desc:"Hold your own",        boosts:["soldier","police","athlete"]},
  {id:"athletics",name:"Athletics", icon:"dumbbell", desc:"Speed & strength",     boosts:["athlete","soldier","firefighter"]},
  {id:"music",    name:"Music",     icon:"music",    desc:"Play & perform",       boosts:["musician"]},
  {id:"art",      name:"Art",       icon:"palette",  desc:"Create visual art",    boosts:["designer","model"]},
  {id:"writing",  name:"Writing",   icon:"book",     desc:"Words that move",      boosts:["journalist","teacher","politician"]},
  {id:"cooking",  name:"Cooking",   icon:"food",     desc:"Master the kitchen",   boosts:["chef","barista"]},
  {id:"coding",   name:"Coding",    icon:"controller",desc:"Build software",      boosts:["engineer"]},
  {id:"science",  name:"Science",   icon:"flask",    desc:"Understand the world", boosts:["scientist","doctor","surgeon","dentist","vet"]},
  {id:"business", name:"Business",  icon:"office",   desc:"Deals & strategy",     boosts:["finance","accountant","realtor"]},
  {id:"fashion",  name:"Fashion",   icon:"star",     desc:"Style & image",        boosts:["model","influencer"]},
  {id:"medicine", name:"Medicine",  icon:"cross",    desc:"Heal others",          boosts:["nurse","doctor","surgeon"]},
];
