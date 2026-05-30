/* ============================================================
   events_wellness.js — managing body & mind.
   Builds on events_health.js, but focuses on TREATMENT:
   therapy, rehab, surgery decisions, insurance. Several are
   gated on having a condition or addiction so they feel earned.
   ============================================================ */
window.GAME = window.GAME || {}; window.GAME.events = window.GAME.events || [];
window.GAME.events.push(

  {id:"wl_therapy", min:16, max:100, weight:0.9, icon:"🛋️", title:"Therapy", cond:{hasCondition:true},
    text:"A friend gently suggests you talk to a therapist about what you've been carrying.",
    choices:[
      {label:"Start weekly therapy", effects:{money:-1200,mental:12,cureCondition:true}, log:"It was hard work, but you feel lighter.", kind:"good"},
      {label:"\"I'm fine, I'll handle it\"", effects:{mental:-4}, log:"You bottled it up again.", kind:"bad"},
    ]},

  {id:"wl_rehab", min:18, max:100, weight:1.1, icon:"🏥", title:"Rock Bottom", cond:{hasAddiction:true},
    text:"Your addiction is taking over your life. Loved ones stage an intervention.",
    choices:[
      {label:"Check into rehab", effects:{money:-6000,health:6,mental:8}, log:"30 days of hard work. You came out clean.", kind:"good",
        outcomes:[{chance:0.75,effects:{cureCondition:true,happiness:6},log:"You beat it. One day at a time.",kind:"good"},{chance:0.25,effects:{mental:-3},log:"You relapsed, but you know the way back now.",kind:"bad"}]},
      {label:"Refuse help", effects:{health:-8,mental:-6,relAll:-4}, log:"You pushed everyone away. It's getting worse.", kind:"bad"},
    ]},

  {id:"wl_surgery", min:30, max:100, weight:0.7, icon:"🔪", title:"Surgery Decision", cond:{hasCondition:true},
    text:"A specialist recommends surgery to treat a lingering condition.",
    choices:[
      {label:"Have the operation", effects:{money:-9000}, log:"You went under the knife.", kind:"money",
        outcomes:[{chance:0.75,effects:{health:18,cureCondition:true,happiness:6},log:"The surgery was a success — you feel new.",kind:"good"},{chance:0.25,effects:{health:-12,mental:-4},log:"Complications meant a long, hard recovery.",kind:"bad"}]},
      {label:"Manage it without surgery", effects:{health:-3}, log:"You opted for physio and medication instead.", kind:"info"},
    ]},

  {id:"wl_mentalday", min:16, max:100, weight:0.8, icon:"🌿", title:"Burned Out", text:"You've been running on empty for months.",
    choices:[
      {label:"Take a real mental-health break", effects:{mental:10,happiness:6,money:-300}, log:"A week to breathe did wonders.", kind:"good"},
      {label:"Push through it", effects:{mental:-6,health:-2}, log:"You ground yourself down further.", kind:"bad"},
    ]},

  {id:"wl_insurance", min:25, max:100, weight:0.6, icon:"📑", title:"Insurance Renewal", text:"Your health insurance is up for renewal — the premiums went up again.",
    choices:[
      {label:"Pay for the comprehensive plan", effects:{money:-2400,mental:3}, log:"Peace of mind isn't cheap, but it's worth it.", kind:"money"},
      {label:"Downgrade to bare-bones cover", effects:{money:-600}, log:"You're rolling the dice on your health.", kind:"info",
        outcomes:[{chance:0.25,effects:{money:-12000,mental:-6},log:"An emergency hit and you weren't covered. Brutal bills.",kind:"bad"}]},
    ]},

  {id:"wl_secondopinion", min:35, max:100, weight:0.6, icon:"🩻", title:"Second Opinion", cond:{hasCondition:true},
    text:"Something about your diagnosis doesn't sit right with you.",
    choices:[
      {label:"Get a second opinion", effects:{money:-400,smarts:2}, log:"You advocated for yourself.", kind:"info",
        outcomes:[{chance:0.4,effects:{health:8,cureCondition:true,happiness:5},log:"The first doctor was wrong — the real fix was simpler!",kind:"good"},{chance:0.6,effects:{},log:"The diagnosis was confirmed. At least now you're sure.",kind:"info"}]},
      {label:"Trust the first doctor", effects:{}, log:"You stuck with the original plan.", kind:"info"},
    ]},

  {id:"wl_fitness_plan", min:16, max:100, weight:0.8, icon:"🏃", title:"Get In Shape", text:"You decide it's time to take your fitness seriously.",
    choices:[
      {label:"Hire a personal trainer", effects:{money:-1500,fitness:10,health:6,looks:3}, log:"The results show — you feel strong.", kind:"good"},
      {label:"Start running for free", effects:{fitness:6,health:3,happiness:2}, log:"Just you and the open road.", kind:"good"},
      {label:"Maybe next year", effects:{fitness:-2}, log:"The couch won again.", kind:"info"},
    ]},

  {id:"wl_meditation", min:14, max:100, weight:0.7, icon:"🧘", title:"Mindfulness", text:"A meditation app keeps popping up in your feed.",
    choices:[
      {label:"Build a daily practice", effects:{mental:8,happiness:4,smarts:1}, log:"Ten minutes a day changed your headspace.", kind:"good"},
      {label:"Not for you", effects:{}, log:"You closed the app.", kind:"info"},
    ]},

);
