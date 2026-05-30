/* ============================================================
   events_eras.js — era-defining world events.
   Extends events_world.js with rarer, sweeping moments that
   color a whole life. Low weight so they feel momentous.
   ============================================================ */
window.GAME = window.GAME || {}; window.GAME.events = window.GAME.events || [];
window.GAME.events.push(

  {id:"er_ai_revolution", min:14, max:100, weight:0.4, icon:"🤖", title:"The AI Revolution", text:"Artificial intelligence is suddenly reshaping every industry overnight.",
    choices:[
      {label:"Reskill and ride the wave", effects:{smarts:6,money:-500}, log:"You learned the new tools early.", kind:"good",
        outcomes:[{chance:0.6,effects:{money:12000,happiness:5},log:"Your new AI skills made you indispensable — and rich.",kind:"money"}]},
      {label:"Resist and stick to the old ways", effects:{}, log:"You refused to change.", kind:"info",
        outcomes:[{chance:0.4,effects:{loseJob:true,mental:-6},log:"Your role was automated away.",kind:"bad"}]},
    ]},

  {id:"er_climate_crisis", min:10, max:100, weight:0.4, icon:"🌡️", title:"Climate Emergency", text:"Record heat and wild weather are forcing the world to change fast.",
    choices:[
      {label:"Go green — solar, EV, the works", effects:{money:-4000,karma:8,happiness:3}, log:"You cut your footprint and felt good about it.", kind:"good"},
      {label:"Carry on as normal", effects:{karma:-3}, log:"Someone else's problem, you figured.", kind:"info"},
    ]},

  {id:"er_market_crash", min:18, max:100, weight:0.4, icon:"💸", title:"The Great Crash", text:"The stock market has collapsed. Fortunes are evaporating overnight.",
    choices:[
      {label:"Buy the dip with everything you've got", effects:{money:-5000}, log:"Greedy when others are fearful.", kind:"money",
        outcomes:[{chance:0.55,effects:{money:22000,smarts:3,happiness:6},log:"You bought at the bottom and made a killing.",kind:"good"},{chance:0.45,effects:{money:-4000,mental:-5},log:"It kept falling. Ouch.",kind:"bad"}]},
      {label:"Move everything to cash", effects:{happiness:-2,mental:2}, log:"You sat it out safely on the sidelines.", kind:"info"},
    ]},

  {id:"er_social_movement", min:14, max:100, weight:0.5, icon:"✊", title:"A Movement Rises", text:"A massive social movement is sweeping the country and demands you pick a side.",
    choices:[
      {label:"Join the cause publicly", effects:{karma:7,happiness:4,fame:1,followers:300}, log:"You stood up and were counted.", kind:"good"},
      {label:"Quietly support from home", effects:{karma:3}, log:"You helped where you could, privately.", kind:"info"},
      {label:"Stay out of it entirely", effects:{}, log:"You kept your head down.", kind:"info"},
    ]},

  {id:"er_energy_crisis", min:16, max:100, weight:0.4, icon:"🔌", title:"Energy Crisis", text:"Fuel and power prices have skyrocketed. Everyone's bills are doubling.",
    choices:[
      {label:"Invest in home solar & batteries", effects:{money:-6000,happiness:3}, log:"Pricey now, but you're off the grid.", kind:"money",
        outcomes:[{chance:0.7,effects:{money:4000,smarts:2},log:"It paid for itself faster than expected.",kind:"good"}]},
      {label:"Cut back and bundle up", effects:{money:-1000,happiness:-2}, log:"A cold, frugal winter.", kind:"info"},
    ]},

  {id:"er_space_age", min:8, max:100, weight:0.35, icon:"🚀", title:"New Space Age", text:"Humanity just put the first permanent colony on the Moon. The world is electrified.",
    choices:[
      {label:"Get swept up in the optimism", effects:{happiness:8,smarts:2}, log:"Anything feels possible now.", kind:"good"},
      {label:"Invest in a space startup", effects:{money:-3000}, log:"You bought into the final frontier.", kind:"money",
        outcomes:[{chance:0.45,effects:{money:18000,fame:1},log:"Moonshot literally paid off.",kind:"good"}]},
    ]},

  {id:"er_viral_trend", min:10, max:100, weight:0.5, icon:"📱", title:"Internet Mania", text:"A bizarre new trend is taking over the entire internet.",
    choices:[
      {label:"Jump on it for clout", effects:{followers:800,happiness:4}, log:"You went viral riding the trend.", kind:"info",
        outcomes:[{chance:0.3,effects:{happiness:-5,fame:-1},log:"It aged badly and you got mocked.",kind:"bad"}]},
      {label:"Roll your eyes and ignore it", effects:{smarts:1}, log:"Too cool for the trend, apparently.", kind:"info"},
    ]},

  {id:"er_political_upheaval", min:18, max:100, weight:0.4, icon:"🏛️", title:"Political Upheaval", text:"A dramatic election shakes up the country's entire direction.",
    choices:[
      {label:"Get politically active", effects:{karma:4,smarts:2,mental:-2}, log:"You threw yourself into civic life.", kind:"info"},
      {label:"Tune out the chaos", effects:{mental:3}, log:"You logged off and protected your peace.", kind:"good"},
    ]},

);
