#!/usr/bin/env node
/* ============================================================
   tools/genevents.js — builds the json/ event library.
   1) Exports the 298 curated events (from data/events_*.js) to
      json/events/curated/<prefix>.json  (reference copies).
   2) Procedurally generates a large, varied themed library to
      json/events/generated/part_NNN.json  (these are what the
      game loads at runtime — all use the unique "gen_" prefix).
   3) Writes json/index.json manifest.
   Deterministic: no randomness, so output is stable & regenerable.
   Run:  node tools/genevents.js
   ============================================================ */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const JSON_DIR = path.join(ROOT, "json");
const CUR_DIR = path.join(JSON_DIR, "events", "curated");
const GEN_DIR = path.join(JSON_DIR, "events", "generated");
[JSON_DIR, path.join(JSON_DIR, "events"), CUR_DIR, GEN_DIR].forEach(d => fs.mkdirSync(d, { recursive: true }));

/* ---------- helpers ---------- */
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const pick = (arr, i) => arr[i % arr.length];

/* ---------- 1) export curated events ---------- */
function exportCurated() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const files = [...html.matchAll(/<script src="(data\/events_[^"]+)"><\/script>/g)].map(m => m[1]);
  for (const f of files) vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), sandbox, { filename: f });
  const all = sandbox.window.GAME.events || [];
  const byPrefix = {};
  all.forEach(e => { const p = (e.id.split("_")[0] || "misc"); (byPrefix[p] = byPrefix[p] || []).push(e); });
  const written = [];
  for (const p of Object.keys(byPrefix).sort()) {
    const name = `${p}.json`;
    fs.writeFileSync(path.join(CUR_DIR, name), JSON.stringify(byPrefix[p], null, 2));
    written.push("curated/" + name);
  }
  return { files: written, count: all.length };
}

/* ---------- 2) generate library ---------- */
// small effect palettes keyed by tone
const GOOD = [{happiness:5,mental:2},{happiness:6,health:2},{happiness:4,looks:1},{happiness:5,smarts:1},{happiness:7},{mental:6,happiness:3},{health:5,happiness:3},{looks:3,happiness:3}];
const CALM = [{mental:5},{happiness:3,mental:2},{smarts:2,happiness:1},{health:3},{happiness:2}];
const SPEND = [{money:-40,happiness:5},{money:-120,happiness:8},{money:-25,happiness:4},{money:-300,happiness:10,looks:2},{money:-60,happiness:6}];
const EARN = [{money:50,happiness:2},{money:120,happiness:3},{money:30},{money:250,happiness:4},{money:80,happiness:2}];
const MIXED = [{happiness:4,health:-2},{happiness:6,smarts:-1},{happiness:5,money:-30},{fitness:3,health:2},{smarts:3,happiness:-1}];
const KIND = [{karma:6,happiness:3},{karma:5,mental:2},{karma:7},{karma:4,happiness:4}];

const e = (effects) => effects;
// normalize any effect value to a plain object (guards against a
// palette array slipping in where a single effect object is expected)
const eff = (v) => Array.isArray(v) ? (v[0] || {}) : (v || {});
let counter = 0;
function ev(prefix, opts) {
  counter++;
  const id = `gen_${prefix}_${String(counter).padStart(5, "0")}`;
  (opts.choices || []).forEach(c => { c.effects = eff(c.effects); (c.outcomes || []).forEach(o => o.effects = eff(o.effects)); });
  return Object.assign({ id, min: 6, max: 90, weight: 0.2, icon: "🎲" }, opts);
}

const events = [];

/* --- Hobbies --- */
const hobbies = ["painting","pottery","rock climbing","baking sourdough","birdwatching","chess","gardening","photography","knitting","skateboarding","calligraphy","astronomy","fishing","surfing","yoga","woodworking","journaling","cycling","origami","stand-up comedy","salsa dancing","brewing coffee","collecting vinyl","urban sketching","kayaking","archery","beekeeping","magic tricks","scuba diving","whittling","home brewing","stargazing","metal detecting","bonsai","parkour","ballet","fencing","pottery throwing","slacklining","geocaching","candle making","leatherwork","glassblowing","drone flying","wine tasting","tarot reading","rollerblading","puzzle solving"];
const hobbyReact = [
  {t:"a calming new hobby",c:["Dive in headfirst", GOOD],c2:["Keep it casual", CALM]},
  {t:"surprisingly good at it",c:["Enter a competition", MIXED],c2:["Just enjoy it", GOOD]},
  {t:"an expensive hobby",c:["Splurge on gear", SPEND],c2:["Borrow what you need", CALM]},
  {t:"a community around it",c:["Make new friends", e({happiness:6,karma:3})],c2:["Stay solo", CALM]},
  {t:"a creative outlet",c:["Share your work online", e({happiness:5,followers:120})],c2:["Keep it private", CALM]},
  {t:"a relaxing escape",c:["Make it a weekly ritual", GOOD],c2:["Move on quickly", e({happiness:2})]},
  {t:"a frustrating challenge",c:["Push through", e({mental:-2,smarts:3,happiness:4})],c2:["Give up", e({happiness:1})]},
  {t:"a money-maker",c:["Sell your creations", EARN],c2:["Give them as gifts", KIND]},
];
hobbies.forEach((h,hi)=> hobbyReact.forEach((r,ri)=>{
  events.push(ev("hobby", {min:8,max:90,icon:"🎨",title:`Took Up ${cap(h)}`,text:`You discovered ${h} and found it ${r.t}.`,
    choices:[{label:r.c[0],effects:pick(r.c[1],hi+ri),log:`You got into ${h}.`,kind:"good"},{label:r.c2[0],effects:pick(r.c2[1],hi+ri),log:`${cap(h)} was a nice change of pace.`,kind:"info"}]}));
}));

