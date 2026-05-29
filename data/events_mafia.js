/* ============================================================
   events_mafia.js — only fire while in the mob (cond.hasMafia).
   ============================================================ */
window.GAME = window.GAME || {}; window.GAME.events = window.GAME.events || [];
window.GAME.events.push(
  {id:"mf_rival", min:18, max:80, cond:{hasMafia:true}, icon:"🕴️", title:"Rival Family", text:"A rival crew is muscling in on your turf.",
    choices:[
      {label:"Send a message", cls:"danger", effects:{karma:-8}, log:"You hit back hard...", kind:"info", outcomes:[{chance:0.55,effects:{happiness:5},log:"They backed off. Respect earned.",kind:"good"},{chance:0.45,effects:{health:-20,addCondition:true},log:"It turned into a bloody war.",kind:"bad"}]},
      {label:"Negotiate a truce", effects:{karma:2}, log:"You brokered an uneasy peace.", kind:"info"},
    ]},
  {id:"mf_rat", min:18, max:80, cond:{hasMafia:true}, icon:"🕴️", title:"A Rat", text:"Word is someone in the crew is talking to the feds.",
    choices:[
      {label:"Root them out", effects:{karma:-6}, log:"You investigated quietly...", kind:"info", outcomes:[{chance:0.5,effects:{happiness:4},log:"You found and dealt with the rat.",kind:"good"},{chance:0.5,effects:{jail:3},log:"You moved on the wrong person — and got caught up in a raid.",kind:"bad"}]},
      {label:"Lay low", effects:{mental:-4}, log:"You kept your distance from the heat.", kind:"info"},
    ]},
  {id:"mf_raid", min:18, max:80, cond:{hasMafia:true}, icon:"🚨", title:"Police Raid", text:"The feds are raiding mob businesses.",
    choices:[
      {label:"Destroy the evidence", effects:{}, log:"You scrambled to clean house...", kind:"info", outcomes:[{chance:0.6,effects:{happiness:3},log:"You stayed one step ahead.",kind:"good"},{chance:0.4,effects:{jail:4},log:"They got you. Off to prison.",kind:"bad"}]},
      {label:"Take the fall for the boss", effects:{jail:3,karma:4}, log:"You did the honorable thing — and the time.", kind:"bad"},
    ]},
  {id:"mf_tribute", min:18, max:80, cond:{hasMafia:true}, icon:"💰", title:"Kick Up", text:"The boss expects his cut this month.",
    choices:[
      {label:"Pay your tribute", effects:{money:-3000}, log:"You kicked up to the boss. Good standing.", kind:"money"},
      {label:"Skim off the top", cls:"danger", effects:{money:2000,karma:-4}, log:"You held some back...", kind:"info", outcomes:[{chance:0.4,effects:{health:-15},log:"The boss found out. You got roughed up.",kind:"bad"},{chance:0.6,effects:{},log:"No one noticed. This time.",kind:"info"}]},
    ]},
  {id:"mf_loyalty", min:18, max:80, cond:{hasMafia:true}, icon:"🕴️", title:"Test of Loyalty", text:"The family is testing where your loyalties lie.",
    choices:[
      {label:"Prove your loyalty", effects:{karma:-6,happiness:3}, log:"You passed the test. You're trusted now.", kind:"good"},
      {label:"Hesitate", effects:{}, log:"Your hesitation was noted...", kind:"info", outcomes:[{chance:0.4,effects:{health:-12},log:"They doubt you now — dangerously so.",kind:"bad"},{chance:0.6,effects:{},log:"You smoothed it over.",kind:"info"}]},
    ]},
);
