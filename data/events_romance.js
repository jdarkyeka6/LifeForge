/* ============================================================
   events_romance.js — deeper love life (needs a partner).
   ============================================================ */
window.GAME = window.GAME || {}; window.GAME.events = window.GAME.events || [];
window.GAME.events.push(
  {id:"ro_surprise", min:16, max:120, cond:{hasPartner:true}, icon:"🌹", title:"A Sweet Gesture", text:"{partner} surprised you with something thoughtful.",
    choices:[
      {label:"Reciprocate big", effects:{money:-150,relPartner:12,happiness:8}, log:"You spoiled {partner} right back. ", kind:"good"},
      {label:"A heartfelt thank you", effects:{relPartner:7,happiness:5}, log:"Sometimes words are enough.", kind:"good"},
    ]},
  {id:"ro_jealousy", min:16, max:120, cond:{hasPartner:true}, icon:"😤", title:"Green-Eyed Monster", text:"{partner} got jealous seeing you laugh with someone else.",
    choices:[
      {label:"Reassure them", effects:{relPartner:8,mental:-2}, log:"You calmed their fears.", kind:"good"},
      {label:"Tell them to trust you", effects:{relPartner:-4}, log:"You stood your ground, a little coldly.", kind:"info"},
      {label:"Get defensive", cls:"danger", effects:{relPartner:-12,happiness:-4}, log:"It blew up into a fight.", kind:"bad"},
    ]},
  {id:"ro_distance", min:18, max:120, cond:{hasPartner:true}, icon:"💔", title:"Growing Apart", text:"Lately things with {partner} feel distant.",
    choices:[
      {label:"Plan a date night", effects:{money:-120,relPartner:12,happiness:6}, log:"You reconnected over dinner.", kind:"good"},
      {label:"Couples counseling", effects:{money:-300,relPartner:16,mental:4}, log:"Counseling worked wonders.", kind:"good"},
      {label:"Let it drift", effects:{relPartner:-12,mental:-4}, log:"You did nothing, and it showed.", kind:"bad"},
    ]},
  {id:"ro_loveletter", min:14, max:120, cond:{hasPartner:true}, icon:"💌", title:"Old Love Letter", text:"You found an old note {partner} once wrote you.",
    choices:[
      {label:"Share the memory", effects:{relPartner:9,happiness:6}, log:"You both got misty-eyed.", kind:"good"},
      {label:"Keep it to yourself", effects:{happiness:3}, log:"A private smile.", kind:"info"},
    ]},
  {id:"ro_meetcute", min:18, max:55, cond:{single:true}, icon:"💕", title:"Meet-Cute", text:"You bumped into a charming stranger at a coffee shop.",
    choices:[
      {label:"Ask for their number", effects:{}, log:"You worked up the nerve...", kind:"info", outcomes:[{chance:0.55,effects:{newLover:true,happiness:10},log:"You hit it off — you're dating!",kind:"good"},{chance:0.45,effects:{happiness:-3},log:"They were flattered but taken.",kind:"info"}]},
      {label:"Smile and move on", effects:{happiness:2}, log:"A nice little moment.", kind:"info"},
    ]},
  {id:"ro_triangle", min:18, max:60, cond:{hasPartner:true}, icon:"💕", title:"Love Triangle", text:"An ex resurfaces and says they still have feelings for you.",
    choices:[
      {label:"Shut it down", effects:{relPartner:8,karma:6,mental:2}, log:"You chose {partner} without hesitation.", kind:"good"},
      {label:"Entertain it", cls:"danger", effects:{}, log:"You let the flirtation continue...", kind:"info", outcomes:[{chance:0.5,effects:{relPartner:-30,mental:-8,karma:-10},log:"{partner} found out. Trust destroyed.",kind:"bad"},{chance:0.5,effects:{mental:-4},log:"You pulled back before it went too far.",kind:"info"}]},
    ]},
  {id:"ro_movein", min:18, max:70, cond:{hasLover:true}, icon:"🏠", title:"Moving In", text:"{partner} suggests moving in together.",
    choices:[
      {label:"Move in together", effects:{relPartner:14,happiness:10,money:-1000}, log:"You took the next big step with {partner}!", kind:"good"},
      {label:"Not yet", effects:{relPartner:-6}, log:"You asked to wait. {partner} understood, mostly.", kind:"info"},
    ]},
);