/* --- Food & dishes --- */
const dishes = ["ramen","tacos","sushi","biryani","gumbo","pad thai","pierogi","shakshuka","pho","empanadas","dumplings","jollof rice","poutine","falafel","bibimbap","goulash","ceviche","croissants","churros","paella","tagine","laksa","arepas","banh mi","katsu curry","feijoada","moussaka","tamales","okonomiyaki","pavlova","tiramisu","baklava","mochi","gelato","crepes","kimchi stew","dim sum","fish and chips","jerk chicken","borscht"];
const foodReact=[
  {t:"at a new spot in town",a:["Treat yourself",SPEND],b:["Just window-shop",CALM]},
  {t:"and decide to cook it",a:["Nail the recipe",e({happiness:5,smarts:2})],b:["Burn it spectacularly",e({happiness:3,health:-1})]},
  {t:"from a street vendor",a:["Go for it",MIXED],b:["Play it safe",CALM]},
  {t:"with friends",a:["Make a night of it",e({happiness:7,karma:2,money:-50})],b:["Keep it cheap",EARN]},
  {t:"that everyone's raving about",a:["See what the fuss is",GOOD],b:["Ignore the hype",CALM]},
  {t:"for the first time ever",a:["Love it",GOOD],b:["Not for you",e({happiness:1})]},
];
dishes.forEach((d,di)=> foodReact.forEach((r,ri)=>{
  events.push(ev("food",{min:6,max:95,icon:"🍽️",title:`Craving ${cap(d)}`,text:`You came across ${d} ${r.t}.`,
    choices:[{label:r.a[0],effects:pick(r.a[1],di+ri),log:`The ${d} hit the spot.`,kind:"good"},{label:r.b[0],effects:pick(r.b[1],di+ri),log:`Maybe another time.`,kind:"info"}]}));
}));

/* --- Places / travel --- */
const places=["the mountains","a quiet beach","a bustling night market","an old castle","a desert canyon","a rainforest","a tiny island","a famous museum","a hot spring","a vineyard","a coral reef","a glacier","a historic old town","a jazz club","a flower festival","a ski resort","a lavender field","a fishing village","a rooftop garden","a waterfall","a cherry blossom park","a salt flat","a lantern festival","a cliffside trail","a coastal lighthouse","a bamboo forest","a sand dune","a star observatory","a coffee plantation","a mountain monastery","a coral lagoon","a snowy cabin","a riverside town","a tulip garden","an ancient ruin","a busy bazaar","a northern aurora","a tropical waterfall","a quiet vineyard","a seaside boardwalk"];
const placeReact=[
  {t:"for a weekend getaway",a:["Book the trip",e({money:-300,happiness:12,mental:5})],b:["Daydream instead",e({happiness:2})]},
  {t:"on a budget",a:["Backpack it",e({money:-80,happiness:8,health:-1})],b:["Stay home",CALM]},
  {t:"with someone special",a:["Make memories",e({money:-250,happiness:11})],b:["Save the money",EARN]},
  {t:"all by yourself",a:["Embrace the solo trip",e({mental:8,happiness:7,money:-150})],b:["Invite a friend",e({happiness:8,money:-180,karma:2})]},
  {t:"after seeing a photo",a:["Plan to visit",GOOD],b:["Add to the bucket list",CALM]},
];
places.forEach((p,pi)=> placeReact.forEach((r,ri)=>{
  events.push(ev("place",{min:16,max:90,icon:"🗺️",title:"Wanderlust",text:`You keep thinking about ${p} ${r.t}.`,
    choices:[{label:r.a[0],effects:pick(r.a[1],pi+ri),log:`${cap(p)} was unforgettable.`,kind:"good"},{label:r.b[0],effects:pick(r.b[1],pi+ri),log:`The trip can wait.`,kind:"info"}]}));
}));

/* --- People & encounters --- */
const folks=["an old friend","a chatty stranger","a wise elderly neighbor","a former classmate","a street musician","a kind barista","a long-lost relative","a mysterious traveler","a famous local","a retired teacher","a fortune teller","a fellow commuter","a new coworker","a childhood rival","a friendly tourist","a quirky artist","a night-shift cashier","a dog walker","a market vendor","a volunteer","a librarian","a food truck owner","a busker","a park ranger","a tattoo artist","a chess hustler","a flower seller","a taxi driver","a museum guide","a bartender","an old mentor","a pen pal","a neighbor's kid","a wandering poet","a sidewalk painter","a kindly priest"];
const folkSit=[
  {t:"shares a surprising piece of advice",a:["Take it to heart",e({smarts:3,mental:3})],b:["Smile politely",CALM]},
  {t:"asks you for a small favor",a:["Help out",KIND],b:["Politely decline",e({happiness:1})]},
  {t:"tells you a wild story",a:["Listen for hours",e({happiness:5,mental:2})],b:["Cut it short",e({happiness:1})]},
  {t:"offers you a strange gift",a:["Accept it",e({happiness:4})],b:["Turn it down",CALM]},
  {t:"reconnects with you",a:["Rekindle the bond",e({happiness:6,karma:2})],b:["Keep your distance",e({mental:1})]},
  {t:"needs a shoulder to lean on",a:["Be there for them",KIND],b:["You're too busy",e({happiness:-1})]},
  {t:"challenges you to a friendly game",a:["Accept the challenge",MIXED],b:["Maybe next time",CALM]},
  {t:"gives you a compliment",a:["Bask in it",e({happiness:5,looks:1})],b:["Brush it off",e({happiness:2})]},
  {t:"shares their lunch with you",a:["Dig in",e({happiness:4,health:1})],b:["Insist on paying",e({money:-15,karma:3})]},
  {t:"recommends a great book",a:["Read it cover to cover",e({smarts:4,happiness:2})],b:["Add it to the pile",CALM]},
];
folks.forEach((f,fi)=> folkSit.forEach((s,si)=>{
  events.push(ev("people",{min:6,max:95,icon:"🧑",title:"A Chance Meeting",text:`You ran into ${f} who ${s.t}.`,
    choices:[{label:s.a[0],effects:pick(s.a[1],fi+si),log:`Meeting ${f} brightened your day.`,kind:"good"},{label:s.b[0],effects:pick(s.b[1],fi+si),log:`You went on with your day.`,kind:"info"}]}));
}));

