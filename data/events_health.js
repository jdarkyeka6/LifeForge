/* ============================================================
   events_health.js — deeper body & mind events.
   ============================================================ */
window.GAME = window.GAME || {}; window.GAME.events = window.GAME.events || [];
window.GAME.events.push(
  {id:"hl_screening", min:35, max:120, icon:"⚕️", title:"Health Screening", text:"A routine screening flags something worth checking.",
    choices:[
      {label:"Get it investigated", effects:{money:-500}, log:"You followed up...", kind:"info", outcomes:[{chance:0.3,effects:{addCondition:true,health:-6},log:"They caught a condition early — treatable.",kind:"bad"},{chance:0.7,effects:{happiness:4},log:"False alarm. All clear!",kind:"good"}]},
      {label:"Ignore it", effects:{}, log:"You skipped the follow-up...", kind:"info", outcomes:[{chance:0.45,effects:{addCondition:true,health:-14},log:"It worsened into a real problem.",kind:"bad"},{chance:0.55,effects:{},log:"Probably nothing.",kind:"info"}]},
    ]},
  {id:"hl_injury", min:6, max:90, icon:"🩹", title:"Accident", text:"You took a bad fall and hurt yourself.",
    choices:[
      {label:"Go to the ER", effects:{money:-700,health:-5}, log:"Patched up properly.", kind:"money"},
      {label:"Walk it off", effects:{health:-12,addCondition:true}, log:"You should've seen a doctor.", kind:"bad"},
    ]},
  {id:"hl_sleep", min:14, max:90, icon:"🌙", title:"Sleepless", text:"You've barely slept in weeks.",
    choices:[
      {label:"Fix your sleep routine", effects:{mental:6,health:4,happiness:3}, log:"Rested at last.", kind:"good"},
      {label:"Power through on caffeine", effects:{mental:-6,health:-3}, log:"Running on fumes.", kind:"bad"},
    ]},
  {id:"hl_diet_choice", min:16, max:90, icon:"🥗", title:"Eating Habits", text:"You think about how you've been eating.",
    choices:[
      {label:"Clean up your diet", effects:{health:6,fitness:3,looks:2}, log:"You feel lighter and healthier.", kind:"good"},
      {label:"Comfort food era", effects:{happiness:5,health:-4,fitness:-3}, log:"Tasty, but it adds up.", kind:"info"},
    ]},
  {id:"hl_panic", min:14, max:90, cond:{}, icon:"🧠", title:"Panic Attack", text:"You had a frightening panic attack.",
    choices:[
      {label:"Seek help", effects:{mental:5,money:-200}, log:"Talking to a professional helped.", kind:"good"},
      {label:"Bottle it up", effects:{mental:-10}, log:"You told no one. It festers.", kind:"bad"},
    ]},
  {id:"hl_marathon", min:18, max:60, cond:{}, icon:"🏃", title:"Charity Run", text:"There's a charity marathon coming up.",
    choices:[
      {label:"Train and run it", effects:{fitness:8,health:5,karma:5,happiness:6}, log:"You crossed the finish line!", kind:"good", outcomes:[{chance:0.2,effects:{health:-6,addCondition:"chronic back pain"},log:"You pushed too hard and got injured.",kind:"bad"}]},
      {label:"Donate instead", effects:{money:-100,karma:4}, log:"You supported from the sidelines.", kind:"good"},
    ]},
  {id:"hl_quit_addiction", min:16, max:90, cond:{}, icon:"💊", title:"A Moment of Clarity", text:"You're thinking hard about your habits and health.",
    choices:[
      {label:"Commit to being healthier", effects:{health:5,mental:4}, log:"A fresh start for your body.", kind:"good"},
      {label:"Maybe tomorrow", effects:{}, log:"You'll deal with it later.", kind:"info"},
    ]},
);
