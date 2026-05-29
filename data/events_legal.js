/* ============================================================
   events_legal.js — lawsuits, courts & civic life.
   ============================================================ */
window.GAME = window.GAME || {}; window.GAME.events = window.GAME.events || [];
window.GAME.events.push(
  {id:"lg_sued_neighbor", min:22, max:90, cond:{moneyMin:2000}, icon:"⚖️", title:"You've Been Sued", text:"A neighbor claims your tree damaged their fence and is suing you.",
    choices:[
      {label:"Settle out of court", effects:{money:-1500,happiness:-3}, log:"You paid to make it go away.", kind:"money"},
      {label:"Fight it in court", effects:{}, log:"You took it to court...", kind:"info", outcomes:[{chance:0.5,effects:{happiness:5,karma:2},log:"The judge dismissed the case. Vindicated!",kind:"good"},{chance:0.5,effects:{money:-4000,happiness:-6},log:"You lost and paid damages plus fees.",kind:"bad"}]},
      {label:"Counter-sue", cls:"danger", effects:{karma:-3}, log:"You hit back with your own lawsuit...", kind:"info", outcomes:[{chance:0.4,effects:{money:3000,happiness:6},log:"You won the counter-suit!",kind:"money"},{chance:0.6,effects:{money:-3000},log:"Both suits failed. Lawyer fees hurt.",kind:"bad"}]},
    ]},
  {id:"lg_inheritance", min:25, max:90, icon:"⚖️", title:"Disputed Will", text:"A relative's will is being contested by the family.",
    choices:[
      {label:"Lawyer up and fight", effects:{money:-2000}, log:"You hired a sharp attorney...", kind:"info", outcomes:[{chance:0.5,effects:{money:30000,happiness:8},log:"You won your share of the inheritance!",kind:"money"},{chance:0.5,effects:{happiness:-6,relRandom:-10},log:"You lost, and split the family.",kind:"bad"}]},
      {label:"Walk away", effects:{karma:5,relRandom:6}, log:"You let it go to keep the peace.", kind:"good"},
    ]},
  {id:"lg_jury", min:21, max:70, icon:"⚖️", title:"Jury Duty", text:"You've been summoned to serve on a jury.",
    choices:[
      {label:"Serve with integrity", effects:{karma:6,smarts:2,happiness:-2}, log:"You helped deliver a fair verdict.", kind:"good"},
      {label:"Try to get dismissed", effects:{karma:-3,happiness:2}, log:"You talked your way out of it.", kind:"info"},
    ]},
  {id:"lg_witness", min:18, max:90, icon:"⚖️", title:"Eyewitness", text:"You witnessed a crime. The police want you to testify.",
    choices:[
      {label:"Testify bravely", effects:{karma:10,happiness:3}, log:"Your testimony put a criminal away.", kind:"good", outcomes:[{chance:0.2,effects:{mental:-6},log:"...but you got threatening messages after.",kind:"bad"}]},
      {label:"Stay out of it", effects:{karma:-5,mental:-3}, log:"You refused to get involved.", kind:"info"},
    ]},
  {id:"lg_defamation", min:25, max:80, cond:{moneyMin:5000}, icon:"⚖️", title:"Defamation", text:"Someone has been spreading vicious lies about you online.",
    choices:[
      {label:"Sue for defamation", effects:{money:-2000}, log:"You filed a defamation suit...", kind:"info", outcomes:[{chance:0.55,effects:{money:15000,happiness:8,fame:3},log:"You won! They paid up and apologized.",kind:"money"},{chance:0.45,effects:{money:-1000,mental:-5},log:"Hard to prove. The case fizzled.",kind:"bad"}]},
      {label:"Ignore the haters", effects:{mental:-4}, log:"You rose above it. Mostly.", kind:"info"},
    ]},
  {id:"lg_ticket", min:18, max:90, icon:"⚖️", title:"Traffic Court", text:"You got a hefty speeding ticket.",
    choices:[
      {label:"Just pay it", effects:{money:-300,happiness:-2}, log:"You paid the fine.", kind:"money"},
      {label:"Contest it in court", effects:{}, log:"You argued your case...", kind:"info", outcomes:[{chance:0.45,effects:{happiness:4},log:"Ticket dismissed! No fine.",kind:"good"},{chance:0.55,effects:{money:-450},log:"Lost — fine plus court costs.",kind:"bad"}]},
    ]},
  {id:"lg_classaction", min:25, max:90, icon:"⚖️", title:"Class Action", text:"You're eligible to join a class-action lawsuit against a big company.",
    choices:[
      {label:"Join the suit", effects:{}, log:"You signed on...", kind:"info", outcomes:[{chance:0.6,effects:{money:1200},log:"The settlement paid out a small sum.",kind:"money"},{chance:0.4,effects:{},log:"The case dragged on with nothing yet.",kind:"info"}]},
      {label:"Opt out", effects:{}, log:"You skipped it.", kind:"info"},
    ]},
);