/* --- Purchases --- */
const items=["a vintage jacket","a new phone","a comfy armchair","a houseplant","a record player","a fancy watch","a board game","a quality knife set","a pair of headphones","a bicycle","a telescope","a coffee machine","a cozy blanket","a film camera","a smart speaker","a guitar","a standing desk","a fish tank","a hammock","a drone","a pair of boots","a wall of books","a neon sign","a fountain pen","a chess set","a weighted blanket","a espresso grinder","a skateboard","a sewing machine","a polaroid","an air fryer","a mechanical keyboard","a yoga mat","a tent","a hand-painted mug","a leather wallet","a wool scarf","a desk lamp","a succulent","a vinyl box set"];
const buyReact=[
  {t:"on sale",a:["Grab the deal",e({money:-60,happiness:6})],b:["Resist the urge",e({mental:3})]},
  {t:"you've wanted for ages",a:["Finally buy it",e({money:-200,happiness:9})],b:["Keep saving",EARN]},
  {t:"second-hand for cheap",a:["Snap it up",e({money:-30,happiness:5,karma:1})],b:["Walk away",CALM]},
  {t:"as a treat",a:["Treat yourself",pick(SPEND,2)],b:["Be sensible",e({mental:2})]},
  {t:"but it's a bit pricey",a:["Worth it",e({money:-150,happiness:7})],b:["Too much",e({happiness:1})]},
];
items.forEach((it,ii)=> buyReact.forEach((r,ri)=>{
  events.push(ev("buy",{min:12,max:90,icon:"🛍️",title:"Window Shopping",text:`You spotted ${it} ${r.t}.`,
    choices:[{label:r.a[0],effects:pick(r.a[1],ii+ri),log:`You picked up ${it}.`,kind:"money"},{label:r.b[0],effects:pick(r.b[1],ii+ri),log:`You left it on the shelf.`,kind:"info"}]}));
}));

/* --- Weather / seasons --- */
const weather=["the first snow of winter","a perfect spring morning","a sweltering heatwave","an autumn leaf storm","a gentle summer rain","a dramatic thunderstorm","a rare double rainbow","a thick morning fog","a crisp clear night","a blustery windy day","a hailstorm","a quiet snowfall","a golden sunset","a meteor shower","a blooming garden","a frozen lake","a humid monsoon","a cool sea breeze","a frosty dawn","a starry desert night","a misty mountain morning","a warm indian summer","a blinding blizzard","a calm tide"];
const wxReact=[
  {a:["Go outside and enjoy it",GOOD],b:["Stay cozy indoors",CALM]},
  {a:["Take photos",e({happiness:5,looks:1})],b:["Just soak it in",CALM]},
  {a:["Go for a long walk",e({fitness:3,mental:4,happiness:3})],b:["Curl up with a book",e({smarts:2,mental:3})]},
  {a:["Call someone to share it",KIND],b:["Enjoy the quiet alone",e({mental:4})]},
];
weather.forEach((w,wi)=> wxReact.forEach((r,ri)=>{
  events.push(ev("weather",{min:5,max:95,icon:"🌤️",title:"Weather Watch",text:`You woke up to ${w}.`,
    choices:[{label:r.a[0],effects:pick(r.a[1],wi+ri),log:`${cap(w)} made the day special.`,kind:"good"},{label:r.b[0],effects:pick(r.b[1],wi+ri),log:`A pleasant day either way.`,kind:"info"}]}));
}));

/* --- Work (cond hasJob) --- */
const workScn=["a tough deadline looms","a coworker takes credit for your idea","the boss asks for a volunteer","a big presentation is coming up","office gossip is swirling","a new intern needs mentoring","the coffee machine breaks down","a client is being difficult","there's a team-building day","you spot a costly mistake","a rival is gunning for your role","you're offered extra overtime","the team is short-staffed","a process could be improved","morale is low in the office","a project is falling behind"];
const workReact=[
  {a:["Step up and lead",e({gainPerf:8,happiness:3,mental:-2})],b:["Keep your head down",e({mental:2})]},
  {a:["Handle it diplomatically",e({gainPerf:6,smarts:2})],b:["Let it slide",e({happiness:1})]},
  {a:["Put in the extra hours",e({gainPerf:10,money:80,health:-2})],b:["Protect your work-life balance",e({mental:5,happiness:3})]},
  {a:["Speak up in the meeting",e({gainPerf:7,happiness:2})],b:["Stay quiet",e({mental:1})]},
  {a:["Help a colleague out",e({karma:5,gainPerf:3})],b:["Focus on yourself",e({gainPerf:4})]},
];
workScn.forEach((w,wi)=> workReact.forEach((r,ri)=>{
  events.push(ev("work",{min:18,max:68,icon:"💼",cond:{hasJob:true},title:"On the Job",text:`At work, ${w}.`,
    choices:[{label:r.a[0],effects:pick([r.a[1]],0),log:`You dealt with it at work.`,kind:"good"},{label:r.b[0],effects:pick([r.b[1]],0),log:`Another day at the office.`,kind:"info"}]}));
}));

/* --- Internet / tech --- */
const netThings=["a post of yours goes mildly viral","an old account gets hacked","a new app is all the rage","you fall down a research rabbit hole","a comment section turns toxic","a nostalgic meme resurfaces","your phone storage is full","a livestream catches your eye","an online course is on sale","a group chat blows up","a stranger DMs you","your favorite show drops a finale","a glitchy update breaks your phone","a wholesome video makes your day","an online seller scams you","a forum welcomes you warmly","a viral challenge spreads","your screen time report shocks you","a podcast recommends a book","an algorithm reads your mind"];
const netReact=[
  {a:["Lean into it",e({followers:200,happiness:4})],b:["Log off for the day",e({mental:5})]},
  {a:["Engage thoughtfully",e({smarts:2,happiness:2})],b:["Ignore it",CALM]},
  {a:["Spend money on it",pick(SPEND,1)],b:["Free is fine",e({happiness:2})]},
];
netThings.forEach((n,ni)=> netReact.forEach((r,ri)=>{
  events.push(ev("net",{min:12,max:85,icon:"📱",title:"Online Life",text:`Today online, ${n}.`,
    choices:[{label:r.a[0],effects:pick([r.a[1]],0),log:`The internet, as always.`,kind:"info"},{label:r.b[0],effects:pick([r.b[1]],0),log:`You touched grass.`,kind:"good"}]}));
}));

/* --- Health & body --- */
const healthScn=["you sleep ten hours straight","you finally try a standing desk","a friend invites you to a 5k","you cut back on sugar","you start drinking more water","a meditation app pops up","you stretch every morning","you try a cold shower","you book a long-overdue checkup","you swap soda for tea","you take the stairs for a month","you try meal prepping","you do a digital detox","you start a sleep routine","you go for daily walks","you quit late-night snacking"];
const healthReact=[
  {a:["Make it a habit",e({health:6,fitness:3,happiness:3})],b:["One and done",e({happiness:1})]},
  {a:["Commit fully",e({health:5,mental:4})],b:["Ease into it",e({health:2})]},
];
healthScn.forEach((h,hi)=> healthReact.forEach((r,ri)=>{
  events.push(ev("body",{min:14,max:95,icon:"🧘",title:"Healthy Habit",text:`This year, ${h}.`,
    choices:[{label:r.a[0],effects:pick([r.a[1]],0),log:`Your body thanked you.`,kind:"good"},{label:r.b[0],effects:pick([r.b[1]],0),log:`Small steps count.`,kind:"info"}]}));
}));

