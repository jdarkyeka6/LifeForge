/* ============================================================
   events_emergency.js — fires, ambulances, crashes & disasters.
   Two flavours:
     • Disasters that can strike ANY life (house fires, quakes,
       crashes, rescues where you're the bystander hero).
     • On-the-job calls for emergency responders — gated by
       cond.career so they only fire for the right profession
       (firefighter / paramedic / police).
   Schema matches the rest of data/events_*.js.
   ============================================================ */
window.GAME = window.GAME || {}; window.GAME.events = window.GAME.events || [];
window.GAME.events.push(

  /* ---------------- DISASTERS — anyone ---------------- */

  {id:"em_house_fire", min:4, max:100, weight:0.6, icon:"🔥", title:"House Fire!",
    text:"You wake to the smoke alarm screaming — there's a fire in the kitchen and smoke filling the hall.",
    choices:[
      {label:"Grab everyone and get out", effects:{happiness:-6,karma:4}, log:"You got everyone out safely. The house is damaged, but you're alive.", kind:"info",
        outcomes:[{chance:0.35,effects:{health:-10,addCondition:"smoke inhalation"},log:"You breathed in smoke pulling someone clear.",kind:"bad"},{chance:0.65,effects:{},log:"Everyone made it out unharmed.",kind:"good"}]},
      {label:"Try to fight it yourself", effects:{}, log:"You grabbed the extinguisher.", kind:"info",
        outcomes:[{chance:0.45,effects:{happiness:5,money:-2000},log:"You put it out! Minor damage only.",kind:"good"},{chance:0.55,effects:{health:-18,money:-9000,addCondition:"second-degree burns"},log:"The fire spread — you were burned and the house gutted.",kind:"bad"}]},
      {label:"Run — save yourself", effects:{happiness:-8,karma:-6,money:-9000}, log:"You bolted. The house was lost and the guilt lingers.", kind:"bad"},
    ]},

  {id:"em_wildfire", min:6, max:100, weight:0.5, icon:"🌲", title:"Wildfire Evacuation",
    text:"A wildfire is racing toward town. Authorities order an immediate evacuation.",
    choices:[
      {label:"Leave now with the essentials", effects:{happiness:-4,health:-1}, log:"You evacuated early and stayed safe.", kind:"good"},
      {label:"Stay and hose down the roof", effects:{}, log:"You gambled and stayed behind.", kind:"info",
        outcomes:[{chance:0.4,effects:{happiness:6,fame:1},log:"You saved your home — neighbours called you brave.",kind:"good"},{chance:0.6,effects:{health:-15,money:-12000,addCondition:"smoke inhalation"},log:"The fire jumped the road. You barely escaped.",kind:"bad"}]},
    ]},

  {id:"em_earthquake", min:5, max:100, weight:0.5, icon:"🌍", title:"Earthquake",
    text:"The ground heaves. Shelves topple and car alarms wail across the city.",
    choices:[
      {label:"Drop, cover and hold on", effects:{mental:-3}, log:"You sheltered under a table until the shaking stopped.", kind:"info",
        outcomes:[{chance:0.25,effects:{health:-8,addCondition:"a concussion"},log:"A falling shelf clipped your head.",kind:"bad"},{chance:0.75,effects:{},log:"You came through unscathed.",kind:"good"}]},
      {label:"Run outside", effects:{}, log:"You sprinted for the door.", kind:"info",
        outcomes:[{chance:0.5,effects:{health:-12},log:"Falling debris caught you on the way out.",kind:"bad"},{chance:0.5,effects:{happiness:2},log:"You made it to open ground safely.",kind:"good"}]},
    ]},

  {id:"em_flood", min:5, max:100, weight:0.5, icon:"🌊", title:"Flash Flood",
    text:"Days of rain have burst the river. Water is rising fast through the ground floor.",
    choices:[
      {label:"Move valuables upstairs and wait it out", effects:{money:-1500,happiness:-3}, log:"You saved what you could. The cleanup will be brutal.", kind:"info"},
      {label:"Wade out to help neighbours", effects:{karma:8,happiness:3}, log:"You helped an elderly couple to safety.", kind:"good",
        outcomes:[{chance:0.3,effects:{health:-9},log:"The current was stronger than it looked.",kind:"bad"}]},
    ]},

  {id:"em_car_crash", min:1, max:100, weight:0.55, icon:"💥", title:"Car Accident",
    text:"Out of nowhere, another car runs the light and slams into yours.",
    choices:[
      {label:"Check yourself, then call 911", effects:{mental:-4}, log:"You called for help and waited for the ambulance.", kind:"info",
        outcomes:[{chance:0.4,effects:{health:-14,addCondition:"whiplash"},log:"The paramedics treated you for whiplash and shock.",kind:"bad"},{chance:0.3,effects:{health:-25,addCondition:"a concussion",money:1200},log:"You were hospitalised, but the other driver was at fault — insurance paid out.",kind:"bad"},{chance:0.3,effects:{money:1500},log:"Shaken but fine — and the payout covered a new car.",kind:"money"}]},
    ]},

  {id:"em_choking_hero", min:10, max:100, weight:0.5, icon:"🫁", title:"Someone's Choking!",
    text:"At a restaurant, a man at the next table suddenly clutches his throat — he can't breathe.",
    choices:[
      {label:"Do the Heimlich maneuver", effects:{}, log:"You leapt up to help.", kind:"info",
        outcomes:[{chance:0.8,effects:{karma:10,happiness:8,fame:1},log:"It worked! You saved his life — the whole room applauded.",kind:"good"},{chance:0.2,effects:{mental:-5,karma:3},log:"You tried your best until the paramedics arrived.",kind:"info"}]},
      {label:"Shout for someone trained", effects:{karma:2}, log:"You called for help and a nurse stepped in.", kind:"info"},
    ]},

  {id:"em_cardiac_bystander", min:14, max:100, weight:0.45, icon:"❤️‍🩹", title:"Medical Emergency",
    text:"A stranger collapses on the sidewalk in front of you, unresponsive.",
    choices:[
      {label:"Start CPR and call an ambulance", effects:{mental:-3}, log:"You started chest compressions immediately.", kind:"info",
        outcomes:[{chance:0.65,effects:{karma:12,happiness:7,fame:2},log:"The paramedics took over — they said your CPR kept them alive.",kind:"good"},{chance:0.35,effects:{mental:-8,karma:5},log:"You did everything you could, but they didn't make it.",kind:"bad"}]},
      {label:"Call for help and direct traffic", effects:{karma:4}, log:"You called 911 and cleared space for the ambulance.", kind:"good"},
    ]},

  {id:"em_gas_leak", min:8, max:100, weight:0.45, icon:"⚠️", title:"Gas Leak",
    text:"You catch a strong smell of gas in your building's stairwell.",
    choices:[
      {label:"Evacuate and pull the alarm", effects:{karma:6,happiness:2}, log:"You got everyone out and called it in. The fire crew found a real leak — you may have saved lives.", kind:"good"},
      {label:"Ignore it — probably nothing", effects:{}, log:"You went back to bed.", kind:"info",
        outcomes:[{chance:0.3,effects:{health:-12,addCondition:"smoke inhalation"},log:"There WAS a leak. You woke up dizzy and sick.",kind:"bad"}]},
    ]},

  {id:"em_storm_outage", min:5, max:100, weight:0.5, icon:"⛈️", title:"Storm & Blackout",
    text:"A violent storm knocks out the power for the whole neighbourhood.",
    choices:[
      {label:"Check on elderly neighbours", effects:{karma:6,happiness:3,relRandom:4}, log:"You brought blankets and candles to the folks next door.", kind:"good"},
      {label:"Light some candles and wait", effects:{happiness:2,mental:2}, log:"A cozy candlelit night, oddly peaceful.", kind:"info"},
    ]},

  {id:"em_tornado", min:6, max:100, weight:0.4, icon:"🌪️", title:"Tornado Warning",
    text:"The sirens sound — a tornado has been spotted heading your way.",
    choices:[
      {label:"Take shelter in the basement", effects:{mental:-2}, log:"You waited it out below ground. It passed close, but you're safe.", kind:"good"},
      {label:"Film it for the internet", effects:{followers:200,happiness:3}, log:"Reckless, but the footage went viral.", kind:"info",
        outcomes:[{chance:0.4,effects:{health:-16,addCondition:"a concussion"},log:"Flying debris caught you. Not worth the views.",kind:"bad"}]},
    ]},

  /* ---------------- ON THE JOB — Firefighter ---------------- */

  {id:"em_ff_rescue", min:18, max:75, weight:1.4, icon:"🚒", title:"Structure Fire", cond:{career:"firefighter"},
    text:"Dispatch sends your engine to a house fire — and there's a child still trapped on the second floor.",
    choices:[
      {label:"Go in after them", effects:{}, log:"You pulled your mask down and went in.", kind:"info",
        outcomes:[{chance:0.7,effects:{karma:12,happiness:9,fame:3,gainPerf:14},log:"You carried the child out alive. The town calls you a hero.",kind:"good"},{chance:0.3,effects:{health:-20,addCondition:"second-degree burns",gainPerf:8,fame:2},log:"You got them out — but a ceiling collapse burned you badly.",kind:"bad"}]},
      {label:"Wait for backup and water", effects:{gainPerf:-6,karma:-4,mental:-6}, log:"By the book — but the rescue was delayed. It weighs on you.", kind:"bad"},
    ]},

  {id:"em_ff_backdraft", min:18, max:75, weight:1.1, icon:"💨", title:"Backdraft", cond:{career:"firefighter"},
    text:"You're at a warehouse blaze. The door you're about to open is hot — your gut says backdraft.",
    choices:[
      {label:"Trust your training — vent the roof first", effects:{gainPerf:10,smarts:2,happiness:4}, log:"You vented first. The crew stayed safe and the captain noticed.", kind:"good"},
      {label:"Open it now to reach the seat of the fire", effects:{}, log:"You forced the door.", kind:"info",
        outcomes:[{chance:0.6,effects:{health:-22,addCondition:"second-degree burns"},log:"Backdraft. A fireball threw you across the bay.",kind:"bad"},{chance:0.4,effects:{gainPerf:6},log:"You got lucky this time.",kind:"info"}]},
    ]},

  {id:"em_ff_cat", min:18, max:75, weight:0.9, icon:"🐱", title:"Cat in a Tree", cond:{career:"firefighter"},
    text:"A frantic kid begs your crew to rescue her cat from a tall tree.",
    choices:[
      {label:"Run the ladder up", effects:{karma:5,happiness:5,relRandom:2}, log:"Cat rescued. The kid's smile made the whole shift worth it.", kind:"good"},
      {label:"\"We're not really a cat service, kid\"", effects:{karma:-3,happiness:-2}, log:"You waved it off. The kid cried. Ouch.", kind:"bad"},
    ]},

  /* ---------------- ON THE JOB — Paramedic / Ambulance ---------------- */

  {id:"em_pm_save", min:18, max:70, weight:1.4, icon:"🚑", title:"Ambulance Call", cond:{career:"paramedic"},
    text:"You're first on scene to a cardiac arrest. The patient has no pulse and every second counts.",
    choices:[
      {label:"Shock and run the protocol cleanly", effects:{}, log:"You charged the defibrillator.", kind:"info",
        outcomes:[{chance:0.7,effects:{karma:12,happiness:10,gainPerf:14,fame:1},log:"You got a pulse back! A life saved on the curb.",kind:"good"},{chance:0.3,effects:{mental:-7,gainPerf:5,addCondition:"PTSD"},log:"You did everything right, but lost them. It sticks with you.",kind:"bad"}]},
    ]},

  {id:"em_pm_baby", min:18, max:60, weight:1.0, icon:"👶", title:"Baby On Board", cond:{career:"paramedic"},
    text:"You're transporting a woman in labour — but the baby is coming RIGHT NOW, in the back of the rig.",
    choices:[
      {label:"Deliver the baby yourself", effects:{karma:10,happiness:12,gainPerf:12,fame:2}, log:"You delivered a healthy baby on the freeway. The family named the kid after you!", kind:"good"},
      {label:"Floor it for the hospital", effects:{gainPerf:-2}, log:"You raced the clock.", kind:"info",
        outcomes:[{chance:0.5,effects:{happiness:6,gainPerf:4},log:"Made it to the doors just in time.",kind:"good"},{chance:0.5,effects:{mental:-4},log:"You ended up delivering at the ER ramp anyway.",kind:"info"}]},
    ]},

  {id:"em_pm_mci", min:18, max:65, weight:1.0, icon:"🚨", title:"Mass Casualty", cond:{career:"paramedic"},
    text:"A multi-car pileup on the highway. There are more patients than there are hands.",
    choices:[
      {label:"Triage — treat who you can save", effects:{smarts:2,gainPerf:12,mental:-5}, log:"You made the hard calls and saved the ones who could be saved.", kind:"info",
        outcomes:[{chance:0.3,effects:{addCondition:"PTSD",fame:2,karma:8},log:"You were hailed as a hero, but the night left scars.",kind:"bad"}]},
      {label:"Freeze under the pressure", effects:{gainPerf:-10,mental:-8,addCondition:"PTSD"}, log:"It was too much. You couldn't move, and you'll never forget it.", kind:"bad"},
    ]},

  /* ---------------- ON THE JOB — Police ---------------- */

  {id:"em_pd_chase", min:18, max:65, weight:1.1, icon:"🚓", title:"High-Speed Pursuit", cond:{career:"police"},
    text:"A stolen car blows past you at 90mph through a residential area.",
    choices:[
      {label:"Pursue carefully, call it in", effects:{gainPerf:8,fitness:1}, log:"You boxed them in with backup. Clean arrest.", kind:"good",
        outcomes:[{chance:0.25,effects:{health:-10,addCondition:"whiplash"},log:"They clipped your cruiser before stopping.",kind:"bad"}]},
      {label:"Break off — too dangerous for the street", effects:{gainPerf:-3,karma:5}, log:"You let them go rather than risk lives. The right call, if not the popular one.", kind:"info"},
    ]},

  {id:"em_pd_talkdown", min:18, max:65, weight:1.0, icon:"🤝", title:"On the Ledge", cond:{career:"police"},
    text:"A distraught person is standing on a bridge railing. You're the first officer there.",
    choices:[
      {label:"Talk to them, calm and slow", effects:{}, log:"You kept your voice steady and just... listened.", kind:"info",
        outcomes:[{chance:0.75,effects:{karma:12,happiness:8,gainPerf:10,fame:2},log:"They took your hand and stepped down. You saved a life with words.",kind:"good"},{chance:0.25,effects:{mental:-9,addCondition:"PTSD",karma:6},log:"You did all you could, but couldn't reach them in time.",kind:"bad"}]},
    ]},

);
