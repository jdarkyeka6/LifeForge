/* ============================================================
   events_emigration.js — wanderlust + immigrant life.
   "immigrant" cond = currently living somewhere you weren't born.
   ============================================================ */
window.GAME = window.GAME || {}; window.GAME.events = window.GAME.events || [];
window.GAME.events.push(
  {id:"em_wanderlust", min:18, max:70, icon:"🛂", title:"Wanderlust", text:"You can't shake the feeling that life might be better abroad.",
    choices:[
      {label:"Start researching visas", effects:{smarts:2,happiness:3}, log:"You looked into moving overseas.", kind:"info"},
      {label:"Bloom where you're planted", effects:{mental:3}, log:"You decided home is good enough.", kind:"good"},
    ]},
  {id:"em_homesick", min:18, max:90, cond:{immigrant:true}, icon:"🛂", title:"Homesick", text:"You miss the country you grew up in.",
    choices:[
      {label:"Visit home", effects:{money:-1500,happiness:10,mental:6}, log:"A trip back home filled your heart.", kind:"good"},
      {label:"Video call family", effects:{happiness:4,relRandom:4}, log:"You caught up with loved ones online.", kind:"good"},
      {label:"Push the feeling down", effects:{mental:-5}, log:"You buried the homesickness.", kind:"bad"},
    ]},
  {id:"em_culture", min:18, max:90, cond:{immigrant:true}, icon:"🌍", title:"New Culture", text:"You're invited to a local festival in your new country.",
    choices:[
      {label:"Dive in fully", effects:{happiness:8,smarts:3,newFriend:true}, log:"You embraced the culture and made friends.", kind:"good"},
      {label:"Observe shyly", effects:{happiness:3,smarts:1}, log:"You watched from the sidelines.", kind:"info"},
    ]},
  {id:"em_language", min:16, max:90, cond:{immigrant:true}, icon:"🌍", title:"Language Barrier", text:"The local language is still tripping you up.",
    choices:[
      {label:"Take classes", effects:{money:-200,smarts:5,happiness:3}, log:"Your fluency is improving fast.", kind:"good"},
      {label:"Get by with gestures", effects:{happiness:-2}, log:"You muddle through, awkwardly.", kind:"info"},
    ]},
  {id:"em_papers", min:18, max:90, cond:{immigrant:true}, icon:"🛂", title:"Immigration Paperwork", text:"Your residency papers need renewing — it's a bureaucratic nightmare.",
    choices:[
      {label:"Pay an immigration lawyer", effects:{money:-1200,mental:3}, log:"A lawyer handled the paperwork smoothly.", kind:"money"},
      {label:"Do it yourself", effects:{mental:-6,smarts:2}, log:"Endless forms, but you got it done.", kind:"info", outcomes:[{chance:0.2,effects:{happiness:-6},log:"A mistake delayed everything by months.",kind:"bad"}]},
    ]},
  {id:"em_opportunity", min:20, max:60, cond:{hasJob:true}, icon:"✈️", title:"Job Abroad", text:"A company overseas wants to recruit you with a relocation package.",
    choices:[
      {label:"Hear them out", effects:{happiness:4,smarts:1}, log:"Tempting — you have options now.", kind:"info"},
      {label:"Not interested", effects:{}, log:"You're staying put for now.", kind:"info"},
    ]},
);