/* --- Luck / chance --- */
const luckScn=["you find a $20 bill on the ground","a scratch card wins small","you get bumped to first class","a coffee is on the house","you win a raffle","you find a four-leaf clover","a parking spot opens right up","your number gets called first","a refund arrives unexpectedly","you guess the answer correctly","a stranger pays it forward","you catch the last train","a typo works in your favor","you dodge a downpour by seconds","the rain stops just for you","a long line vanishes"];
const luckReact=[
  {a:["Count your blessings",e({happiness:5,karma:1})],b:["Pay it forward",KIND]},
  {a:["Treat yourself with it",pick(SPEND,0)],b:["Save it",pick(EARN,1)]},
];
luckScn.forEach((l,li)=> luckReact.forEach((r,ri)=>{
  events.push(ev("luck",{min:6,max:95,icon:"🍀",title:"Lucky Day",text:`What luck — ${l}!`,
    choices:[{label:r.a[0],effects:pick([r.a[1]],0),log:`Fortune smiled on you.`,kind:"good"},{label:r.b[0],effects:pick([r.b[1]],0),log:`A small stroke of luck.`,kind:"money"}]}));
}));

/* --- Learning / skills --- */
const learnTopics=["a new language","public speaking","coding basics","playing an instrument","cooking fundamentals","personal finance","first aid","photography","negotiation","speed reading","mindfulness","drawing","chess strategy","gardening","car maintenance","sign language","creative writing","data basics","history","astronomy","philosophy","music theory","typing fast","memory techniques","wilderness survival","calligraphy","budgeting","interview skills","time management","critical thinking","basic plumbing","knot tying","star navigation","handwriting","mental math","storytelling"];
const learnReact=[
  {a:["Take a proper course",e({smarts:5,money:-80,happiness:2})],b:["Learn it free online",e({smarts:4})]},
  {a:["Practice daily",e({smarts:6,mental:-1})],b:["Dabble casually",e({smarts:2,happiness:2})]},
];
learnTopics.forEach((t,ti)=> learnReact.forEach((r,ri)=>{
  events.push(ev("learn",{min:8,max:90,icon:"📘",title:"Lifelong Learner",text:`You decide to learn ${t}.`,
    choices:[{label:r.a[0],effects:pick([r.a[1]],0),log:`You picked up ${t}.`,kind:"good"},{label:r.b[0],effects:pick([r.b[1]],0),log:`A little knowledge goes far.`,kind:"info"}]}));
}));

/* --- Relationship (cond hasPartner) --- */
const relScn=["you plan a surprise date","a silly argument brews","you cook dinner together","you reminisce about how you met","you try a new activity as a couple","you give a thoughtful gift","you have a deep heart-to-heart","you plan a future trip","you meet their old friends","you support them through a rough week","you celebrate a small milestone","you write them a letter","you dance in the kitchen","you tackle a chore together","you share a quiet evening in","you laugh until you cry"];
const relReact=[
  {a:["Make it special",e({happiness:8,relPartner:8})],b:["Keep it low-key",e({happiness:4,relPartner:4})]},
  {a:["Open up fully",e({relPartner:7,mental:3})],b:["Hold back a little",e({relPartner:2})]},
];
relScn.forEach((s,si)=> relReact.forEach((r,ri)=>{
  events.push(ev("love",{min:18,max:95,icon:"❤️",cond:{hasPartner:true},title:"Together",text:`With your partner, ${s}.`,
    choices:[{label:r.a[0],effects:pick([r.a[1]],0),log:`A lovely moment together.`,kind:"good"},{label:r.b[0],effects:pick([r.b[1]],0),log:`Time well spent.`,kind:"info"}]}));
}));

/* --- Pets (cond hasPet) --- */
const petScn=["does something hilarious","learns a new trick","makes a mess","cuddles up to you","gets the zoomies","greets you at the door","steals your snack","needs a grooming","wants endless playtime","gives you puppy eyes","befriends a neighbor's pet","naps in a sunbeam","brings you a 'gift'","gets into mischief","follows you everywhere","celebrates its birthday"];
const petReact=[
  {a:["Spoil them rotten",e({happiness:7,money:-25})],b:["Just give them love",e({happiness:5})]},
  {a:["Snap a cute photo",e({happiness:5,followers:80})],b:["Enjoy the moment",e({happiness:4})]},
];
petScn.forEach((s,si)=> petReact.forEach((r,ri)=>{
  events.push(ev("pet",{min:6,max:95,icon:"🐾",cond:{hasPet:true},title:"Pet Antics",text:`Your pet ${s}.`,
    choices:[{label:r.a[0],effects:pick([r.a[1]],0),log:`Your pet melted your heart.`,kind:"good"},{label:r.b[0],effects:pick([r.b[1]],0),log:`Pets make life better.`,kind:"info"}]}));
}));

/* --- Childhood (young ages) --- */
const kidScn=["you build a blanket fort","you lose a tooth","you make a best friend at school","you win a spelling bee","you fall off your bike","you put on a backyard play","you catch fireflies","you get a gold star","you have a sleepover","you draw on the wall","you learn to ride a bike","you start a lemonade stand","you find a cool bug","you get a new toy","you go to the fair","you make a mud pie"];
const kidReact=[
  {a:["Have the time of your life",e({happiness:8})],b:["Get a little shy",e({happiness:3,mental:1})]},
  {a:["Show everyone proudly",e({happiness:6,looks:1})],b:["Keep it to yourself",e({happiness:3})]},
];
kidScn.forEach((s,si)=> kidReact.forEach((r,ri)=>{
  events.push(ev("kid",{min:3,max:12,icon:"🧸",title:"Growing Up",text:`As a kid, ${s}.`,
    choices:[{label:s2(r.a[0]),effects:pick([r.a[1]],0),log:`A core childhood memory.`,kind:"good"},{label:r.b[0],effects:pick([r.b[1]],0),log:`Childhood is fleeting.`,kind:"info"}]}));
}));
function s2(x){return x;}

