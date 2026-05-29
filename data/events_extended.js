/* ============================================================
   events_extended.js — extended family & rivals.
   ============================================================ */
window.GAME = window.GAME || {}; window.GAME.events = window.GAME.events || [];
window.GAME.events.push(
  // --- rivals ---
  {id:"ex_makerival", min:8, max:60, weight:0.7, cond:{}, icon:"😤", title:"A New Rival", text:"Someone has decided they can't stand you.",
    choices:[
      {label:"Rise above it", effects:{newRival:true,mental:-2}, log:"You've made a rival. Stay classy.", kind:"info"},
      {label:"Make them regret it", effects:{newRival:true,karma:-3}, log:"You've made an enemy — and you're ready for war.", kind:"bad"},
    ]},
  {id:"ex_rivalsabotage", min:10, max:70, cond:{hasRival:true}, icon:"😤", title:"Sabotaged", text:"Your rival is trying to undermine you.",
    choices:[
      {label:"Outshine them", effects:{relRandom:0,happiness:4,smarts:1}, log:"You beat your rival the right way.", kind:"good"},
      {label:"Sabotage them back", cls:"danger", effects:{karma:-6}, log:"You played dirty...", kind:"info", outcomes:[{chance:0.5,effects:{happiness:5},log:"Your scheme worked beautifully.",kind:"good"},{chance:0.5,effects:{happiness:-6,mental:-4},log:"It blew up in your face.",kind:"bad"}]},
      {label:"Try to make peace", effects:{karma:4}, log:"You extended an olive branch...", kind:"info", outcomes:[{chance:0.4,effects:{happiness:5},log:"You actually became friends!",kind:"good"},{chance:0.6,effects:{},log:"They weren't interested.",kind:"info"}]},
    ]},
  {id:"ex_rivalwin", min:14, max:70, cond:{hasRival:true}, icon:"🏆", title:"Head to Head", text:"You and your rival are competing for the same prize.",
    choices:[
      {label:"Give it everything", effects:{}, log:"It came down to you two...", kind:"info", outcomes:[{chance:0.55,effects:{happiness:10,fame:3},log:"You beat your rival! Sweet victory.",kind:"good"},{chance:0.45,effects:{happiness:-8,mental:-4},log:"Your rival won this round.",kind:"bad"}]},
      {label:"Concede gracefully", effects:{karma:3,mental:2}, log:"You bowed out with dignity.", kind:"info"},
    ]},
  // --- grandparents / extended ---
  {id:"ex_grandparent", min:4, max:30, cond:{}, icon:"👵", title:"Grandparent's Wisdom", text:"A grandparent shares stories and advice with you.",
    choices:[
      {label:"Listen closely", effects:{smarts:2,relRandom:6,happiness:4}, log:"Their wisdom stuck with you.", kind:"good"},
      {label:"Ask for money", effects:{money:200,relRandom:-3}, log:"They slipped you some cash, a little reluctantly.", kind:"money"},
    ]},
  {id:"ex_reunion", min:8, max:90, cond:{}, icon:"🤝", title:"Family Reunion", text:"The whole extended family is gathering.",
    choices:[
      {label:"Reconnect with everyone", effects:{relAll:5,happiness:6}, log:"A warm day with the whole family.", kind:"good"},
      {label:"Hide from the drama", effects:{mental:2,relAll:-2}, log:"You kept to the snack table.", kind:"info"},
    ]},
  {id:"ex_inheritance_gp", min:18, max:70, cond:{}, icon:"📜", title:"Grandparent's Will", weight:0.6, icon:"scroll",
    text:"A grandparent has passed and left something behind.",
    choices:[
      {label:"Accept with gratitude", effects:{money:8000,happiness:-4,mental:-3}, log:"You inherited a modest sum, with a heavy heart.", kind:"money"},
    ]},
  {id:"ex_cousin", min:6, max:40, cond:{}, icon:"🧑‍🤝‍🧑", title:"Cousin Trouble", text:"Your cousin is up to their usual antics and wants you in on it.",
    choices:[
      {label:"Join the mischief", effects:{happiness:6,karma:-2}, log:"You and your cousin caused some chaos.", kind:"info"},
      {label:"Keep your distance", effects:{karma:2}, log:"You stayed out of it.", kind:"info"},
    ]},
);
