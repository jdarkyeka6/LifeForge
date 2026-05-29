/* ============================================================
   events_zodiac.js — light astrology flavour, gated by sign.
   ============================================================ */
window.GAME = window.GAME || {}; window.GAME.events = window.GAME.events || [];
window.GAME.events.push(
  {id:"zo_aries", min:10, max:90, weight:0.4, cond:{zodiac:"aries"}, icon:"🔯", title:"Aries Energy", text:"Your fiery Aries nature is pushing you to act.",
    choices:[{label:"Charge ahead", effects:{happiness:5,fitness:2}, log:"You seized the day, Aries-style.", kind:"good"},{label:"Hold back for once", effects:{mental:3}, log:"A rare moment of restraint.", kind:"info"}]},
  {id:"zo_leo", min:10, max:90, weight:0.4, cond:{zodiac:"leo"}, icon:"🔯", title:"Leo Spotlight", text:"As a Leo, you crave the spotlight.",
    choices:[{label:"Take center stage", effects:{fame:3,happiness:5}, log:"You shone like the lion you are.", kind:"good"},{label:"Share the limelight", effects:{karma:4,relAll:2}, log:"Gracious for a Leo.", kind:"good"}]},
  {id:"zo_scorpio", min:10, max:90, weight:0.4, cond:{zodiac:"scorpio"}, icon:"🔯", title:"Scorpio Intensity", text:"Your Scorpio intensity is hard to ignore.",
    choices:[{label:"Channel it", effects:{smarts:3,mental:3}, log:"You turned intensity into focus.", kind:"good"},{label:"Hold a grudge", effects:{karma:-4}, log:"Classic Scorpio. You won't forget.", kind:"info"}]},
  {id:"zo_pisces", min:10, max:90, weight:0.4, cond:{zodiac:"pisces"}, icon:"🔯", title:"Pisces Dreams", text:"Your dreamy Pisces mind is wandering.",
    choices:[{label:"Create something", effects:{happiness:5,smarts:2}, log:"You poured your dreams into art.", kind:"good"},{label:"Get lost in daydreams", effects:{mental:3,smarts:-1}, log:"Hours drifted by.", kind:"info"}]},
  // generic horoscope event for ANY sign
  {id:"zo_horoscope", min:12, max:90, weight:0.6, cond:{}, icon:"🔮", title:"Your Horoscope", text:"You read your horoscope for the year.",
    choices:[
      {label:"Believe it", effects:{happiness:3,mental:2}, log:"The stars gave you something to hold onto.", kind:"good"},
      {label:"It's just for fun", effects:{}, log:"You had a chuckle and moved on.", kind:"info"},
    ]},
);