/* --- Small money moments --- */
const moneyScn=["you find a forgotten gift card","a subscription auto-renews","a friend asks to borrow cash","you spot a budgeting app","an old item could sell online","prices went up at your usual spot","you get a small bonus","a bill is higher than expected","you consider a no-spend month","you find coins in the couch","a coupon saves you a bit","you round up your savings","an impulse buy tempts you","you compare prices online","a cashback offer appears","you start a coin jar"];
const moneyReact=[
  {a:["Be smart about it",pick(EARN,2)],b:["Treat yourself",pick(SPEND,3)]},
  {a:["Save every penny",e({money:60,mental:2})],b:["Live a little",e({money:-40,happiness:5})]},
];
moneyScn.forEach((m,mi)=> moneyReact.forEach((r,ri)=>{
  events.push(ev("cash",{min:14,max:95,icon:"💰",title:"Money Matters",text:`Money-wise, ${m}.`,
    choices:[{label:r.a[0],effects:pick([r.a[1]],0),log:`Every bit counts.`,kind:"money"},{label:r.b[0],effects:pick([r.b[1]],0),log:`You can't take it with you.`,kind:"info"}]}));
}));

/* --- Holidays & celebrations --- */
const holidays=["New Year's Eve","a birthday","a summer festival","a winter holiday","a harvest fair","a national parade","a lantern festival","a costume party","a spring carnival","a family reunion","a fireworks night","a cultural feast day","a midsummer party","a neighborhood block party","a graduation","a wedding you're invited to","a baby shower","a anniversary dinner","a music festival","a food festival","a street fair","a charity gala","a holiday market","a beach bonfire"];
const holReact=[
  {a:["Go all out",e({happiness:9,money:-60})],b:["Keep it simple",e({happiness:5})]},
  {a:["Host it yourself",e({happiness:7,money:-90,karma:3})],b:["Just attend",e({happiness:6})]},
  {a:["Bring everyone together",e({happiness:8,karma:4})],b:["Enjoy quietly",e({mental:4,happiness:3})]},
];
holidays.forEach((h,hi)=> holReact.forEach((r,ri)=>{
  events.push(ev("holiday",{min:5,max:95,icon:"🎉",title:"Celebration",text:`It's time for ${h}.`,
    choices:[{label:r.a[0],effects:r.a[1],log:`${cap(h)} was a blast.`,kind:"good"},{label:r.b[0],effects:r.b[1],log:`A nice celebration.`,kind:"info"}]}));
}));

/* --- Dreams (surreal) --- */
const dreams=["you can fly over your city","you're back in school with no pants","you meet your future self","your teeth fall out","you find a secret room in your house","you're being chased by something kind","you win an award on a giant stage","you can breathe underwater","you talk to an animal","you're falling but never land","everyone speaks a language you invent","you relive your happiest day","you're a hero saving the world","gravity stops working","you find treasure in your backyard","time loops the same morning"];
const dreamReact=[
  {a:["Wake up inspired",e({happiness:5,smarts:2,mental:3})],b:["Shake it off",e({mental:2})]},
  {a:["Write it down",e({smarts:3,happiness:2})],b:["Forget it by noon",e({happiness:1})]},
];
dreams.forEach((d,di)=> dreamReact.forEach((r,ri)=>{
  events.push(ev("dream",{min:5,max:95,icon:"💭",title:"A Vivid Dream",text:`Last night you dreamt ${d}.`,
    choices:[{label:r.a[0],effects:r.a[1],log:`What a dream.`,kind:"good"},{label:r.b[0],effects:r.b[1],log:`Dreams are strange.`,kind:"info"}]}));
}));

/* --- Neighbors --- */
const neigh=["throws loud parties","bakes you cookies","has a gorgeous garden","borrows your tools","plays music at 3am","waves every morning","builds a fence too high","adopts a noisy rooster","starts a community garden","leaves passive-aggressive notes","offers to carpool","hosts a yard sale","feeds the stray cats","shovels your driveway","complains about everything","organizes a street cleanup"];
const neighReact=[
  {a:["Be a good neighbor",KIND[0]],b:["Keep to yourself",CALM[0]]},
  {a:["Address it kindly",e({karma:4,mental:2})],b:["Let it go",e({happiness:1})]},
];
neigh.forEach((n,ni)=> neighReact.forEach((r,ri)=>{
  events.push(ev("neighbor",{min:14,max:95,icon:"🏘️",title:"The Neighbors",text:`Your neighbor ${n}.`,
    choices:[{label:r.a[0],effects:r.a[1],log:`Neighborly relations, managed.`,kind:"info"},{label:r.b[0],effects:r.b[1],log:`To each their own.`,kind:"info"}]}));
}));

/* --- Fashion & style --- */
const styles=["a bold new haircut","a thrift-store treasure","a daring outfit","a signature scent","a classic capsule wardrobe","statement glasses","a vintage look","a minimalist style","bright colors","an all-black ensemble","a handmade accessory","designer shoes on sale","a tailored fit","a cozy oversized look","a retro throwback","a fresh seasonal refresh"];
const styleReact=[
  {a:["Rock it confidently",e({looks:4,happiness:5})],b:["Play it safe",e({looks:1,happiness:2})]},
  {a:["Treat yourself to it",e({money:-70,looks:3,happiness:4})],b:["Recreate it cheaply",e({looks:2,happiness:3})]},
];
styles.forEach((s,si)=> styleReact.forEach((r,ri)=>{
  events.push(ev("style",{min:12,max:90,icon:"👗",title:"Style Switch-Up",text:`You're tempted by ${s}.`,
    choices:[{label:r.a[0],effects:r.a[1],log:`You looked great.`,kind:"good"},{label:r.b[0],effects:r.b[1],log:`A subtle refresh.`,kind:"info"}]}));
}));

/* --- Music & shows --- */
const media=["a band you'd forgotten about","a gripping new series","an indie film","a nostalgic soundtrack","a live gig downtown","a podcast that hooks you","a classic album on vinyl","a foreign-language drama","a comedy special","an orchestra in the park","a street performer","a documentary that moves you","an open-mic night","a musical","a film festival","a karaoke bar"];
const mediaReact=[
  {a:["Lose yourself in it",e({happiness:6,mental:3})],b:["Half-watch it",e({happiness:2})]},
  {a:["Share it with friends",e({happiness:5,karma:2})],b:["Keep it your secret",e({mental:2,happiness:2})]},
];
media.forEach((m,mi)=> mediaReact.forEach((r,ri)=>{
  events.push(ev("media",{min:8,max:95,icon:"🎬",title:"Entertainment",text:`You discovered ${m}.`,
    choices:[{label:r.a[0],effects:r.a[1],log:`Great entertainment.`,kind:"good"},{label:r.b[0],effects:r.b[1],log:`A pleasant distraction.`,kind:"info"}]}));
}));

