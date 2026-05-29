/* ============================================================
   events_religion.js — faith life (needs a religion).
   ============================================================ */
window.GAME = window.GAME || {}; window.GAME.events = window.GAME.events || [];
window.GAME.events.push(
  {id:"rel_crisis", min:14, max:120, cond:{hasFaith:true}, icon:"🛐", title:"Crisis of Faith", text:"You're doubting your beliefs.",
    choices:[
      {label:"Recommit with devotion", effects:{devotion:12,mental:6}, log:"You found your faith renewed.", kind:"good"},
      {label:"Question everything", effects:{devotion:-15,smarts:3}, log:"You wrestled with the big questions.", kind:"info"},
      {label:"Leave the faith", effects:{loseFaith:true,mental:-4}, log:"You walked away from your religion.", kind:"info"},
    ]},
  {id:"rel_pilgrim", min:18, max:120, cond:{hasFaith:true}, icon:"🛐", title:"Pilgrimage", text:"A holy pilgrimage is being organized.",
    choices:[
      {label:"Make the journey", effects:{money:-2000,devotion:18,mental:10,happiness:6}, log:"The pilgrimage moved you deeply.", kind:"good"},
      {label:"Stay home", effects:{devotion:-4}, log:"You couldn't make it this time.", kind:"info"},
    ]},
  {id:"rel_charity", min:14, max:120, cond:{hasFaith:true}, icon:"🛐", title:"Faith & Charity", text:"Your congregation is raising money for the needy.",
    choices:[
      {label:"Donate generously", effects:{money:-1000,devotion:10,karma:12,happiness:5}, log:"Your generosity uplifted many.", kind:"good"},
      {label:"Give what you can", effects:{money:-100,devotion:4,karma:4}, log:"Every bit helps.", kind:"good"},
      {label:"Keep your wallet shut", effects:{devotion:-4}, log:"You sat this one out.", kind:"info"},
    ]},
  {id:"rel_temptation", min:16, max:120, cond:{hasFaith:true}, icon:"🛐", title:"Temptation", text:"You're tempted to break a tenet of your faith.",
    choices:[
      {label:"Resist temptation", effects:{devotion:8,karma:5,mental:2}, log:"You stayed true to your values.", kind:"good"},
      {label:"Give in", effects:{devotion:-12,happiness:5,karma:-4}, log:"You strayed from the path.", kind:"bad"},
    ]},
  {id:"rel_miracle", min:14, max:120, cond:{hasFaith:true}, icon:"🛐", title:"A Sign", text:"Something happened that felt like a miracle.",
    choices:[
      {label:"Take it as a sign", effects:{devotion:14,happiness:10,mental:6}, log:"Your faith feels unshakeable now.", kind:"good"},
      {label:"Find a rational reason", effects:{smarts:3,devotion:-3}, log:"You explained it away.", kind:"info"},
    ]},
);
