/* ============================================================
   events_sports.js — the pro athlete career, with real
   seasons: drafts, finals, injuries, trades, legacy.
   Gated on cond.career:"athlete".
   ============================================================ */
window.GAME = window.GAME || {}; window.GAME.events = window.GAME.events || [];
window.GAME.events.push(

  {id:"sp_draft", min:17, max:24, once:true, weight:1.6, icon:"📋", title:"Draft Day", cond:{career:"athlete"},
    text:"It's draft day. Scouts have been watching you all season.",
    choices:[
      {label:"Leave it all on the field at the combine", effects:{fitness:3,mental:-2}, log:"You gave the performance of your life.", kind:"info",
        outcomes:[{chance:0.6,effects:{money:30000,fame:6,happiness:12,gainPerf:14},log:"First-round pick! A massive signing bonus.",kind:"good"},{chance:0.4,effects:{fame:2,happiness:4,gainPerf:6},log:"Picked in a later round — but you made the cut.",kind:"info"}]},
    ]},

  {id:"sp_finals", min:18, max:40, weight:1.2, icon:"🏆", title:"Championship Final", cond:{career:"athlete"},
    text:"Your team made it to the final. It all comes down to this.",
    choices:[
      {label:"Take the game-winning shot", effects:{fitness:1}, log:"The whole stadium holds its breath...", kind:"info",
        outcomes:[{chance:0.55,effects:{money:50000,fame:12,happiness:18,gainPerf:16,followers:10000},log:"YOU WIN IT! You're a champion and a legend.",kind:"good"},{chance:0.45,effects:{mental:-6,fame:2,gainPerf:4},log:"So close — you lost the final. Heartbreak.",kind:"bad"}]},
      {label:"Pass to your teammate", effects:{karma:5,relRandom:4}, log:"The selfless play.", kind:"info",
        outcomes:[{chance:0.5,effects:{money:35000,fame:8,happiness:12,gainPerf:12},log:"They scored! A team triumph.",kind:"good"}]},
    ]},

  {id:"sp_injury", min:18, max:42, weight:1.0, icon:"🤕", title:"Serious Injury", cond:{career:"athlete"},
    text:"You go down hard in training — it's a serious injury.",
    choices:[
      {label:"Rehab patiently and properly", effects:{money:-3000,fitness:-6,mental:-4}, log:"Long months of physio.", kind:"info",
        outcomes:[{chance:0.7,effects:{fitness:8,happiness:6,gainPerf:6},log:"You came back stronger than ever.",kind:"good"},{chance:0.3,effects:{fitness:-8,gainPerf:-10},log:"You never quite regained your old form.",kind:"bad"}]},
      {label:"Rush back too soon", effects:{gainPerf:4}, log:"You couldn't stand the bench.", kind:"info",
        outcomes:[{chance:0.6,effects:{health:-15,fitness:-12,addCondition:"chronic back pain"},log:"You re-injured it badly. A real setback.",kind:"bad"}]},
    ]},

  {id:"sp_trade", min:19, max:38, weight:0.9, icon:"🔁", title:"Trade Rumors", cond:{career:"athlete"},
    text:"Another club wants to trade for you — bigger city, bigger money.",
    choices:[
      {label:"Push for the move", effects:{money:20000,fame:3,gainPerf:6}, log:"New jersey, fresh start, fatter paycheck.", kind:"money",
        outcomes:[{chance:0.4,effects:{happiness:-4,relRandom:-5},log:"Uprooting your life was harder than expected.",kind:"bad"}]},
      {label:"Stay loyal to your team", effects:{karma:5,happiness:5,relRandom:6}, log:"The fans love a one-club legend.", kind:"good"},
    ]},

  {id:"sp_doping", min:19, max:40, weight:0.6, icon:"💊", title:"The Doping Offer", cond:{career:"athlete"},
    text:"A shady trainer offers you performance-enhancing drugs to get an edge.",
    choices:[
      {label:"Refuse and report it", effects:{karma:8,happiness:3,gainPerf:2}, log:"You kept your integrity intact.", kind:"good"},
      {label:"Take the risk", effects:{fitness:6,gainPerf:8}, log:"You got a real edge on the field.", kind:"info",
        outcomes:[{chance:0.4,effects:{fame:-12,money:-20000,gainPerf:-15,karma:-10,mental:-8},log:"You failed a drug test. Banned in disgrace.",kind:"bad"}]},
    ]},

  {id:"sp_rivalry", min:18, max:40, weight:0.8, icon:"😤", title:"Bitter Rival", cond:{career:"athlete"},
    text:"A rival athlete keeps trash-talking you in the press.",
    choices:[
      {label:"Answer with your performance", effects:{fitness:2,gainPerf:6,fame:2}, log:"You let your game do the talking.", kind:"good"},
      {label:"Fire back in the media", effects:{fame:4,followers:3000}, log:"The feud made headlines.", kind:"info",
        outcomes:[{chance:0.4,effects:{karma:-4,mental:-3},log:"It got ugly and made you both look bad.",kind:"bad"}]},
    ]},

  {id:"sp_retire", min:33, max:45, weight:0.8, icon:"🎖️", title:"Hanging It Up", cond:{career:"athlete"},
    text:"Your body is telling you the end of your playing days is near.",
    choices:[
      {label:"Retire as a legend on top", effects:{fame:6,happiness:10,money:15000}, log:"You went out on your own terms, a hero.", kind:"good"},
      {label:"Move into coaching", effects:{happiness:6,smarts:3,gainPerf:4}, log:"You'll shape the next generation now.", kind:"good"},
      {label:"Chase one more season", effects:{}, log:"You weren't ready to quit.", kind:"info",
        outcomes:[{chance:0.5,effects:{health:-10,fame:-2},log:"One season too many — it showed.",kind:"bad"},{chance:0.5,effects:{fame:4,happiness:6},log:"A glorious farewell campaign!",kind:"good"}]},
    ]},

);