/* --- Volunteering & good deeds --- */
const deeds=["a beach cleanup","a soup kitchen","a charity run","tutoring kids","a blood drive","an animal shelter","a tree-planting day","a food bank","a fundraiser","helping at a care home","a community repair café","mentoring a teen","a disaster relief drive","a park restoration","a clothing donation drive","reading to the elderly"];
const deedReact=[
  {a:["Give your time",e({karma:8,happiness:5,mental:3})],b:["Donate instead",e({money:-40,karma:5})]},
  {a:["Recruit friends too",e({karma:7,happiness:5})],b:["Quietly help",e({karma:6})]},
];
deeds.forEach((d,di)=> deedReact.forEach((r,ri)=>{
  events.push(ev("deed",{min:12,max:95,icon:"🤝",title:"Lend a Hand",text:`There's ${d} happening nearby.`,
    choices:[{label:r.a[0],effects:r.a[1],log:`You made a difference.`,kind:"good"},{label:r.b[0],effects:r.b[1],log:`Every bit helps.`,kind:"good"}]}));
}));

/* --- Sports & games (casual) --- */
const games=["a pickup basketball game","a chess match in the park","a video game tournament","a friendly tennis match","a bowling night","a trivia quiz","a poker night","a soccer kickabout","a marathon","a rock-climbing session","a ping-pong showdown","a dodgeball league","a fantasy sports draft","a darts match","a mini-golf round","a swim meet"];
const gameReact=[
  {a:["Play to win",e({fitness:3,happiness:5,mental:-1})],b:["Just have fun",e({happiness:6})]},
  {a:["Join a league",e({fitness:4,happiness:4,karma:2})],b:["One-off only",e({happiness:3})]},
];
games.forEach((g,gi)=> gameReact.forEach((r,ri)=>{
  events.push(ev("game",{min:8,max:80,icon:"🎮",title:"Game On",text:`Someone invites you to ${g}.`,
    choices:[{label:r.a[0],effects:r.a[1],log:`Good game!`,kind:"good"},{label:r.b[0],effects:r.b[1],log:`Fun times.`,kind:"info"}]}));
}));

/* --- Nature & animals --- */
const nature=["a deer in the backyard","a spectacular sunrise","a field of wildflowers","a curious fox","a flock of migrating birds","a tide pool full of life","a giant old oak tree","a family of ducks","a butterfly garden","a clear night full of stars","a babbling creek","a snail crossing the path","a hawk circling above","a meadow at golden hour","fresh snow on pines","a rainbow after rain"];
const natReact=[
  {a:["Pause and appreciate it",e({mental:5,happiness:4})],b:["Snap a quick pic",e({happiness:3,followers:50})]},
  {a:["Sit with it a while",e({mental:6})],b:["Carry on",e({happiness:2})]},
];
nature.forEach((n,ni)=> natReact.forEach((r,ri)=>{
  events.push(ev("nature",{min:5,max:95,icon:"🌿",title:"A Moment in Nature",text:`You came across ${n}.`,
    choices:[{label:r.a[0],effects:r.a[1],log:`Nature is healing.`,kind:"good"},{label:r.b[0],effects:r.b[1],log:`A nice glimpse of nature.`,kind:"info"}]}));
}));

/* --- Home & living --- */
const homeScn=["a leaky faucet","a deep-clean urge","a rearrange-the-furniture mood","a DIY project","a clutter-clearing weekend","a new houseplant collection","a cozy reading nook idea","a paint-the-walls plan","a smart-home gadget","a garden makeover","a kitchen upgrade","a closet overhaul","a gallery wall","a balcony garden","a pantry reorganization","a fresh set of linens"];
const homeReact=[
  {a:["Tackle it this weekend",e({happiness:5,money:-50,mental:3})],b:["Add it to the list",e({happiness:1})]},
  {a:["Do it properly",e({happiness:6,money:-120})],b:["Quick fix for now",e({happiness:2,money:-15})]},
];
homeScn.forEach((h,hi)=> homeReact.forEach((r,ri)=>{
  events.push(ev("home",{min:18,max:95,icon:"🏠",title:"Home Life",text:`You've got ${h} on your mind.`,
    choices:[{label:r.a[0],effects:r.a[1],log:`Home sweet home.`,kind:"info"},{label:r.b[0],effects:r.b[1],log:`It'll keep.`,kind:"info"}]}));
}));

/* --- Personal growth --- */
const growthScn=["you set a bold new goal","you face an old fear","you forgive someone","you say no for once","you ask for help","you start journaling","you let go of a grudge","you try something scary","you set a boundary","you celebrate a small win","you reflect on the year","you make a five-year plan","you break a bad habit","you apologize sincerely","you take a leap of faith","you practice gratitude"];
const growthReact=[
  {a:["Lean into the growth",e({mental:6,happiness:4,smarts:1})],b:["Take baby steps",e({mental:3,happiness:2})]},
];
growthScn.forEach((g,gi)=> growthReact.forEach((r,ri)=>{
  // add two variants to widen the set
  [0,1].forEach(v=> events.push(ev("growth",{min:14,max:95,icon:"🌱",title:"Personal Growth",text:`${cap(g)}.`,
    choices:[{label:v?"Embrace it":"Go for it",effects:g_eff(gi+v),log:`You grew a little.`,kind:"good"},{label:"Reflect on it",effects:e({mental:3}),log:`Growth takes time.`,kind:"info"}]})));
}));
function g_eff(n){ return [{mental:6,happiness:4},{mental:5,smarts:2,happiness:3},{mental:7,happiness:3},{happiness:5,mental:4}][n%4]; }

/* --- Work-from-anywhere / commute --- */
const commuteScn=["the bus is running late again","you snag the best seat on the train","traffic is at a standstill","you discover a scenic shortcut","a stranger strikes up a chat","you miss your stop daydreaming","your favorite podcast drops a new episode","it starts pouring as you leave","you help a lost tourist","the carpool falls through","you bike to work for the first time","a delay gives you reading time","you find money in your coat","the elevator is out again","you beat your personal best time","you forget something at home"];
const commuteReact=[
  {a:["Make the best of it",e({mental:3,happiness:3})],b:["Grumble through it",e({happiness:1})]},
  {a:["Use the time well",e({smarts:2,happiness:2})],b:["Zone out",e({mental:2})]},
];
commuteScn.forEach((c,ci)=> commuteReact.forEach((r,ri)=>{
  events.push(ev("commute",{min:16,max:75,icon:"🚌",title:"On the Move",text:`On your way today, ${c}.`,
    choices:[{label:r.a[0],effects:r.a[1],log:`Another journey done.`,kind:"info"},{label:r.b[0],effects:r.b[1],log:`You got there eventually.`,kind:"info"}]}));
}));

