/* ============================================================
   achievements.js — life goals, auto-checked each year.
   test(s) receives the current character state and returns
   true once earned. Earned ones are remembered for the life.
   ============================================================ */
window.GAME = window.GAME || {};
window.GAME.achievements = [
  {id:"adult",      name:"All Grown Up",     icon:"smile",   desc:"Reach age 18",            test:s=>s.age>=18},
  {id:"centenarian",name:"Centenarian",      icon:"trophy",  desc:"Live to 100",             test:s=>s.age>=100},
  {id:"grad",       name:"Scholar",          icon:"cap",     desc:"Earn a university degree", test:s=>s.edu>=3},
  {id:"phd",        name:"Doctor of...",     icon:"cap",     desc:"Earn a graduate degree",  test:s=>s.edu>=4},
  {id:"rich",       name:"Millionaire",      icon:"coin",    desc:"Hold $1,000,000",         test:s=>s.money>=1e6},
  {id:"tycoon",     name:"Tycoon",           icon:"office",  desc:"Hold $10,000,000",        test:s=>s.money>=1e7},
  {id:"married",    name:"Tied the Knot",    icon:"ring",    desc:"Get married",             test:s=>s.people.some(p=>p.alive&&p.relation==="spouse")},
  {id:"bigfamily",  name:"Big Family",       icon:"people",  desc:"Have 3+ children",        test:s=>s.people.filter(p=>p.relation==="child").length>=3},
  {id:"famous",     name:"Famous",           icon:"star",    desc:"Reach 60 fame",           test:s=>s.fame>=60},
  {id:"superstar",  name:"Superstar",        icon:"star",    desc:"Reach 1M followers",      test:s=>(s.followers||0)>=1e6},
  {id:"crook",      name:"Rap Sheet",        icon:"crime",   desc:"Commit a crime",          test:s=>(s.criminalRecord||[]).length>=1},
  {id:"jailbird",   name:"Jailbird",         icon:"lock",    desc:"Go to prison",            test:s=>s.inPrison||(s.criminalRecord||[]).some(c=>true)&&s._wentToPrison},
  {id:"office",     name:"Public Servant",   icon:"ballot",  desc:"Win any election",        test:s=>!!s.politics},
  {id:"president",  name:"Commander-in-Chief",icon:"ballot", desc:"Become President",        test:s=>s.politics&&GAME.offices[s.politics.officeIndex]&&GAME.offices[s.politics.officeIndex].id==="president"},
  {id:"boss",       name:"Entrepreneur",     icon:"office",  desc:"Found a business",        test:s=>(s.businesses||[]).length>=1},
  {id:"investor",   name:"Investor",         icon:"chart",   desc:"Own stocks or crypto",    test:s=>{let n=0;for(const k in (s.investments&&s.investments.stocks||{}))n+=s.investments.stocks[k];for(const k in (s.investments&&s.investments.crypto||{}))n+=s.investments.crypto[k];return n>0;}},
  {id:"emigrant",   name:"Citizen of the World",icon:"passport",desc:"Become a citizen abroad",test:s=>(s.citizenships||[]).length>=2},
  {id:"jacked",     name:"Peak Condition",   icon:"dumbbell",desc:"Reach 90 fitness",        test:s=>s.fitness>=90},
  {id:"genius",     name:"Big Brain",        icon:"brain",   desc:"Reach 95 smarts",         test:s=>s.smarts>=95},
  {id:"dynasty",    name:"Dynasty",          icon:"crest",   desc:"Reach generation 3",      test:s=>(s.generation||1)>=3},
  {id:"veteran",    name:"Veteran",          icon:"medal",   desc:"Serve in the military",   test:s=>!!s.military||s._wasMilitary},
  {id:"mademan",    name:"Made Man",         icon:"fedora",  desc:"Join the mafia",          test:s=>!!s.mafia||s._wasMafia},
  {id:"skilled",   name:"Master of Craft",   icon:"scroll",  desc:"Max out any skill",       test:s=>{for(const k in (s.skills||{})) if(s.skills[k]>=100) return true; return false;}},
  // ---- new systems ----
  {id:"champion",   name:"Champion",          icon:"trophy",  desc:"Win a sports championship",   test:s=>!!(s.sports&&s.sports.championships>=1)},
  {id:"sportlegend",name:"Sporting Legend",   icon:"trophy",  desc:"Win 5 championships",          test:s=>!!(s.sports&&s.sports.championships>=5)},
  {id:"mvp",        name:"League MVP",        icon:"medal",   desc:"Be named league MVP",          test:s=>!!(s.sports&&s.sports.mvps>=1)},
  {id:"responder",  name:"First Responder",   icon:"medal",   desc:"Work as a first responder",    test:s=>!!(s.job&&["firefighter","paramedic","police"].includes(s.job.careerId))},
  {id:"homeowner",  name:"Homeowner",         icon:"office",  desc:"Own your own home",            test:s=>(s.assets||[]).some(a=>a.type==="homes")},
  {id:"landlord",   name:"Landlord",          icon:"office",  desc:"Own an investment property",   test:s=>(s.properties||[]).length>=1},
  {id:"mogul",      name:"Property Mogul",    icon:"office",  desc:"Own 3+ properties",            test:s=>(s.properties||[]).length>=3},
  {id:"empire",     name:"Business Empire",   icon:"office",  desc:"Own 3+ businesses",            test:s=>(s.businesses||[]).length>=3},
  {id:"petlover",   name:"Animal Lover",      icon:"people",  desc:"Care for 2+ pets",             test:s=>(s.pets||[]).length>=2},
  {id:"bestinshow", name:"Best in Show",      icon:"trophy",  desc:"Win a pet show",               test:s=>(s.pets||[]).some(p=>p.trophies>=1)},
];