/* --- Seasons of life / reflection --- */
const reflectScn=["you flip through old photos","you bump into a place from your past","an old song takes you back","you find a childhood keepsake","you think about who you've become","you write a letter to your younger self","you notice how much has changed","you make peace with a regret","you appreciate how far you've come","you wonder about the road not taken","you feel grateful for the small things","you realize a dream quietly came true","you forgive your past self","you set an intention for the future","you savor an ordinary perfect day","you count the people you love"];
const reflectReact=[
  {a:["Sit with the feeling",e({mental:6,happiness:3})],b:["Smile and move on",e({happiness:4})]},
];
reflectScn.forEach((s,si)=> reflectReact.forEach((r,ri)=>{
  [0,1].forEach(v=> events.push(ev("reflect",{min:20,max:110,icon:"🍂",title:"Reflection",text:`${cap(s)}.`,
    choices:[{label:v?"Cherish it":"Take it in",effects:e({mental:5,happiness:v?4:3}),log:`A thoughtful moment.`,kind:"good"},{label:"Let it pass",effects:e({happiness:2}),log:`Life goes on.`,kind:"info"}]})));
}));

/* --- Quirky micro-moments (large filler set, still varied) --- */
const quirks=["you find a perfect parking spot","your coffee order is exactly right","a song you love comes on the radio","you finish a great book","you nail a recipe on the first try","you get a genuine belly laugh","you have the house to yourself","you catch a beautiful sunset","you finally beat a tough level","you get a heartfelt thank-you text","you wake up before your alarm feeling rested","you find cash in old jeans","your team wins a close one","you fix something that's bugged you for ages","you reconnect with an old hobby","you have a great hair day","you cook for friends and they love it","you get lost in a good conversation","you find the perfect gift for someone","you have a productive morning","you take a nap that hits just right","you stumble on a hidden gem of a café","you finish your to-do list","you get a compliment from a stranger","you watch a storm from your window","you bake something that smells amazing","you organize a messy drawer","you learn a fun fact","you make someone's day","you find a new favorite spot","you get a surprise day off","you finally relax after a long week","you hear from an old friend","you discover a great playlist","you have a moment of pure calm","you laugh at an old memory","you try a new route and love it","you get a small win at work","you watch the rain with tea","you feel proud of yourself"];
const quirkReact=[
  {a:["Soak it in",e({happiness:4,mental:2})],b:["Share the moment",e({happiness:3,karma:2})]},
  {a:["Let it lift your day",e({happiness:5})],b:["Pay it forward",e({karma:4,happiness:2})]},
  {a:["Savor it fully",e({happiness:4,mental:3})],b:["Note it in your journal",e({smarts:1,happiness:3})]},
];
quirks.forEach((q,qi)=> quirkReact.forEach((r,ri)=>{
  events.push(ev("moment",{min:5,max:110,icon:"✨",title:"A Good Moment",text:`Today, ${q}.`,
    choices:[{label:r.a[0],effects:r.a[1],log:`A little joy in the everyday.`,kind:"good"},{label:r.b[0],effects:r.b[1],log:`The small things matter.`,kind:"info"}]}));
}));

/* --- Minor annoyances (balance the good) --- */
const annoy=["your shoelace snaps","you stub your toe","the wifi drops mid-show","you spill your drink","a button falls off","you get a paper cut","traffic makes you late","your phone dies at the worst time","it rains the day you wash the car","you forget why you walked into a room","a fly won't leave you alone","you bite your tongue","the milk's gone off","you misplace your keys","an app update ruins your routine","you get a splinter","the printer jams","you sneeze seven times in a row","you hit every red light","your favorite mug chips","a song gets stuck in your head","you tear a grocery bag","the elevator stops on every floor","you mistype a password five times","a hangnail catches everything","your earbuds tangle impossibly","you drop toast butter-side down","the queue you pick is slowest","you forget an umbrella","your pen runs out mid-sentence"];
const annoyReact=[
  {a:["Laugh it off",e({mental:3,happiness:2})],b:["Let it bug you",e({happiness:-1})]},
  {a:["Shrug and move on",e({mental:2})],b:["Fix it properly",e({happiness:1,smarts:1})]},
];
annoy.forEach((a,ai)=> annoyReact.forEach((r,ri)=>{
  events.push(ev("annoy",{min:6,max:110,icon:"😅",title:"Minor Inconvenience",text:`Ugh — ${a}.`,
    choices:[{label:r.a[0],effects:r.a[1],log:`These things happen.`,kind:"info"},{label:r.b[0],effects:r.b[1],log:`Crisis averted.`,kind:"info"}]}));
}));

/* --- Skills practice flavor --- */
const practice=["you finally get the hang of it","you hit a frustrating plateau","a breakthrough clicks into place","you teach someone else and learn more","you record yourself to improve","you join a class to level up","you practice until late","you compare yourself to others","you find a great tutorial","you set a daily streak","you enter a small contest","you get honest feedback","you mix two skills together","you rediscover the joy of it","you take a break and come back fresh","you master a tricky technique"];
const skills2=["drawing","guitar","cooking","coding","writing","singing","dancing","photography","public speaking","chess","running","painting","languages","editing","woodwork","gardening"];
skills2.forEach((s,si)=> practice.forEach((p,pi)=>{
  events.push(ev("skill",{min:8,max:95,icon:"📈",title:"Skill Up",text:`With your ${s}, ${p}.`,
    choices:[{label:"Keep grinding",effects:e({smarts:3,happiness:2}),log:`Your ${s} improved.`,kind:"good"},{label:"Enjoy the process",effects:e({happiness:4,mental:2}),log:`Progress, not perfection.`,kind:"info"}]}));
}));

/* --- Friendship moments (cond hasFriend) --- */
const friendScn=["plans a surprise for you","needs advice","invites you on a trip","starts a new chapter in life","goes through a tough time","celebrates a big win","asks for a favor","wants to start a project with you","drifts a little distant","surprises you with a visit","shares exciting news","needs cheering up","throws a get-together","remembers something you forgot","stands up for you","picks you first"];
friendScn.forEach((f,fi)=> [0,1].forEach(v=>{
  events.push(ev("friend",{min:8,max:95,icon:"🧑‍🤝‍🧑",cond:{hasFriend:true},title:"Friendship",text:`Your friend ${f}.`,
    choices:[{label:v?"Show up for them":"Be there",effects:e({karma:4,happiness:5,relRandom:5}),log:`Friendship strengthened.`,kind:"good"},{label:"Keep it light",effects:e({happiness:3,relRandom:2}),log:`Good to have friends.`,kind:"info"}]}));
}));

/* --- Seasonal activities (4 seasons x many activities) --- */
const seasons=["spring","summer","autumn","winter"];
const seasonAct={
  spring:["plant a garden","go on a picnic","watch the blossoms","do spring cleaning","fly a kite","visit a farmers market","take a nature hike","start a new project","watch baby birds","jump in puddles"],
  summer:["go to the beach","have a barbecue","watch fireworks","go camping","eat ice cream","take a road trip","swim in a lake","watch a sunset","catch fireflies","go to a festival"],
  autumn:["jump in leaf piles","carve pumpkins","go apple picking","drink warm cider","take cozy walks","watch the leaves turn","bake pies","visit a corn maze","knit a scarf","stargaze on cool nights"],
  winter:["build a snowman","go sledding","sip hot cocoa","decorate for the holidays","ice skate","read by the fire","have a snowball fight","watch the snow fall","make soup","cozy up under blankets"],
};
seasons.forEach((sea,sx)=> seasonAct[sea].forEach((act,ax)=>{
  events.push(ev("season",{min:4,max:110,icon:"📅",title:`${cap(sea)} Days`,text:`This ${sea}, you decide to ${act}.`,
    choices:[
      {label:"Make the most of it",effects:e({happiness:6,mental:3}),log:`A perfect ${sea} day.`,kind:"good"},
      {label:"Invite others along",effects:e({happiness:5,karma:3}),log:`Shared ${sea} joy.`,kind:"good"},
      {label:"Keep it low-key",effects:e({mental:4,happiness:2}),log:`A quiet ${sea} moment.`,kind:"info"},
    ]}));
}));

/* --- Decisions & dilemmas (light, universal) --- */
const dilemmas=["take a risk or play it safe","speak your mind or keep the peace","save money or seize an experience","help a stranger or mind your business","follow the crowd or go your own way","rest or push a little harder","try the new thing or stick with what works","be honest or be kind","plan ahead or be spontaneous","lead or support","forgive or stand firm","spend on others or treat yourself","stay in or go out","start now or wait for the right moment","keep a secret or share the truth","chase the dream or build the safety net"];
dilemmas.forEach((d,di)=> [0,1].forEach(v=>{
  events.push(ev("choice",{min:14,max:100,icon:"⚖️",title:"A Small Crossroads",text:`You face a familiar choice: ${d}.`,
    choices:[
      {label:"Be bold",effects:e({happiness:5,mental:v?2:3}),log:`You chose courage.`,kind:"good"},
      {label:"Be measured",effects:e({mental:4,smarts:2}),log:`You chose wisdom.`,kind:"info"},
      {label:"Be kind",effects:e({karma:5,happiness:2}),log:`You chose kindness.`,kind:"good"},
    ]}));
}));

/* --- Local life / errands --- */
const errands=["the post office has a huge line","you discover a new bakery","the bank teller is extra friendly","you finally return that overdue item","the corner store restocked your favorite","a busker plays beautifully outside","you find the shop's last one in your size","a sample tray tempts you","the cashier remembers your name","you help someone reach a top shelf","you find a great deal in the clearance bin","the bus driver waits for you","a kid offers you a sticker","you get the last fresh loaf","a shopkeeper throws in a freebie","the parking meter has free time left"];
errands.forEach((er,ei)=> [0,1].forEach(v=>{
  events.push(ev("errand",{min:10,max:100,icon:"🛒",title:"Running Errands",text:`Out and about, ${er}.`,
    choices:[
      {label:"Enjoy the little moment",effects:e({happiness:4}),log:`Errands done, mood up.`,kind:"good"},
      {label:"Spread some kindness",effects:e({karma:4,happiness:2}),log:`A small good deed.`,kind:"good"},
    ]}));
}));

/* --- Conversations & small talk (large set to round out library) --- */
const convTopics=["the weather","a shared favorite show","childhood memories","future dreams","a funny mishap","weekend plans","a great meal you had","a book recommendation","local news","an old inside joke","travel stories","a new gadget","music tastes","a wild coincidence","pet stories","a embarrassing moment","life advice","a hot take on coffee","conspiracy theories for fun","what you'd do with a lottery win","favorite seasons","dream jobs as a kid","the best meal ever","a skill you wish you had","your hometown","a movie that changed you","the perfect day off","weird food combos","a goal for the year","what makes you laugh"];
const convPeople=["a chatty neighbor","a coworker on break","a friendly barista","an old acquaintance","a fellow passenger","a new acquaintance","a relative at dinner","someone at the gym","a person in the queue","a friend of a friend","a taxi driver","a hairdresser","a dog owner at the park","a market vendor","a fellow hobbyist"];
convPeople.forEach((p,pi)=> convTopics.forEach((t,ti)=>{
  events.push(ev("chat",{min:8,max:105,icon:"💬",title:"Small Talk",text:`You end up chatting with ${p} about ${t}.`,
    choices:[
      {label:"Really connect",effects:e({happiness:4,karma:2}),log:`A nice little chat.`,kind:"good"},
      {label:"Keep it brief",effects:e({happiness:2}),log:`Pleasant enough.`,kind:"info"},
    ]}));
}));

/* ---------- write generated in chunks ---------- */
const CHUNK = 500;
const genFiles = [];
for (let i = 0; i < events.length; i += CHUNK) {
  const part = events.slice(i, i + CHUNK);
  const name = `part_${String(i / CHUNK + 1).padStart(3, "0")}.json`;
  fs.writeFileSync(path.join(GEN_DIR, name), JSON.stringify(part, null, 2));
  genFiles.push("generated/" + name);
}

const curated = exportCurated();
const manifest = {
  description: "LifeForge event library. 'generated' files are loaded into the game at runtime; 'curated' are JSON copies of the hand-written events in data/events_*.js.",
  generatedCount: events.length,
  curatedCount: curated.count,
  totalEvents: events.length + curated.count,
  generated: genFiles,
  curated: curated.files,
};
fs.writeFileSync(path.join(JSON_DIR, "index.json"), JSON.stringify(manifest, null, 2));

console.log(`generated ${events.length} events across ${genFiles.length} files`);
console.log(`exported ${curated.count} curated events across ${curated.files.length} files`);
console.log(`total events in library: ${manifest.totalEvents}`);
