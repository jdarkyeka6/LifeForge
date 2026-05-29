/* ============================================================
   LifeForge — engine (v2)
   Reads all content from window.GAME (see data/*.js).
   Declarative event system: events are pure data, interpreted here.
   A popup fires every single age-up.
   ============================================================ */

/* ---------- shortcuts to data ---------- */
const C = () => window.GAME.core;
const CAREERS = () => window.GAME.careers;
const SHOP = () => window.GAME.shop;
const EVENTS = () => window.GAME.events;

/* ============================================================
   UTILITIES
   ============================================================ */
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const rand   = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const pick    = arr => arr[Math.floor(Math.random()*arr.length)];
const chance  = p => Math.random() < p;
const clamp   = (v,a=0,b=100) => Math.max(a, Math.min(b, v));
const cap = s => s? s.charAt(0).toUpperCase()+s.slice(1) : s;
function fmtMoney(n){
  const neg = n < 0; n = Math.abs(n); let str;
  if (n >= 1e9) str = (n/1e9).toFixed(2)+"B";
  else if (n >= 1e6) str = (n/1e6).toFixed(2)+"M";
  else if (n >= 1e3) str = (n/1e3).toFixed(1)+"k";
  else str = n.toFixed(0);
  return (neg?"-$":"$")+str;
}

/* ============================================================
   STATE + SAVE/LOAD
   ============================================================ */
const SAVE_KEY = "lifeforge_save_v2";
let G = { s: null };
function saveGame(){ if(G.s){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(G.s)); }catch(e){} } }
function loadGame(){ try{ const raw=localStorage.getItem(SAVE_KEY); if(!raw) return false; G.s=JSON.parse(raw); migrate(); return true; }catch(e){ return false; } }
function hasSave(){ return !!localStorage.getItem(SAVE_KEY); }
function migrate(){ // backfill fields for older saves
  G.s.firedOnce = G.s.firedOnce||[]; G.s.recentEvents=G.s.recentEvents||[];
  G.s.conditions=G.s.conditions||[]; G.s.addictions=G.s.addictions||[];
  G.s.assets=G.s.assets||[]; G.s.pets=G.s.pets||[]; G.s.people=G.s.people||[];
  G.s.stats_lifetime=G.s.stats_lifetime||{};
  if(G.s.politics===undefined) G.s.politics=null;
  if(G.s.lawRetainer===undefined) G.s.lawRetainer=false;
  G.s.bornCountry=G.s.bornCountry||G.s.country;
  G.s.citizenships=G.s.citizenships||[G.s.country];
  if(G.s.yearsInCountry==null) G.s.yearsInCountry=0;
  if(G.s.followers==null) G.s.followers=0;
  G.s.investments=G.s.investments||{stocks:{},crypto:{}};
  G.s.businesses=G.s.businesses||[];
  if(G.s.generation==null) G.s.generation=1;
  if(!G.s.traits) G.s.traits=pickTraits(3);
  if(!G.s.skills) G.s.skills=initSkills();
  G.s.achievements=G.s.achievements||[];
  if(G.s.military===undefined) G.s.military=null;
  if(G.s.mafia===undefined) G.s.mafia=null;
  G.s.properties=G.s.properties||[];
  if(G.s.supernatural===undefined) G.s.supernatural=null;
  G.s.travels=G.s.travels||[];
  G.s.songs=G.s.songs||[];
  if(G.s.faith===undefined) G.s.faith=null;
  if(!G.s.zodiac) G.s.zodiac=pickZodiac();
  if(!G.s.appearance) G.s.appearance={hair:"brown",build:"average"};
  initMarket();
}

/* ============================================================
   CHARACTER CREATION
   ============================================================ */
function newCharacter(opts={}){
  const core = C();
  const gender = opts.gender || pick(["male","female","male","female","nonbinary"]);
  const firstPool = gender==="male"?core.maleNames : gender==="female"?core.femaleNames : core.neutralNames;
  const first = opts.first || pick(firstPool);
  const last  = opts.last  || pick(core.surnames);
  const country = opts.country || pick(core.countries);
  const parentWealth = Math.random();

  const s = {
    first, last, gender,
    country: country.name, flag: country.flag, wealthFactor: country.wealth,
    age:0, alive:true, causeOfDeath:null,
    money: Math.round(parentWealth*parentWealth*4000),
    happiness:rand(55,85), health:rand(70,95), smarts:rand(20,80),
    looks:rand(20,85), mental:rand(55,85), karma:50, fame:0, fitness:rand(20,50),
    edu:0, inSchool:true, gpa:rand(50,90),
    job:null,
    addictions:[], conditions:[], criminalRecord:[],
    inPrison:false, prisonYears:0, notoriety:0,
    politics:null, lawRetainer:false,
    bornCountry:country.name, citizenships:[country.name], yearsInCountry:0,
    followers:0, market:null, investments:{stocks:{},crypto:{}}, businesses:[], generation:1,
    traits:pickTraits(3), skills:initSkills(), achievements:[], military:null, mafia:null,
    properties:[], supernatural:null, travels:[], songs:[],
    faith:null, zodiac:pickZodiac(),
    appearance:{ hair:pick(["black","brown","blonde","red","auburn","gray"]), build:pick(["slim","average","athletic","heavy"]) },
    people:[], pets:[], assets:[],
    log:[], firedOnce:[], recentEvents:[],
    stats_lifetime:{ jobsHeld:0, crimes:0, partners:0, kids:0 },
  };

  const dad = makeNPC("father", last); dad.relationship=rand(60,90);
  const mom = makeNPC("mother", pick(core.surnames)); mom.relationship=rand(60,90);
  s.people.push(mom, dad);
  if (chance(0.5)){ const sib=makeNPC("sibling", last); sib.relationship=rand(40,80); s.people.push(sib); }
  // extended family
  ["grandmother","grandfather"].forEach(rel=>{ if(chance(0.8)){ const gp=makeNPC(rel, rel==="grandfather"?last:pick(core.surnames)); gp.relationship=rand(50,80); s.people.push(gp); } });
  if (chance(0.55)){ const au=makeNPC(chance(0.5)?"aunt":"uncle", pick(core.surnames)); au.relationship=rand(45,70); s.people.push(au); }
  if (chance(0.45)){ const cz=makeNPC("cousin", pick(core.surnames)); cz.relationship=rand(40,70); s.people.push(cz); }

  G.s = s;
  initMarket();
  log(`You were born ${genderWord(gender,"a boy","a girl","a child")} in ${country.name}.`, "good", "Birth");
  log(`Your parents named you ${first} ${last}.`, "info");
  return s;
}
function makeNPC(relation, surname){
  const core=C();
  let g = pick(["male","female"]);
  if (relation==="father"||relation==="grandfather"||relation==="uncle") g="male";
  if (relation==="mother"||relation==="grandmother"||relation==="aunt") g="female";
  const pool = g==="male"?core.maleNames:core.femaleNames;
  return {
    id:"npc_"+Math.random().toString(36).slice(2,9),
    name:pick(pool), last:surname||pick(core.surnames), gender:g,
    relation, relationship:50, alive:true, age:relationAge(relation),
    traits:[pick(core.traits)],
  };
}
function relationAge(rel){
  if(rel==="father"||rel==="mother") return rand(24,40);
  if(rel==="grandfather"||rel==="grandmother") return rand(58,78);
  if(rel==="aunt"||rel==="uncle") return rand(28,55);
  if(rel==="cousin") return rand(0,25);
  if(rel==="sibling") return rand(0,6);
  if(rel==="child") return 0;
  return rand(18,40);
}
function pickTraits(n){ const pool=(GAME.traits||[]).slice(); const out=[]; for(let i=0;i<n&&pool.length;i++){ out.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0].id); } return out; }
function initSkills(){ const o={}; (GAME.skills||[]).forEach(s=>o[s.id]=rand(0,10)); return o; }
function pickZodiac(){ const z=(GAME.zodiac||[]); return z.length? z[rand(0,z.length-1)].id : null; }
function zodiacDef(id){ return (GAME.zodiac||[]).find(x=>x.id===id); }
function religionDef(id){ return (GAME.religions||[]).find(x=>x.id===id); }
function traitName(id){ const t=(GAME.traits||[]).find(x=>x.id===id); return t?t.name:id; }
function traitIcon(id){ const t=(GAME.traits||[]).find(x=>x.id===id); return t?t.icon:"sparkle"; }
function skillDef(id){ return (GAME.skills||[]).find(x=>x.id===id); }
function genderWord(g,m,f,n){ return g==="male"?m:g==="female"?f:n; }
function fullName(p){ return (p.first||p.name)+" "+p.last; }
function npcIcon(p){
  const map={father:"person",mother:"person",sibling:"person",friend:"people",lover:"heart",spouse:"ring",child:"baby",coworker:"briefcase",ex:"heartbroken",
    grandfather:"person",grandmother:"person",aunt:"person",uncle:"person",cousin:"people",rival:"crime"};
  return map[p.relation] || "person";
}

/* ============================================================
   STAT ENGINE
   ============================================================ */
function changeStat(stat, delta){ if(stat in G.s) G.s[stat]=clamp(G.s[stat]+delta); }
function adjustMoney(delta){ G.s.money += Math.round(delta); }
function statColor(v){ return v>=70?"var(--accent)":v>=40?"var(--gold)":"var(--red)"; }

/* ============================================================
   RENDERING
   ============================================================ */
function log(text, kind="info", tag=null){
  if(!G.s) return;
  G.s.log.push({text, kind, tag, age:G.s.age});
  if(G.s.log.length>500) G.s.log.shift();
  renderFeedItem({text, kind, tag});
}
function stripEmoji(s){
  if(!s) return s;
  return s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}]/gu,"").replace(/\s{2,}/g," ").trim();
}
function renderFeedItem(entry){
  const feed=$("#feed"); const div=document.createElement("div");
  div.className="event "+(entry.kind||"info");
  div.innerHTML=(entry.tag?`<span class="ev-tag">${entry.tag}</span>`:"")+stripEmoji(entry.text);
  feed.appendChild(div); feed.scrollTop=feed.scrollHeight;
}
function renderFeed(){ const feed=$("#feed"); feed.innerHTML=""; G.s.log.forEach(renderFeedItem); feed.scrollTop=feed.scrollHeight; }
function yearDivider(){ const feed=$("#feed"); const d=document.createElement("div"); d.className="event year-divider"; d.textContent=`Age ${G.s.age}`; feed.appendChild(d); }

function renderTopbar(){
  $("#charName").textContent=fullName(G.s);
  $("#charFlag").textContent="";
  $("#moneyDisplay").textContent=fmtMoney(G.s.money);
  $("#ageNum").textContent=G.s.age;
  $("#avatar").innerHTML=faceSVG(avatarState(), hairHex(G.s.appearance&&G.s.appearance.hair));
  let sub=`${G.s.age} yrs · ${cap(G.s.gender)} · ${G.s.country}`;
  if(G.s.inPrison) sub=`Inmate · ${G.s.prisonYears} yr(s) left`;
  else if(G.s.military) sub=`${GAME.militaryRanks[G.s.military.rankIndex]} · ${branchName()}`;
  else if(G.s.job) sub=`${currentJobTitle()} · ${G.s.country}`;
  else if(G.s.inSchool) sub=`${schoolName()} · ${G.s.country}`;
  $("#charSub").textContent=sub;
  $("#navOccLabel").textContent = G.s.military? "Service" : (G.s.inSchool ? "School" : (G.s.job? "Job":"Career"));
}
function avatarState(){
  if(!G.s.alive) return "dead"; if(G.s.inPrison) return "prison";
  if(G.s.supernatural) return G.s.supernatural.type;
  if(G.s.health<25) return "sick"; if(G.s.mental<25) return "stressed";
  if(G.s.happiness>75) return "happy"; if(G.s.happiness<30) return "sad"; return "neutral";
}
function hairHex(name){ return {black:"#1a1a1a",brown:"#5b3a29",blonde:"#d9b25e",red:"#a8431f",auburn:"#7a3b1f",gray:"#9a9a9a"}[name]||"#5b3a29"; }
function renderStats(){
  $$("#stats .stat").forEach(el=>{
    const stat=el.dataset.stat; const v=Math.round(G.s[stat]);
    const fill=$(".fill",el); fill.style.width=v+"%"; fill.style.background=statColor(v);
    $(".stat-val",el).textContent=v+"%";
  });
}
function renderAll(){ renderTopbar(); renderStats(); saveGame(); }
function toast(msg){ const t=$("#toast"); t.textContent=stripEmoji(msg); t.classList.remove("hidden"); clearTimeout(t._to); t._to=setTimeout(()=>t.classList.add("hidden"),1900); }

/* ============================================================
   AGING LOOP
   ============================================================ */
function ageUp(){
  if(!G.s.alive){ showDeathScreen(); return; }
  G.s.age++; yearDivider();

  if(G.s.inPrison){
    G.s.prisonYears--;
    log(`⛓️ Another year behind bars. ${Math.max(0,G.s.prisonYears)} year(s) left.`, "bad", "Prison");
    changeStat("happiness",-6); changeStat("mental",-5);
    if(G.s.prisonYears<=0){ G.s.inPrison=false; log("🔓 You were released from prison. A fresh start awaits.","good","Prison"); }
    runPrisonEvent();
    afterAge(); return;
  }

  ageNPCs();
  progressEducation();
  if(G.s.job){
    const sal=G.s.job.salary; adjustMoney(sal);
    log(`💼 You earned ${fmtMoney(sal)} working as ${currentJobTitle()}.`, "money", "Work");
    G.s.job.performance=clamp(G.s.job.performance+rand(-6,6));
    maybePromotionOrFire();
  }
  processPolitics();
  processMilitary();
  processEmigration();
  updateMarket();
  processBusinesses();
  processRealEstate();
  processRentalIncome();
  processFollowers();
  processRoyalties();
  payUpkeep();
  naturalDrift();
  progressConditions();
  runYearlyEvents();      // guarantees >=1 popup
  checkDeath();
  afterAge();
}
function afterAge(){ checkAchievements(); renderAll(); if(!G.s.alive) showDeathScreen(); }

function naturalDrift(){
  changeStat("happiness", rand(-3,2));
  if(G.s.age>30) changeStat("health", -Math.floor((G.s.age-30)/12)-rand(0,1));
  if(G.s.fitness>60) changeStat("health",1);
  if(G.s.age>32 && chance(0.4)) changeStat("looks",-1);
  if(G.s.age>70 && chance(0.3)) changeStat("smarts",-1);
  if(G.s.happiness<35) changeStat("mental",-2);
  if(G.s.happiness>70) changeStat("mental",1);
  G.s.addictions.forEach(()=>{ changeStat("health",-2); changeStat("mental",-1); if(chance(.3))changeStat("happiness",-2); });
  (G.s.traits||[]).forEach(tid=>{ const t=(GAME.traits||[]).find(x=>x.id===tid); if(t&&t.passive){ for(const k in t.passive) changeStat(k, t.passive[k]); } });
  if(G.s.faith && G.s.faith.devotion>50){ changeStat("mental",1); if(chance(0.4)) changeStat("happiness",1); }
}
function ageNPCs(){
  G.s.people.forEach(p=>{
    if(!p.alive) return; p.age++;
    p.relationship=clamp(p.relationship-rand(0,2));
    let dp=0; if(p.age>60)dp=(p.age-60)/600; if(p.age>85)dp+=0.05;
    if(chance(dp)){ p.alive=false; log(`🕯️ ${fullName(p)}, your ${p.relation}, passed away at ${p.age}.`,"bad","Loss"); changeStat("happiness",-18); changeStat("mental",-12); }
  });
}
function payUpkeep(){
  let up=0; G.s.assets.forEach(a=>{ if(a.upkeep) up+=a.upkeep; });
  if(up>0){ adjustMoney(-up); log(`🏠 Paid ${fmtMoney(up)} in property upkeep.`, "money"); }
}
function progressConditions(){
  G.s.conditions.forEach(c=>{ c.years=(c.years||0)+1; if(c.kind==="mental")changeStat("mental",-3); else changeStat("health",-2); if(c.minor&&chance(0.4))c.cured=true; });
  const before=G.s.conditions.length;
  G.s.conditions=G.s.conditions.filter(c=>!c.cured);
  if(G.s.conditions.length<before) log("😌 You recovered from a minor ailment.","good","Health");
}
function progressEducation(){
  if(!G.s.inSchool) return;
  if(G.s.age===5) log("🎒 You started primary school.","info","School");
  if(G.s.age===12) log("🏫 You moved up to secondary school.","info","School");
  if(G.s.age>=6 && G.s.age<18) G.s.gpa=clamp(G.s.gpa+(G.s.smarts>60?rand(-1,3):rand(-3,1)));
  if(G.s.age===18){
    G.s.edu=Math.max(G.s.edu,1); G.s.inSchool=false;
    log(`🎓 You graduated high school with a ${G.s.gpa.toFixed(0)}% GPA!`,"good","School");
    changeStat("smarts",4);
  }
}
function maybePromotionOrFire(){
  const job=G.s.job; const career=CAREERS().find(c=>c.id===job.careerId); if(!career) return;
  if(job.performance>78 && job.rankIndex<career.ladder.length-1 && chance(0.35)){
    job.rankIndex++;
    job.salary=Math.round(career.base*(1+job.rankIndex*0.45)*G.s.wealthFactor);
    log(`📈 Promoted to ${career.ladder[job.rankIndex]}! New salary ${fmtMoney(job.salary)}.`,"good","Career");
    changeStat("happiness",8); if(career.fame) changeStat("fame",10);
  } else if(job.performance<22 && chance(0.4)){
    log(`📉 You were fired from your job as ${currentJobTitle()}.`,"bad","Career");
    G.s.job=null; changeStat("happiness",-12); changeStat("mental",-6);
  }
}
function runPrisonEvent(){
  askQuestion({icon:"⛓️", title:"Prison Life", body:"Another day inside. What do you do?",
    choices:[
      {label:"Keep your head down", primary:false, fn:()=>{ log("You stayed out of trouble.","info"); }},
      {label:"Work out in the yard", fn:()=>{ changeStat("fitness",rand(3,7)); changeStat("health",2); log("You got jacked in the yard. 💪","good"); }},
      {label:"Join the library program", fn:()=>{ changeStat("smarts",rand(2,5)); log("You spent time studying.","good"); }},
      {label:"Attempt escape", sub:"Very risky minigame", cls:"danger", fn:()=>prisonBreakGame()},
    ]});
}
function attemptPrisonEscape(){
  if(chance(0.2)){ G.s.inPrison=false; G.s.prisonYears=0; G.s.notoriety+=20; G.s.criminalRecord.push({crime:"Prison Escape",age:G.s.age}); log("🏃 You escaped from prison! You're now a fugitive.","bad","Prison Break"); }
  else { G.s.prisonYears+=3; changeStat("health",-10); log("🚨 Your escape failed. 3 years added to your sentence.","bad","Prison Break"); }
}

/* ============================================================
   DECLARATIVE EVENT ENGINE
   ============================================================ */
function jobIsRisky(){ const c=G.s.job&&CAREERS().find(x=>x.id===G.s.job.careerId); return !!(c&&c.risky); }
function condMet(cond){
  if(!cond) return true;
  const living=G.s.people.filter(p=>p.alive);
  const partner=living.find(p=>p.relation==="spouse"||p.relation==="lover");
  if(cond.hasJob && !G.s.job) return false;
  if(cond.noJob && G.s.job) return false;
  if(cond.inSchool && !G.s.inSchool) return false;
  if(cond.single && partner) return false;
  if(cond.hasPartner && !partner) return false;
  if(cond.hasLover && !living.some(p=>p.relation==="lover")) return false;
  if(cond.married && !living.some(p=>p.relation==="spouse")) return false;
  if(cond.hasChild && !living.some(p=>p.relation==="child")) return false;
  if(cond.hasFriend && !living.some(p=>p.relation==="friend")) return false;
  if(cond.hasPet===true && G.s.pets.length===0) return false;
  if(cond.hasPet===false && G.s.pets.length>0) return false;
  if(cond.moneyMin!=null && G.s.money<cond.moneyMin) return false;
  if(cond.gender && G.s.gender!==cond.gender) return false;
  if(cond.risky && !jobIsRisky()) return false;
  if(cond.hasOffice && !G.s.politics) return false;
  if(cond.immigrant && G.s.bornCountry===G.s.country) return false;
  if(cond.fameMin!=null && G.s.fame<cond.fameMin) return false;
  if(cond.trait && !(G.s.traits||[]).includes(cond.trait)) return false;
  if(cond.hasMilitary && !G.s.military) return false;
  if(cond.hasMafia && !G.s.mafia) return false;
  if(cond.skillMin && (!G.s.skills || (G.s.skills[cond.skillMin.id]||0) < cond.skillMin.lvl)) return false;
  if(cond.supernatural){ if(!G.s.supernatural) return false; if(cond.supernatural!=="any" && G.s.supernatural.type!==cond.supernatural) return false; }
  if(cond.hasRival && !G.s.people.some(p=>p.alive&&p.relation==="rival")) return false;
  if(cond.hasFaith && (!G.s.faith||!G.s.faith.religion)) return false;
  if(cond.zodiac && G.s.zodiac!==cond.zodiac) return false;
  return true;
}
function eligibleEvents(){
  const age=G.s.age;
  return EVENTS().filter(ev=>{
    if(age < (ev.min||0) || age > (ev.max==null?120:ev.max)) return false;
    if(ev.once && G.s.firedOnce.includes(ev.id)) return false;
    if(G.s.recentEvents.includes(ev.id)) return false;
    return condMet(ev.cond);
  });
}
function weightedPickN(arr, n){
  const pool=arr.slice(); const out=[];
  for(let i=0;i<n && pool.length;i++){
    let total=pool.reduce((s,e)=>s+(e.weight||1),0);
    let r=Math.random()*total, idx=0;
    for(let j=0;j<pool.length;j++){ r-=(pool[j].weight||1); if(r<=0){ idx=j; break; } }
    out.push(pool.splice(idx,1)[0]);
  }
  return out;
}
function runYearlyEvents(){
  const elig=eligibleEvents();
  if(elig.length===0){ // safety net — always show something
    askQuestion({icon:"☀️", title:"A Quiet Year", body:"Life rolled on without much drama this year.", choices:[{label:"Continue", primary:true, fn:()=>changeStat("happiness",1)}]});
    return;
  }
  let count=1+(chance(0.45)?1:0)+(chance(0.15)?1:0);
  count=Math.min(count, elig.length);
  weightedPickN(elig, count).forEach(fireEvent);
}
function buildCtx(){
  const living=G.s.people.filter(p=>p.alive);
  const person = living.length? pick(living):null;
  const partner = living.find(p=>p.relation==="spouse"||p.relation==="lover");
  const child = living.find(p=>p.relation==="child");
  const friend = living.find(p=>p.relation==="friend");
  const pet = G.s.pets[0];
  return {
    name:G.s.first,
    _person:person, person:person?person.name:"someone",
    _partner:partner, partner:partner?partner.name:"your partner",
    _child:child, child:child?child.name:"your kid",
    _friend:friend, friend:friend?friend.name:"your friend",
    pet:pet?pet.name:"your pet",
  };
}
function tok(str, ctx){
  if(!str) return str;
  return str.replace(/\{(\w+)\}/g, (m,k)=> (ctx[k]!=null? ctx[k] : m));
}
function fireEvent(ev){
  if(ev.once && !G.s.firedOnce.includes(ev.id)) G.s.firedOnce.push(ev.id);
  G.s.recentEvents.push(ev.id); if(G.s.recentEvents.length>30) G.s.recentEvents.shift();
  const ctx=buildCtx();
  const body=tok(ev.text||"", ctx);
  let choices;
  if(ev.choices && ev.choices.length){
    choices=ev.choices.map(ch=>({ label:tok(ch.label,ctx), sub:ch.sub?tok(ch.sub,ctx):null, cls:ch.cls, fn:()=>resolveChoice(ch,ctx) }));
  } else {
    choices=[{label:"OK", primary:true, fn:()=>{ applyEffects(ev.effects,ctx); if(ev.log) log(tok(ev.log,ctx), ev.kind||"info", ev.title); }}];
  }
  askQuestion({icon:ev.icon||"🎲", title:ev.title||"Life Event", body, choices});
}
function resolveChoice(ch, ctx){
  applyEffects(ch.effects, ctx);
  if(ch.log) log(tok(ch.log,ctx), ch.kind||"info");
  if(ch.outcomes){ const o=rollOutcomes(ch.outcomes); if(o){ applyEffects(o.effects,ctx); if(o.log) log(tok(o.log,ctx), o.kind||"info"); } }
}
function rollOutcomes(arr){
  let r=Math.random(), acc=0;
  for(const o of arr){ acc+=(o.chance||0); if(r<=acc) return o; }
  return null;
}
function applyEffects(eff, ctx){
  if(!eff) return;
  for(const [k,v] of Object.entries(eff)){
    switch(k){
      case "happiness": case "health": case "smarts": case "looks":
      case "mental": case "karma": case "fame": case "fitness": changeStat(k,v); break;
      case "money": adjustMoney(v); break;
      case "addAddiction": if(!G.s.addictions.includes(v)) G.s.addictions.push(v); break;
      case "addCondition": v===true? addRandomCondition() : addNamedCondition(v); break;
      case "cureCondition": cureOneCondition(); break;
      case "relAll": G.s.people.forEach(p=>{ if(p.alive) p.relationship=clamp(p.relationship+v); }); break;
      case "relRandom": if(ctx&&ctx._person) ctx._person.relationship=clamp(ctx._person.relationship+v); break;
      case "relPartner": if(ctx&&ctx._partner) ctx._partner.relationship=clamp(ctx._partner.relationship+v); break;
      case "relChild": if(ctx&&ctx._child) ctx._child.relationship=clamp(ctx._child.relationship+v); break;
      case "newFriend": spawnFriend(); break;
      case "newLover": spawnLover(); break;
      case "newBaby": spawnBaby(); break;
      case "newPet": spawnPet(); break;
      case "losePet": if(G.s.pets.length) G.s.pets.shift(); break;
      case "marryPartner": { const l=G.s.people.find(p=>p.alive&&p.relation==="lover"); if(l){ l.relation="spouse"; G.s.stats_lifetime.partners++; } break; }
      case "loseJob": G.s.job=null; break;
      case "gainPerf": if(G.s.job) G.s.job.performance=clamp(G.s.job.performance+v); break;
      case "raise": if(G.s.job) G.s.job.salary=Math.round(G.s.job.salary*(1+v)); break;
      case "jail": goToPrison(v); break;
      case "approval": if(G.s.politics) G.s.politics.approval=clamp((G.s.politics.approval||50)+v); break;
      case "loseOffice": loseOffice(); break;
      case "notoriety": G.s.notoriety=(G.s.notoriety||0)+v; break;
      case "followers": G.s.followers=Math.max(0,(G.s.followers||0)+v); break;
      case "newRival": if(!G.s.people.some(p=>p.alive&&p.relation==="rival")) spawnRival(); break;
      case "devotion": if(G.s.faith) G.s.faith.devotion=clamp((G.s.faith.devotion||0)+v); break;
      case "loseFaith": if(G.s.faith){ log(`You left ${religionDef(G.s.faith.religion).name}.`,"info","Faith"); G.s.faith=null; } break;
    }
  }
}
function addRandomCondition(){ const d=pick(C().diseases); addCondition(d.name,d.kind,d.minor); if(d.kind==="mental")changeStat("mental",-8); else changeStat("health",-10); }
function addNamedCondition(name){ const d=C().diseases.find(x=>x.name===name); addCondition(name, d?d.kind:"physical", d?d.minor:true); }
function addCondition(name, kind="physical", minor=true){ if(!G.s.conditions.some(c=>c.name===name)) G.s.conditions.push({name,kind,minor,years:0}); }
function cureOneCondition(){ if(G.s.conditions.length){ G.s.conditions.shift(); changeStat("health",6); } }
function spawnFriend(){ const f=makeNPC("friend",pick(C().surnames)); f.age=clamp(G.s.age+rand(-5,5),5,90); f.relationship=rand(45,70); G.s.people.push(f); }
function spawnLover(){ const l=makeNPC("lover",pick(C().surnames)); l.age=clamp(G.s.age+rand(-4,4),16,85); l.relationship=rand(45,65); G.s.people.push(l); }
function spawnBaby(){
  const b=makeNPC("child",G.s.last); b.age=0; b.relationship=rand(70,90);
  // genetics — partially inherit your stats for "continue as child"
  b.smartsGene=clamp(Math.round((G.s.smarts+rand(20,80))/2)+rand(-8,8));
  b.looksGene =clamp(Math.round((G.s.looks +rand(20,80))/2)+rand(-8,8));
  G.s.people.push(b); G.s.stats_lifetime.kids++;
}
function spawnPet(){ const base=pick(C().pets); G.s.pets.push({uid:"p"+Math.random().toString(36).slice(2,7), name:base.name, icon:base.icon, breed:base.name, level:1}); }

/* ============================================================
   MODAL SYSTEM
   ============================================================ */
let modalQueue=[]; let modalOpen=false;
function askQuestion(cfg){ modalQueue.push(cfg); if(!modalOpen) showNextModal(); }
function showNextModal(){
  if(modalQueue.length===0){ closeModal(); return; }
  modalOpen=true; const cfg=modalQueue.shift();
  $("#modalIcon").innerHTML=iconHTML(cfg.icon||"sparkle");
  $("#modalTitle").textContent=cfg.title||"";
  $("#modalBody").innerHTML=cfg.bodyHTML||(cfg.body?`<p>${cfg.body}</p>`:"");
  const cont=$("#modalChoices"); cont.innerHTML="";
  (cfg.choices||[{label:"OK",primary:true}]).forEach(ch=>{
    const btn=document.createElement("button");
    btn.className="choice-btn"+(ch.primary?" primary":"")+(ch.cls?(" "+ch.cls):"");
    btn.innerHTML=`<span>${ch.label}</span>`+(ch.sub?`<span class="choice-sub">${ch.sub}</span>`:"");
    btn.onclick=()=>{ if(ch.fn)ch.fn(); renderAll(); showNextModal(); };
    cont.appendChild(btn);
  });
  $("#modalLayer").classList.remove("hidden");
}
function closeModal(){ modalOpen=false; $("#modalLayer").classList.add("hidden"); }
function openPanel(cfg){
  $("#modalIcon").innerHTML=iconHTML(cfg.icon||"clipboard");
  $("#modalTitle").textContent=cfg.title||"";
  $("#modalBody").innerHTML=cfg.bodyHTML||"";
  const cont=$("#modalChoices"); cont.innerHTML="";
  (cfg.choices||[{label:"Close",primary:true,fn:closePanel}]).forEach(ch=>{
    const btn=document.createElement("button"); btn.className="choice-btn"+(ch.primary?" primary":""); btn.innerHTML=ch.label; btn.onclick=ch.fn||closePanel; cont.appendChild(btn);
  });
  modalOpen=true; $("#modalLayer").classList.remove("hidden");
}
function closePanel(){ modalOpen=false; $("#modalLayer").classList.add("hidden"); if(modalQueue.length) showNextModal(); }

/* ============================================================
   TABS
   ============================================================ */
function openTab(tab){
  if(!G.s.alive) return;
  if(tab==="occupation") openOccupation();
  else if(tab==="assets") openAssets();
  else if(tab==="relationships") openRelationships();
  else if(tab==="activities") openActivities();
}

/* ---------- OCCUPATION ---------- */
function openOccupation(){
  if(G.s.inPrison){ openPanel({icon:"⛓️", title:"Incarcerated", bodyHTML:`<p>You're locked up. ${G.s.prisonYears} year(s) remain.</p>`}); return; }
  let html=`<div class="section-head">Current Status</div>`;
  if(G.s.job){
    const job=G.s.job;
    html+=rowHTML("💼", currentJobTitle(), `Salary ${fmtMoney(job.salary)} · Performance ${Math.round(job.performance)}%`,[
      {txt:"Work harder", id:"work_hard"},{txt:"Quit", id:"quit_job", sec:true}]);
  } else if(G.s.inSchool){
    html+=rowHTML("🎒", schoolName(), `GPA ${G.s.gpa.toFixed(0)}% · Smarts ${Math.round(G.s.smarts)}%`,[{txt:"Study", id:"study"}]);
  } else { html+=`<p style="color:var(--text-dim)">You are currently unemployed.</p>`; }

  html+=`<div class="section-head">Education — ${C().eduLevels[G.s.edu]}</div>`;
  if(!G.s.inSchool && G.s.age>=18 && G.s.edu<4) html+=rowHTML("🏛️","Enroll in higher education","Boost smarts & unlock careers",[{txt:"Enroll", id:"enroll_uni"}]);

  html+=`<div class="section-head">Job Market</div>`;
  if(G.s.age<16){ html+=`<p style="color:var(--text-dim)">You're too young to work.</p>`; }
  else {
    const avail=CAREERS().filter(c=>c.edu<=G.s.edu);
    avail.forEach(c=>{ const sal=Math.round(c.base*G.s.wealthFactor); html+=rowHTML(c.icon,c.name,`Entry: ${c.ladder[0]} · ~${fmtMoney(sal)}/yr`,[{txt:"Apply", id:"apply_"+c.id}]); });
    const locked=CAREERS().filter(c=>c.edu>G.s.edu);
    if(locked.length){ html+=`<div class="section-head">Locked — need more education</div>`; locked.forEach(c=>{ html+=rowHTML(c.icon,c.name,`Requires: ${C().eduLevels[c.edu]}`,[]); }); }
  }
  if(spotlightCareer()){ html+=`<div class="section-head">Spotlight</div>`; html+=rowHTML("star", spotlightCareer().name+" Projects", "Create work, build fame", [{txt:"Open", id:"spotlight"}]); }

  html+=`<div class="section-head">Military</div>`;
  if(G.s.military){ html+=rowHTML("medal", `${GAME.militaryRanks[G.s.military.rankIndex]}, ${branchName()}`, `${G.s.military.years} year(s) served`, [{txt:"Discharge", id:"discharge", sec:true}]); }
  else if(G.s.age>=18){ html+=rowHTML("medal","Enlist in the Military","Serve, rank up & deploy",[{txt:"Enlist", id:"enlist"}]); }

  html+=`<div class="section-head">Politics</div>`;
  if(G.s.politics){ const o=GAME.offices[G.s.politics.officeIndex]; html+=rowHTML(o.icon,o.name,`Approval ${Math.round(G.s.politics.approval)}% · ${G.s.politics.termLeft}y left`,[{txt:"Manage", id:"politics"}]); }
  else if(G.s.age>=18){ html+=rowHTML("ballot","Enter Politics","Run for public office",[{txt:"Open", id:"politics"}]); }
  else { html+=`<p style="color:var(--text-dim)">You can run for office once you're 18.</p>`; }
  openPanel({icon:"briefcase", title:"Career & Education", bodyHTML:html});
  wireRowActions(handleOccupationAction);
}
function handleOccupationAction(id){
  if(id==="work_hard"){ G.s.job.performance=clamp(G.s.job.performance+rand(4,10)); changeStat("happiness",-2); changeStat("health",-1); toast("Extra effort — performance up!"); closePanel(); renderAll(); }
  else if(id==="quit_job"){ log(`You quit your job as ${currentJobTitle()}.`,"info","Career"); G.s.job=null; closePanel(); renderAll(); }
  else if(id==="study"){ G.s.gpa=clamp(G.s.gpa+rand(3,9)); changeStat("smarts",rand(1,3)); changeStat("happiness",-2); toast("You hit the books. GPA up!"); closePanel(); renderAll(); }
  else if(id==="enroll_uni"){ enrollHigherEd(); }
  else if(id==="politics"){ politicsCenter(); }
  else if(id==="enlist"){ enlist(); }
  else if(id==="discharge"){ dischargeMilitary(); }
  else if(id==="spotlight"){ spotlightPanel(); }
  else if(id.startsWith("apply_")){ applyForJob(id.slice(6)); }
}
function applyForJob(careerId){
  const c=CAREERS().find(x=>x.id===careerId); if(!c) return;
  let p=0.4+(G.s.smarts/300)+(G.s.edu*0.06);
  if(c.fame) p+=G.s.looks/300; if(c.fit) p+=G.s.fitness/300;
  let sb=0; (GAME.skills||[]).forEach(sk=>{ if(sk.boosts.includes(careerId)) sb=Math.max(sb, G.s.skills[sk.id]||0); }); p+=sb/250;
  p=Math.min(0.95,p); closePanel();
  if(chance(p)){
    const salary=Math.round(c.base*G.s.wealthFactor);
    G.s.job={careerId, rankIndex:0, salary, performance:rand(45,65)};
    G.s.stats_lifetime.jobsHeld++;
    log(`🎉 You were hired as a ${c.ladder[0]} (${c.name})!`,"good","Career"); changeStat("happiness",8);
  } else { log(`📪 Your application for ${c.name} was rejected.`,"bad","Career"); changeStat("happiness",-4); }
  renderAll();
}
function enrollHigherEd(){
  const cost=Math.round(20000*G.s.wealthFactor); closePanel();
  askQuestion({icon:"🏛️", title:"Higher Education", body:`Enrolling costs about ${fmtMoney(cost)} but boosts smarts and unlocks careers. Proceed?`,
    choices:[
      {label:`Pay tuition (${fmtMoney(cost)})`, primary:true, fn:()=>{ if(G.s.money<cost){ log("You can't afford tuition right now.","bad","School"); return; } adjustMoney(-cost); G.s.edu=Math.min(4,G.s.edu+1); changeStat("smarts",rand(6,12)); log(`📜 You earned a ${C().eduLevels[G.s.edu]} qualification!`,"good","School"); }},
      {label:"Take a student loan", sub:"Debt now, degree now", fn:()=>{ G.s.money-=cost; G.s.edu=Math.min(4,G.s.edu+1); changeStat("smarts",rand(6,12)); changeStat("mental",-4); log(`📜 You earned a ${C().eduLevels[G.s.edu]} (with student debt).`,"info","School"); }},
      {label:"Never mind"},
    ]});
}

/* ---------- ASSETS ---------- */
function openAssets(){
  let html=`<p style="color:var(--text-dim);font-size:12px;margin-bottom:6px">Balance: ${fmtMoney(G.s.money)}${stockValue()+cryptoValue()>0?` · Investments ${fmtMoney(stockValue()+cryptoValue())}`:""}</p>`;
  html+=`<div class="section-head">Money & Investing</div>`;
  html+=rowHTML("chart","Finance Center","Stocks, crypto & businesses",[{txt:"Open", id:"finance"}]);
  [["Real Estate","homes"],["Vehicles","cars"],["Luxury","luxury"]].forEach(([label,key])=>{
    html+=`<div class="section-head">${label}</div>`;
    SHOP()[key].forEach(item=>{
      const owned=G.s.assets.some(a=>a.id===item.id);
      const sub=item.upkeep?`${fmtMoney(item.price)} · upkeep ${fmtMoney(item.upkeep)}/yr`:fmtMoney(item.price);
      html+=rowHTML(item.icon,item.name,sub, owned?[{txt:"Owned",sec:true}]:[{txt:"Buy", id:"buy_"+key+"_"+item.id}]);
    });
  });
  html+=`<div class="section-head">Your Assets</div>`;
  if(G.s.assets.length===0) html+=`<p style="color:var(--text-dim)">You don't own anything yet.</p>`;
  G.s.assets.forEach(a=>{ html+=rowHTML(a.icon,a.name,`Value ~${fmtMoney(a.value)}`,[{txt:"Sell", id:"sell_"+a.uid, sec:true}]); });
  openPanel({icon:"🏠", title:"Assets & Shop", bodyHTML:html});
  wireRowActions(handleAssetAction);
}
function handleAssetAction(id){
  if(id==="finance"){ financeCenter(); return; }
  if(id.startsWith("buy_")){
    const parts=id.split("_"); const key=parts[1]; const itemId=parts.slice(2).join("_");
    const item=SHOP()[key].find(i=>i.id===itemId); if(!item) return;
    if(G.s.money<item.price){ toast("You can't afford that."); return; }
    adjustMoney(-item.price);
    G.s.assets.push({uid:"a"+Math.random().toString(36).slice(2,8), id:item.id, type:key, name:item.name, icon:item.icon, value:item.price, upkeep:item.upkeep||0});
    log(`🛍️ You bought a ${item.name} for ${fmtMoney(item.price)}.`,"money","Purchase"); changeStat("happiness",6);
    renderAll(); openAssets();
  } else if(id.startsWith("sell_")){
    const uid=id.slice(5); const idx=G.s.assets.findIndex(a=>a.uid===uid); if(idx<0) return;
    const a=G.s.assets[idx]; const sale=Math.round(a.value*0.8); adjustMoney(sale); G.s.assets.splice(idx,1);
    log(`💰 You sold your ${a.name} for ${fmtMoney(sale)}.`,"money","Sale"); renderAll(); openAssets();
  }
}

/* ---------- RELATIONSHIPS ---------- */
function openRelationships(){
  let html="";
  const groups={Family:["father","mother","sibling","child"], Extended:["grandfather","grandmother","aunt","uncle","cousin"], Partner:["spouse","lover"], Social:["friend","coworker","ex"], Rivals:["rival"]};
  for(const [gname,rels] of Object.entries(groups)){
    const list=G.s.people.filter(p=>p.alive&&rels.includes(p.relation)); if(!list.length) continue;
    html+=`<div class="section-head">${gname}</div>`;
    list.forEach(p=>{
      html+=`<div class="list-row" data-pid="${p.id}"><div class="lr-ico">${iconHTML(npcIcon(p))}</div>
        <div class="lr-main"><div class="lr-title">${fullName(p)} <span class="tag-pill">${cap(p.relation)}</span></div>
        <div class="lr-sub">Age ${p.age} · ${p.traits[0]}</div>
        <div class="mini-bar"><div style="width:${p.relationship}%;background:${statColor(p.relationship)}"></div></div></div>
        <button class="lr-action" data-act="interact_${p.id}">Interact</button></div>`;
    });
  }
  if(G.s.pets.length){ html+=`<div class="section-head">Pets</div>`; G.s.pets.forEach(pet=>{ html+=rowHTML(pet.icon,pet.name,"Your loyal companion",[{txt:"Play", id:"playpet_"+pet.uid}]); }); }
  html+=`<div class="section-head">Family</div>`;
  html+=rowHTML("tree","Family Tree","See your lineage",[{txt:"View", id:"famtree"}]);
  html+=`<div class="section-head">Find Someone</div>`;
  html+=rowHTML("📱","Dating App","Find a partner",[{txt:"Browse", id:"dating"}]);
  html+=rowHTML("🧑‍🤝‍🧑","Make a Friend","Meet someone new",[{txt:"Go out", id:"makefriend"}]);
  html+=rowHTML("🐾","Adopt a Pet","From the shelter",[{txt:"Adopt", id:"adoptpet"}]);
  openPanel({icon:"❤️", title:"Relationships", bodyHTML:html});
  wireRowActions(handleRelAction);
}
function handleRelAction(id){
  if(id.startsWith("interact_")) interactWith(id.slice(9));
  else if(id==="famtree") familyTree();
  else if(id==="dating") datingApp();
  else if(id==="makefriend") makeFriend();
  else if(id==="adoptpet") adoptPet();
  else if(id.startsWith("playpet_")){ changeStat("happiness",5); toast("You played with your pet! 🐾"); closePanel(); renderAll(); }
}
function interactWith(pid){
  const p=G.s.people.find(x=>x.id===pid); if(!p) return;
  const choices=[
    {label:"💬 Spend time together", fn:()=>{ p.relationship=clamp(p.relationship+rand(5,12)); changeStat("happiness",4); log(`You spent quality time with ${p.name}.`,"good"); }},
    {label:"🎁 Give a gift", sub:"Costs $200", fn:()=>{ if(G.s.money<200){toast("Too broke.");return;} adjustMoney(-200); p.relationship=clamp(p.relationship+rand(8,15)); log(`You gave ${p.name} a gift. They loved it!`,"good"); }},
    {label:"💬 Deep conversation", fn:()=>{ p.relationship=clamp(p.relationship+rand(3,8)); changeStat("mental",2); log(`You opened up to ${p.name}.`,"good"); }},
    {label:"💢 Insult them", cls:"danger", fn:()=>{ p.relationship=clamp(p.relationship-rand(10,20)); changeStat("karma",-4); log(`You insulted ${p.name}. Relationship damaged.`,"bad"); }},
  ];
  if(p.relation==="lover"||p.relation==="spouse"){
    choices.push(
      {label:"💕 Go on a date", sub:"$80", fn:()=>{ if(G.s.money<80){toast("Too broke for a date.");return;} adjustMoney(-80); p.relationship=clamp(p.relationship+rand(8,14)); changeStat("happiness",5); log(`A lovely date with ${p.name}.`,"good"); }},
      {label:"🌹 Romantic getaway", sub:"$1,200", fn:()=>{ if(G.s.money<1200){toast("Can't afford a getaway.");return;} adjustMoney(-1200); p.relationship=clamp(p.relationship+rand(15,25)); changeStat("happiness",10); changeStat("mental",4); log(`A dreamy getaway with ${p.name}.`,"good"); }},
    );
  }
  if(p.relation==="lover"){ choices.push({label:"💍 Propose marriage", fn:()=>proposeTo(p)}); choices.push({label:"💔 Break up", cls:"danger", fn:()=>{ p.relation="ex"; log(`You broke up with ${p.name}.`,"bad"); changeStat("happiness",-10); }}); }
  if(p.relation==="spouse"){ choices.push({label:"👶 Try for a baby", fn:()=>tryForBaby(p)}); choices.push({label:"💔 Divorce", cls:"danger", fn:()=>{ p.relation="ex"; log(`You divorced ${p.name}.`,"bad"); changeStat("happiness",-14); adjustMoney(-Math.round(G.s.money*0.3)); }}); }
  if(p.relation==="rival"){ choices.push({label:"🤝 Try to make peace", fn:()=>{ if(p.relationship>40||chance(0.4)){ p.relation="friend"; log(`You and ${p.name} put the rivalry behind you.`,"good"); changeStat("happiness",4); } else { p.relationship=clamp(p.relationship-5); log(`${p.name} rejected your peace offer.`,"info"); } }}); choices.push({label:"😤 Taunt them", cls:"danger", fn:()=>{ p.relationship=clamp(p.relationship-10); changeStat("happiness",2); log(`You taunted ${p.name}. The feud deepens.`,"info"); }}); }
  closePanel();
  askQuestion({icon:npcIcon(p), title:fullName(p), body:`Your ${p.relation}. Relationship: ${Math.round(p.relationship)}%.`, choices});
}
function proposeTo(p){
  if(p.relationship>55 && chance(0.5+p.relationship/250)){ p.relation="spouse"; log(`💍 ${p.name} said YES! You're married!`,"good","Marriage"); changeStat("happiness",20); G.s.stats_lifetime.partners++; }
  else { log(`💔 ${p.name} turned down your proposal.`,"bad"); p.relationship=clamp(p.relationship-15); changeStat("happiness",-12); }
}
function tryForBaby(p){
  if(chance(0.55)){ spawnBaby(); log(`🍼 Congratulations! You had a baby!`,"good","Family"); changeStat("happiness",16); adjustMoney(-3000); }
  else log("No baby this time.","info");
}
function datingApp(){
  closePanel();
  const cands=[];
  for(let i=0;i<3;i++){
    const cnd=makeNPC("lover",pick(C().surnames));
    cnd.age=clamp(G.s.age+rand(-5,5),18,90);
    cnd.looksScore=rand(20,95);
    cnd.compat=clamp(40+rand(0,45)+(G.s.looks>cnd.looksScore?5:0));
    cands.push(cnd);
  }
  window._dateCands=cands;
  let html=`<p style="color:var(--text-dim);font-size:13px">Today's matches — pick someone to ask out.</p>`;
  cands.forEach((cnd,i)=>{
    const tag=cnd.compat>65?"great match":cnd.compat>45?"decent match":"low match";
    html+=rowHTML("heart", `${fullName(cnd)}, ${cnd.age}`, `${cnd.traits[0]} · looks ${cnd.looksScore}% · ${tag}`, [{txt:"Ask out", id:"ask_"+i}]);
  });
  openPanel({icon:"phone", title:"Dating App", bodyHTML:html});
  wireRowActions(id=>{ if(id.startsWith("ask_")) askOut(window._dateCands[parseInt(id.slice(4))]); });
}
function askOut(cnd){
  closePanel(); if(!cnd) return;
  let p=Math.min(0.95, 0.2 + cnd.compat/200 + G.s.looks/300);
  if(chance(p)){ cnd.relationship=clamp(rand(45,60)+Math.round(cnd.compat/8)); G.s.people.push(cnd); log(`💑 ${cnd.name} agreed to date you!`,"good","Love"); changeStat("happiness",10); }
  else { log(`${cnd.name} wasn't interested.`,"bad"); changeStat("happiness",-4); }
  renderAll();
}
function makeFriend(){
  closePanel();
  if(chance(0.7)){ spawnFriend(); log(`🧑‍🤝‍🧑 You made a new friend!`,"good","Social"); changeStat("happiness",6); }
  else log("You went out but didn't click with anyone.","info");
  renderAll();
}
function adoptPet(){
  closePanel(); const base=pick(C().pets); const cost=300;
  if(G.s.money<cost){ toast("Can't afford the adoption fee."); return; }
  askQuestion({icon:base.icon, title:"Adopt a Pet", body:`Adopt a ${base.name} for ${fmtMoney(cost)}?`,
    choices:[{label:"Adopt", primary:true, fn:()=>{ adjustMoney(-cost); G.s.pets.push({uid:"p"+Math.random().toString(36).slice(2,7), name:base.name, icon:base.icon, breed:base.name, level:1}); log(`🐾 You adopted a ${base.name}!`,"good","Pet"); changeStat("happiness",10); }},{label:"Maybe later"}]});
}

/* ---------- ACTIVITIES ---------- */
function openActivities(){
  let html=`<div class="section-head">Mind & Body</div>`;
  html+=rowHTML("🏋️","Gym","Fitness, health & looks",[{txt:"Workout", id:"gym"}]);
  html+=rowHTML("🧘","Meditate","Improve mental health",[{txt:"Meditate", id:"meditate"}]);
  html+=rowHTML("cross","Hospital","Doctors, surgery, rehab",[{txt:"Open", id:"hospital"}]);
  html+=rowHTML("💄","Salon & Spa","Improve your looks",[{txt:"Pamper", id:"salon"}]);
  html+=rowHTML("💉","Plastic Surgery","Big looks boost (risky)",[{txt:"Consult", id:"surgery"}]);

  html+=`<div class="section-head">Fame & Media</div>`;
  html+=rowHTML("star","Fame Hub","Build your celebrity brand",[{txt:"Open", id:"fame"}]);

  html+=`<div class="section-head">Self-Improvement</div>`;
  html+=rowHTML("scroll","Skills","Practice & take lessons",[{txt:"Open", id:"skills"}]);
  html+=rowHTML("📚","Read a Book","Boost smarts",[{txt:"Read", id:"read"}]);
  html+=rowHTML("🌍","Learn a Language","Smarts + culture",[{txt:"Learn", id:"language"}]);
  html+=rowHTML("🧘‍♀️","Meditation Retreat","Big mental reset (costs)",[{txt:"Go", id:"retreat"}]);
  html+=rowHTML("💼","Side Hustle","Try to make extra cash",[{txt:"Hustle", id:"hustle"}]);

  html+=`<div class="section-head">Spirituality</div>`;
  html+=rowHTML(G.s.faith?faithDisplay().icon:"temple", G.s.faith?faithDisplay().name:"Religion", G.s.faith?`Devotion ${Math.round(G.s.faith.devotion)}%`:"Find or found a faith",[{txt:"Open", id:"faith"}]);
  html+=rowHTML("zodiac","Read Horoscope", (zodiacDef(G.s.zodiac)?zodiacDef(G.s.zodiac).name+" "+zodiacDef(G.s.zodiac).symbol:"Your sign"),[{txt:"Read", id:"horoscope"}]);

  html+=`<div class="section-head">Leisure</div>`;
  html+=rowHTML("🎮","Memory Game","Train your brain",[{txt:"Play", id:"mg_memory"}]);
  html+=rowHTML("⚡","Reflex Test","Test reactions",[{txt:"Play", id:"mg_reflex"}]);
  html+=rowHTML("🎰","Casino","Gamble your money",[{txt:"Enter", id:"mg_casino"}]);
  html+=rowHTML("🏖️","Vacation","Relax (costs money)",[{txt:"Book", id:"vacation"}]);
  html+=rowHTML("suitcase","Travel","See the world",[{txt:"Open", id:"travel"}]);
  html+=rowHTML("scissors","Restyle","Change your hair & look",[{txt:"Restyle", id:"restyle"}]);
  html+=rowHTML("📱","Social Media","Chase clout",[{txt:"Post", id:"social"}]);

  html+=`<div class="section-head">Legal & Civic</div>`;
  html+=rowHTML("gavel","Legal Center","Lawsuits, court & lawyers",[{txt:"Open", id:"legal"}]);
  html+=rowHTML("passport","Emigrate","Move to another country",[{txt:"Open", id:"emigrate"}]);

  html+=`<div class="section-head">Vices & Risk</div>`;
  html+=rowHTML("🍺","Party / Drink","Fun but risky",[{txt:"Go", id:"party"}]);
  html+=rowHTML("🚬","Try Substances","Risk of addiction",[{txt:"Try", id:"substance"}]);
  html+=rowHTML("crime","Crime","High risk, high reward",[{txt:"Open", id:"crime"}]);

  html+=`<div class="section-head">The Occult</div>`;
  if(G.s.supernatural) html+=rowHTML(G.s.supernatural.type==="vampire"?"fang":"wolf","Dark Powers",`Your ${G.s.supernatural.type} abilities`,[{txt:"Open", id:"occult"}]);
  else html+=rowHTML("moon","Seek the Occult","Dabble in dark forces",[{txt:"Seek", id:"occult"}]);

  if(G.s.conditions.length||G.s.addictions.length){
    html+=`<div class="section-head">Health Status</div>`;
    G.s.conditions.forEach(c=> html+=`<p style="color:var(--red);font-size:13px">• ${c.name}</p>`);
    G.s.addictions.forEach(a=> html+=`<p style="color:var(--red);font-size:13px">• Addicted to ${a}</p>`);
  }
  openPanel({icon:"🎯", title:"Activities", bodyHTML:html});
  wireRowActions(handleActivityAction);
}
function handleActivityAction(id){
  switch(id){
    case "gym": changeStat("fitness",rand(4,9)); changeStat("health",rand(2,5)); changeStat("looks",rand(1,3)); changeStat("happiness",2); toast("💪 Good workout!"); break;
    case "meditate": changeStat("mental",rand(4,9)); changeStat("happiness",rand(1,4)); toast("🧘 You feel centered."); break;
    case "read": changeStat("smarts",rand(2,5)); changeStat("happiness",1); toast("📚 You learned something."); break;
    case "language": changeStat("smarts",rand(3,6)); changeStat("happiness",2); toast("🌍 ¡Excelente!"); break;
    case "social": return socialMedia();
    case "hustle": return sideHustle();
    case "doctor": return doctorVisit();
    case "therapy": return therapy();
    case "salon": return salon();
    case "surgery": return plasticSurgery();
    case "retreat": return retreat();
    case "mg_memory": closePanel(); return memoryGame();
    case "mg_reflex": closePanel(); return reflexGame();
    case "mg_casino": closePanel(); return casinoLobby();
    case "vacation": return vacation();
    case "party": return party();
    case "substance": return trySubstance();
    case "crime": return crimeMenu();
    case "legal": return legalCenter();
    case "emigrate": return emigrate();
    case "hospital": return hospital();
    case "fame": return fameHub();
    case "skills": return skillsPanel();
    case "travel": return travelPanel();
    case "restyle": return restyle();
    case "occult": return G.s.supernatural? supernaturalPanel() : seekOccult();
    case "faith": return faithCenter();
    case "horoscope": return readHoroscope();
  }
  closePanel(); renderAll();
}
function restyle(){
  closePanel();
  const hairs=["black","brown","blonde","red","auburn","gray"];
  askQuestion({icon:"scissors", title:"Restyle", body:"Pick a new hair colour for a fresh look (and a small confidence boost).",
    choices:hairs.map(h=>({label:cap(h), fn:()=>{ G.s.appearance.hair=h; changeStat("looks",rand(1,3)); changeStat("happiness",3); log(`💇 You dyed your hair ${h}.`,"good","Looks"); }})).concat([{label:"Never mind"}])});
}
function doctorVisit(){
  closePanel(); const cost=Math.round(150*G.s.wealthFactor);
  if(G.s.money<cost){ toast("Can't afford the visit."); return; } adjustMoney(-cost);
  if(G.s.conditions.length){ const c=G.s.conditions[0]; if(chance(0.7)){ c.cured=true; G.s.conditions=G.s.conditions.filter(x=>!x.cured); log(`🩺 The doctor treated your ${c.name}.`,"good","Health"); changeStat("health",12); } else log("🩺 The doctor ran tests but couldn't fully treat you yet.","info","Health"); }
  else { changeStat("health",rand(3,7)); log("🩺 Clean bill of health.","good","Health"); }
  renderAll();
}
function therapy(){
  closePanel(); const cost=Math.round(200*G.s.wealthFactor);
  if(G.s.money<cost){ toast("Can't afford therapy."); return; } adjustMoney(-cost);
  changeStat("mental",rand(6,14)); changeStat("happiness",rand(2,6));
  const mc=G.s.conditions.find(c=>c.kind==="mental");
  if(mc&&chance(0.5)){ mc.cured=true; G.s.conditions=G.s.conditions.filter(x=>!x.cured); log(`🧠 Therapy helped you overcome ${mc.name}.`,"good","Mental"); }
  else log("🧠 A productive therapy session.","good","Mental");
  renderAll();
}
function salon(){ closePanel(); const cost=Math.round(120*G.s.wealthFactor); if(G.s.money<cost){toast("Can't afford it.");return;} adjustMoney(-cost); changeStat("looks",rand(3,8)); changeStat("happiness",3); log("💄 You treated yourself at the salon.","good","Looks"); renderAll(); }
function plasticSurgery(){
  closePanel(); const cost=Math.round(15000*G.s.wealthFactor);
  askQuestion({icon:"💉", title:"Plastic Surgery", body:`A big looks boost for ${fmtMoney(cost)} — but surgery has risks. Proceed?`,
    choices:[
      {label:`Go through with it (${fmtMoney(cost)})`, primary:true, fn:()=>{ if(G.s.money<cost){ log("You can't afford surgery.","bad"); return; } adjustMoney(-cost); if(chance(0.8)){ changeStat("looks",rand(12,22)); changeStat("happiness",8); log("💉 The surgery was a success — stunning results!","good","Looks"); } else { changeStat("looks",-rand(8,16)); changeStat("health",-10); changeStat("mental",-8); log("💉 The surgery went wrong. Botched results.","bad","Looks"); } }},
      {label:"Cancel"},
    ]});
}
function retreat(){ closePanel(); const cost=Math.round(1500*G.s.wealthFactor); if(G.s.money<cost){toast("Can't afford the retreat.");return;} adjustMoney(-cost); changeStat("mental",rand(14,24)); changeStat("happiness",8); const mc=G.s.conditions.find(c=>c.kind==="mental"); if(mc){mc.cured=true; G.s.conditions=G.s.conditions.filter(x=>!x.cured);} log("🧘‍♀️ A week of silence and reflection. Total mental reset.","good","Mental"); renderAll(); }
function sideHustle(){
  closePanel();
  if(chance(0.5)){ const m=rand(200,2500); adjustMoney(m); changeStat("happiness",4); log(`💼 Your side hustle made ${fmtMoney(m)}!`,"money","Hustle"); }
  else { changeStat("happiness",-2); log("💼 Your side hustle flopped this time.","info","Hustle"); }
  renderAll();
}
function socialMedia(){
  closePanel();
  if(chance(0.3)){ const f=rand(3,12); changeStat("fame",f); changeStat("happiness",5); log(`📱 A post took off — +${f} fame!`,"good","Fame"); if(chance(0.3)) changeStat("mental",-4); }
  else { changeStat("happiness",2); if(chance(0.25)){ changeStat("mental",-5); log("📱 The comments got nasty. Felt rough.","bad"); } else log("📱 You scrolled and posted. Meh.","info"); }
  renderAll();
}
function vacation(){ closePanel(); const cost=Math.round(4000*G.s.wealthFactor); if(G.s.money<cost){toast("Can't afford a vacation.");return;} adjustMoney(-cost); changeStat("happiness",rand(12,22)); changeStat("mental",rand(5,12)); changeStat("health",4); log("🏖️ You took a relaxing vacation. Recharged!","good","Leisure"); renderAll(); }
function party(){ closePanel(); changeStat("happiness",rand(6,14)); changeStat("health",-rand(1,4)); if(chance(0.18)){ addRandomCondition(); log("🍺 You partied hard but woke up sick.","bad"); } else if(chance(0.1)){ makeFriend(); } else log("🍺 You had a great night out!","good","Leisure"); renderAll(); }
function trySubstance(){ closePanel(); changeStat("happiness",rand(5,12)); if(chance(0.35)){ const sub=pick(["alcohol","nicotine","painkillers"]); if(!G.s.addictions.includes(sub)){ G.s.addictions.push(sub); log(`⚠️ You developed an addiction to ${sub}.`,"bad","Addiction"); } } else log("You experimented but walked away fine... this time.","info"); renderAll(); }

/* ============================================================
   CRIME
   ============================================================ */
function crimeMenu(){
  closePanel();
  const crimes=[
    {name:"Pickpocket", icon:"🤏", reward:[50,400], risk:0.3, jail:1, karma:-5},
    {name:"Shoplift", icon:"🛍️", reward:[20,600], risk:0.35, jail:1, karma:-5},
    {name:"Burglary", icon:"🏚️", reward:[500,5000], risk:0.45, jail:3, karma:-12},
    {name:"Grand Theft Auto", icon:"🚗", reward:[2000,40000], risk:0.55, jail:5, karma:-18},
    {name:"Bank Robbery", icon:"🏦", reward:[10000,250000], risk:0.7, jail:12, karma:-30},
  ];
  let html=`<p style="color:var(--text-dim)">Crime pays — until it doesn't. Karma ${Math.round(G.s.karma)} · Notoriety ${G.s.notoriety}</p>`;
  html+=`<div class="section-head">Petty & Serious Crime</div>`;
  crimes.forEach((c,i)=>{ html+=rowHTML(c.icon,c.name,`Reward ${fmtMoney(c.reward[0])}–${fmtMoney(c.reward[1])} · ${Math.round(c.risk*100)}% caught`,[{txt:"Attempt", id:"crime_"+i}]); });
  html+=`<div class="section-head">Organized Crime</div>`;
  if(G.s.mafia) html+=rowHTML("fedora","The Family",`${GAME.mafiaRanks[G.s.mafia.rankIndex]} · ${G.s.mafia.respect} respect`,[{txt:"Open", id:"mafia"}]);
  else if(G.s.age>=18) html+=rowHTML("fedora","Join the Mafia","Rise through the ranks",[{txt:"Join", id:"joinmafia"}]);
  openPanel({icon:"crime", title:"Criminal Activity", bodyHTML:html, choices:[{label:"Back",primary:true,fn:closePanel}]});
  wireRowActions(id=>{ if(id==="joinmafia"){ joinMafia(); } else if(id==="mafia"){ mafiaCenter(); } else if(id.startsWith("crime_")){ commitCrime(crimes[parseInt(id.slice(6))]); } });
}
function commitCrime(c){
  closePanel(); G.s.stats_lifetime.crimes++;
  let risk=c.risk-G.s.smarts/600-((G.s.skills&&G.s.skills.fighting)||0)/500;
  if(chance(risk)){
    log(`🚨 You were caught attempting ${c.name}!`,"bad","Crime");
    G.s.criminalRecord.push({crime:c.name, age:G.s.age});
    askQuestion({icon:"⚖️", title:"Arrested!", body:`You've been arrested for ${c.name}. How do you plead?`,
      choices:[
        {label:"⚖️ Hire a lawyer", sub:"Costs money, reduces sentence", fn:()=>{ const fee=5000; if(G.s.money>=fee&&chance(0.5)){ adjustMoney(-fee); log("Your lawyer got you off with a warning!","good","Court"); } else { adjustMoney(-Math.min(fee,G.s.money)); goToPrison(Math.max(1,Math.round(c.jail*0.6))); } }},
        {label:"🙏 Plead guilty", sub:"Reduced sentence", fn:()=>goToPrison(Math.max(1,Math.round(c.jail*0.7)))},
        {label:"⚖️ Go to trial", sub:"Sway the jury yourself", fn:()=>trialMinigame(c.name, c.jail, ()=>goToPrison(c.jail))},
      ]});
    changeStat("karma",c.karma);
  } else {
    const haul=rand(c.reward[0],c.reward[1]); adjustMoney(haul);
    G.s.notoriety+=Math.round(Math.abs(c.karma)/3); changeStat("karma",c.karma); changeStat("happiness",5);
    log(`💵 You pulled off ${c.name} and got away with ${fmtMoney(haul)}!`,"money","Crime");
  }
  renderAll();
}
function goToPrison(years){ G.s.inPrison=true; G.s.prisonYears=years; G.s._wentToPrison=true; G.s.job=null; if(G.s.politics){ log(`You were removed from office as ${GAME.offices[G.s.politics.officeIndex].name}.`,"bad","Politics"); G.s.politics=null; } log(`⛓️ You were sentenced to ${years} year(s) in prison.`,"bad","Court"); changeStat("happiness",-20); changeStat("mental",-12); renderAll(); }

/* ============================================================
   POLITICS
   ============================================================ */
function processPolitics(){
  if(!G.s.politics) return;
  const o=GAME.offices[G.s.politics.officeIndex]; if(!o){ G.s.politics=null; return; }
  adjustMoney(o.salary);
  log(`🗳️ You earned ${fmtMoney(o.salary)} serving as ${o.name}.`,"money","Politics");
  G.s.politics.approval=clamp(G.s.politics.approval+rand(-4,4));
  G.s.politics.termLeft--;
  if(G.s.politics.termLeft<=0) askReElection(o);
}
function askReElection(o){
  askQuestion({icon:o.icon, title:"Term Ending", body:`Your term as ${o.name} is up (approval ${Math.round(G.s.politics.approval)}%). Run for re-election?`,
    choices:[
      {label:"Run for re-election", primary:true, fn:()=>runForOffice(G.s.politics.officeIndex, true)},
      {label:"Step down gracefully", fn:()=>{ log(`You stepped down as ${o.name}.`,"info","Politics"); G.s.politics=null; }},
    ]});
}
function loseOffice(){ if(G.s.politics){ const o=GAME.offices[G.s.politics.officeIndex]; log(`You are no longer ${o.name}.`,"bad","Politics"); G.s.politics=null; } }
function politicsCenter(){
  closePanel();
  let html="";
  if(G.s.politics){
    const o=GAME.offices[G.s.politics.officeIndex];
    html+=`<div class="section-head">Current Office</div>`;
    html+=rowHTML(o.icon, o.name, `Approval ${Math.round(G.s.politics.approval)}% · ${G.s.politics.termLeft}y left · ${G.s.politics.party}`, [{txt:"Resign", id:"resign"}]);
    const nextIdx=G.s.politics.officeIndex+1;
    html+=`<div class="section-head">Climb the Ladder</div>`;
    if(nextIdx<GAME.offices.length){ const n=GAME.offices[nextIdx]; const ok=G.s.age>=n.minAge; html+=rowHTML(n.icon,n.name,`Salary ${fmtMoney(Math.round(n.salary*G.s.wealthFactor))} · need age ${n.minAge}, fame ${n.fameReq}`, ok?[{txt:"Run", id:"run_"+nextIdx}]:[{txt:"Age "+n.minAge, sec:true}]); }
    else html+=`<p style="color:var(--text-dim)">You hold the highest office in the land. 👑</p>`;
  } else {
    html+=`<div class="section-head">Run for Office</div>`;
    html+=`<p style="color:var(--text-dim);font-size:13px">Elections reward fame, smarts, good karma and campaign cash. Everyone starts on the City Council.</p>`;
    GAME.offices.forEach((o,idx)=>{
      if(idx===0){ const ok=G.s.age>=o.minAge; html+=rowHTML(o.icon,o.name,`Entry office · salary ${fmtMoney(Math.round(o.salary*G.s.wealthFactor))}`, ok?[{txt:"Run", id:"run_0"}]:[{txt:"Age "+o.minAge, sec:true}]); }
      else html+=rowHTML(o.icon,o.name,`Win ${GAME.offices[idx-1].name} first`,[{txt:"Locked", sec:true}]);
    });
  }
  openPanel({icon:"ballot", title:"Politics", bodyHTML:html});
  wireRowActions(id=>{
    if(id==="resign"){ const o=GAME.offices[G.s.politics.officeIndex]; log(`You resigned as ${o.name}.`,"info","Politics"); G.s.politics=null; closePanel(); renderAll(); }
    else if(id.startsWith("run_")) runForOffice(parseInt(id.slice(4)), false);
  });
}
function runForOffice(idx, reelect){
  const o=GAME.offices[idx];
  if(G.s.age<o.minAge){ toast(`You must be ${o.minAge}+ for that office.`); return; }
  closePanel();
  askQuestion({icon:"podium", title:`Campaign for ${o.name}`, body:`How will you run your campaign?`,
    choices:[
      {label:"💰 Self-fund a big campaign", sub:"$20,000 · best odds", fn:()=>doElection(idx,reelect,"fund")},
      {label:"🤝 Grassroots campaign", sub:"Free · modest boost", fn:()=>doElection(idx,reelect,"grass")},
      {label:"🗡️ Smear your opponent", sub:"Karma down · risky", cls:"danger", fn:()=>doElection(idx,reelect,"smear")},
    ]});
}
function doElection(idx, reelect, style){
  const o=GAME.offices[idx];
  let score=0.3 + G.s.fame/200 + G.s.smarts/400 + (G.s.karma-50)/300 + G.s.looks/700 + ((G.s.skills&&G.s.skills.charisma)||0)/300;
  if(G.s.politics) score += (G.s.politics.approval-50)/200;
  score -= o.difficulty;
  if(style==="fund"){ if(G.s.money<20000){ log("You couldn't afford the campaign.","bad","Politics"); return; } adjustMoney(-20000); score+=0.18; }
  else if(style==="grass"){ score+=0.06; changeStat("happiness",-2); }
  else if(style==="smear"){ score+=0.13; changeStat("karma",-8); if(chance(0.25)){ score-=0.32; log("Your smear campaign backfired into a scandal!","bad","Politics"); } }
  score=Math.max(0.05,Math.min(0.95,score));
  if(chance(score)){
    G.s.politics={officeIndex:idx, approval:rand(52,68), party:(G.s.politics&&G.s.politics.party)||pick(GAME.parties), termLeft:o.term};
    log(`🎉 You WON the election for ${o.name}!`,"good","Politics"); changeStat("happiness",18); changeStat("fame",8+idx*4);
  } else {
    log(`You lost the election for ${o.name}.`,"bad","Politics"); changeStat("happiness",-12); changeStat("mental",-5);
    if(reelect) G.s.politics=null;
  }
  renderAll();
}

/* ============================================================
   EMIGRATION
   ============================================================ */
function processEmigration(){
  G.s.yearsInCountry=(G.s.yearsInCountry||0)+1;
  if(!G.s.citizenships.includes(G.s.country) && G.s.yearsInCountry>=5){
    G.s.citizenships.push(G.s.country);
    log(`🛂 After 5 years, you became a citizen of ${G.s.country}!`,"good","Citizenship");
    changeStat("happiness",8);
  }
}
function emigrate(){
  closePanel();
  let html=`<p style="color:var(--text-dim);font-size:13px">Home: <b>${G.s.country}</b> · Born: ${G.s.bornCountry} · Citizen of: ${G.s.citizenships.join(", ")}</p>`;
  html+=`<div class="section-head">Move Abroad</div>`;
  C().countries.forEach((c,idx)=>{
    if(c.name===G.s.country) return;
    const cost=Math.round(8000*c.wealth);
    const ql=c.wealth>=0.9?"High income":c.wealth>=0.6?"Mid income":"Developing";
    const isCit=G.s.citizenships.includes(c.name);
    html+=rowHTML("passport", c.name, `${ql} · move ~${fmtMoney(cost)}${isCit?" · citizen ✓":""}`, [{txt:"Move", id:"move_"+idx}]);
  });
  openPanel({icon:"passport", title:"Emigration", bodyHTML:html});
  wireRowActions(id=>{ if(id.startsWith("move_")) tryEmigrate(parseInt(id.slice(5))); });
}
function tryEmigrate(idx){
  const c=C().countries[idx]; if(!c) return; const cost=Math.round(8000*c.wealth);
  closePanel();
  askQuestion({icon:"passport", title:`Move to ${c.name}?`, body:`Relocating costs ${fmtMoney(cost)} and needs a visa (unless you're a citizen). Your current job won't move with you.`,
    choices:[
      {label:`Apply & move (${fmtMoney(cost)})`, primary:true, fn:()=>{
        if(G.s.money<cost){ log("You can't afford to relocate.","bad","Emigration"); return; }
        let p=G.s.citizenships.includes(c.name)?1 : Math.min(0.95, 0.4+G.s.smarts/300+G.s.edu*0.06+(G.s.money>50000?0.1:0));
        adjustMoney(-cost);
        if(chance(p)){
          G.s.country=c.name; G.s.wealthFactor=c.wealth; G.s.flag=c.flag; G.s.yearsInCountry=0; G.s.job=null; G.s.politics=null;
          log(`🛂 You emigrated to ${c.name}! A whole new chapter begins.`,"good","Emigration"); changeStat("happiness",10); changeStat("mental",-4);
        } else { log(`Your visa application for ${c.name} was denied.`,"bad","Emigration"); changeStat("happiness",-6); }
      }},
      {label:"Cancel"},
    ]});
}

/* ============================================================
   LEGAL
   ============================================================ */
function legalCenter(){
  closePanel();
  let html=`<p style="color:var(--text-dim);font-size:13px">Criminal record: ${G.s.criminalRecord.length} offense(s)${G.s.lawRetainer?" · lawyer on retainer ✓":""}</p>`;
  html+=`<div class="section-head">Civil Lawsuits</div>`;
  html+=rowHTML("gavel","Sue someone you know","Take a person to civil court",[{txt:"File", id:"sue_person"}]);
  html+=rowHTML("gavel","Sue a corporation","Long odds, big payout",[{txt:"File", id:"sue_corp"}]);
  html+=`<div class="section-head">Lawyers</div>`;
  if(!G.s.lawRetainer) html+=rowHTML("scales","Hire a lawyer on retainer","Better odds in future cases",[{txt:"$5,000", id:"retainer"}]);
  else html+=`<p style="color:var(--text-dim)">You have a lawyer on retainer.</p>`;
  openPanel({icon:"gavel", title:"Legal Center", bodyHTML:html});
  wireRowActions(id=>{
    if(id==="sue_person") suePerson();
    else if(id==="sue_corp") sueCorp();
    else if(id==="retainer"){ if(G.s.money<5000){toast("Can't afford it.");return;} adjustMoney(-5000); G.s.lawRetainer=true; log("⚖️ You hired a lawyer on retainer.","money","Legal"); closePanel(); renderAll(); }
  });
}
function suePerson(){
  closePanel();
  const list=G.s.people.filter(p=>p.alive);
  if(!list.length){ toast("You don't know anyone to sue."); return; }
  let html=`<p style="color:var(--text-dim)">Choose who to sue. (It will hurt your relationship.)</p>`;
  list.forEach(p=>{ html+=rowHTML(npcIcon(p), fullName(p), cap(p.relation), [{txt:"Sue", id:"st_"+p.id}]); });
  openPanel({icon:"gavel", title:"File a Lawsuit", bodyHTML:html});
  wireRowActions(id=>{ if(id.startsWith("st_")) resolveLawsuit(G.s.people.find(x=>x.id===id.slice(3))); });
}
function resolveLawsuit(target){
  closePanel(); if(!target) return;
  const fee=2000;
  if(G.s.money<fee){ toast("You can't afford the $2,000 filing fee."); return; }
  adjustMoney(-fee); target.relationship=clamp(target.relationship-25);
  let p=0.45+(G.s.lawRetainer?0.15:0)+G.s.smarts/600;
  if(chance(p)){ const award=rand(2000,20000); adjustMoney(award); log(`⚖️ You won your lawsuit against ${target.name} — awarded ${fmtMoney(award)}!`,"money","Court"); changeStat("happiness",5); }
  else { const dmg=rand(1000,5000); adjustMoney(-dmg); log(`You lost the suit against ${target.name} and paid ${fmtMoney(dmg)} in costs.`,"bad","Court"); changeStat("happiness",-5); }
  renderAll();
}
function sueCorp(){
  closePanel();
  const fee=4000;
  if(G.s.money<fee){ toast("You can't afford the $4,000 filing fee."); return; }
  adjustMoney(-fee);
  let p=0.3+(G.s.lawRetainer?0.18:0)+G.s.smarts/500;
  if(chance(p)){ const award=rand(10000,120000); adjustMoney(award); log(`⚖️ David beats Goliath! You won ${fmtMoney(award)} from the corporation!`,"money","Court"); changeStat("happiness",10); changeStat("fame",4); }
  else { log(`The corporation's lawyers crushed your case. Fees lost.`,"bad","Court"); changeStat("happiness",-6); }
  renderAll();
}

/* ============================================================
   MONEY EMPIRE — investments & businesses
   ============================================================ */
function initMarket(){
  if(!G.s) return;
  G.s.market = G.s.market || {prices:{}};
  [...(GAME.stocks||[]), ...(GAME.cryptos||[])].forEach(a=>{ if(G.s.market.prices[a.sym]==null) G.s.market.prices[a.sym]=a.base; });
}
function updateMarket(){
  if(!G.s.market) initMarket();
  [...(GAME.stocks||[]), ...(GAME.cryptos||[])].forEach(a=>{
    let pr=G.s.market.prices[a.sym]||a.base;
    pr=pr*(1+(Math.random()-0.47)*a.vol);
    G.s.market.prices[a.sym]=Math.max(a.base*0.04, pr);
  });
}
function stockValue(){ let v=0; for(const s in G.s.investments.stocks){ v+=(G.s.investments.stocks[s]||0)*(G.s.market.prices[s]||0); } return v; }
function cryptoValue(){ let v=0; for(const s in G.s.investments.crypto){ v+=(G.s.investments.crypto[s]||0)*(G.s.market.prices[s]||0); } return v; }
function processBusinesses(){
  (G.s.businesses||[]).forEach(b=>{
    const t=(GAME.businessTypes||[]).find(x=>x.id===b.id); if(!t) return;
    let profit=t.baseProfit*b.level*(0.6+Math.random());
    if(chance(t.risk*0.3)) profit=-Math.abs(profit*0.6);
    profit=Math.round(profit*G.s.wealthFactor);
    b.lastProfit=profit; adjustMoney(profit);
    b.value=Math.round(t.startup*b.level*0.8 + Math.max(0,profit)*2);
    log(`${b.name} ${profit>=0?"earned":"lost"} ${fmtMoney(Math.abs(profit))} this year.`, profit>=0?"money":"bad","Business");
  });
}
function processRentalIncome(){
  const homes=G.s.assets.filter(a=>a.type==="homes");
  if(homes.length>1){ let income=0; homes.slice(1).forEach(h=> income+=Math.round(h.value*0.06)); if(income>0){ adjustMoney(income); log(`🏠 Collected ${fmtMoney(income)} in rental income.`,"money","Rentals"); } }
}
function processFollowers(){
  if(G.s.fame>=40) G.s.followers=Math.round((G.s.followers||0)*1.04)+G.s.fame*40;
  else if(G.s.followers>0) G.s.followers=Math.round(G.s.followers*0.94);
}
function fmtFollowers(n){ n=n||0; if(n>=1e6) return (n/1e6).toFixed(1)+"M"; if(n>=1e3) return (n/1e3).toFixed(1)+"k"; return ""+Math.round(n); }

function financeCenter(){
  closePanel(); initMarket();
  let html=`<p style="color:var(--text-dim);font-size:12px">Cash ${fmtMoney(G.s.money)} · Stocks ${fmtMoney(stockValue())} · Crypto ${fmtMoney(cryptoValue())}</p>`;
  html+=rowHTML("chart","Stock Market","Buy & sell shares",[{txt:"Open", id:"stocks"}]);
  html+=rowHTML("crypto","Crypto Exchange","High risk, high reward",[{txt:"Open", id:"crypto"}]);
  html+=rowHTML("office","Businesses","Build a company empire",[{txt:"Open", id:"biz"}]);
  html+=rowHTML("house","Real Estate","Buy, rent & flip property",[{txt:"Open", id:"realestate"}]);
  openPanel({icon:"chart", title:"Finance", bodyHTML:html});
  wireRowActions(id=>{ if(id==="stocks")stockMarket(); else if(id==="crypto")cryptoMarket(); else if(id==="biz")businessCenter(); else if(id==="realestate")propertyMarket(); });
}
function stockMarket(){
  closePanel(); initMarket();
  let html=`<p style="color:var(--text-dim);font-size:12px">Cash ${fmtMoney(G.s.money)} · Portfolio ${fmtMoney(stockValue())} · Buys 10 shares / sells all</p>`;
  GAME.stocks.forEach(s=>{
    const price=G.s.market.prices[s.sym]; const sh=G.s.investments.stocks[s.sym]||0;
    html+=`<div class="list-row"><div class="lr-ico">${iconHTML("chart")}</div><div class="lr-main"><div class="lr-title">${s.sym} <span class="tag-pill">${fmtMoney(price)}</span></div><div class="lr-sub">${s.name}${sh?` · own ${sh} (${fmtMoney(sh*price)})`:""}</div></div><div style="display:flex;flex-direction:column;gap:4px"><button class="lr-action" data-act="sbuy_${s.sym}">Buy</button><button class="lr-action secondary" data-act="ssell_${s.sym}">Sell</button></div></div>`;
  });
  openPanel({icon:"chart", title:"Stock Market", bodyHTML:html});
  wireRowActions(id=>{ const i=id.indexOf("_"); const a=id.slice(0,i), sym=id.slice(i+1); if(a==="sbuy")buyStock(sym); else if(a==="ssell")sellStock(sym); });
}
function buyStock(sym){ const price=G.s.market.prices[sym]; if(G.s.money<price){ toast("Can't afford a share."); return; } let qty=10; if(G.s.money<price*qty) qty=Math.floor(G.s.money/price); adjustMoney(-price*qty); G.s.investments.stocks[sym]=(G.s.investments.stocks[sym]||0)+qty; log(`Bought ${qty} ${sym} @ ${fmtMoney(price)}.`,"money","Stocks"); stockMarket(); }
function sellStock(sym){ const sh=G.s.investments.stocks[sym]||0; if(!sh){ toast("You own none."); return; } const price=G.s.market.prices[sym]; adjustMoney(price*sh); G.s.investments.stocks[sym]=0; log(`Sold ${sh} ${sym} for ${fmtMoney(price*sh)}.`,"money","Stocks"); stockMarket(); }
function cryptoMarket(){
  closePanel(); initMarket();
  let html=`<p style="color:var(--text-dim);font-size:12px">Cash ${fmtMoney(G.s.money)} · Holdings ${fmtMoney(cryptoValue())} · Buys $1k / sells all</p>`;
  GAME.cryptos.forEach(s=>{
    const price=G.s.market.prices[s.sym]; const amt=G.s.investments.crypto[s.sym]||0;
    html+=`<div class="list-row"><div class="lr-ico">${iconHTML("crypto")}</div><div class="lr-main"><div class="lr-title">${s.sym} <span class="tag-pill">${fmtMoney(price)}</span></div><div class="lr-sub">${s.name}${amt?` · ${amt.toFixed(3)} (${fmtMoney(amt*price)})`:""}</div></div><div style="display:flex;flex-direction:column;gap:4px"><button class="lr-action" data-act="cbuy_${s.sym}">Buy</button><button class="lr-action secondary" data-act="csell_${s.sym}">Sell</button></div></div>`;
  });
  openPanel({icon:"crypto", title:"Crypto Exchange", bodyHTML:html});
  wireRowActions(id=>{ const i=id.indexOf("_"); const a=id.slice(0,i), sym=id.slice(i+1); if(a==="cbuy")buyCrypto(sym); else if(a==="csell")sellCrypto(sym); });
}
function buyCrypto(sym){ const price=G.s.market.prices[sym]; const spend=Math.min(1000,G.s.money); if(spend<price*0.001){ toast("Not enough cash."); return; } const units=spend/price; adjustMoney(-spend); G.s.investments.crypto[sym]=(G.s.investments.crypto[sym]||0)+units; log(`Bought ${units.toFixed(3)} ${sym} for ${fmtMoney(spend)}.`,"money","Crypto"); cryptoMarket(); }
function sellCrypto(sym){ const amt=G.s.investments.crypto[sym]||0; if(!amt){ toast("You hold none."); return; } const price=G.s.market.prices[sym]; adjustMoney(amt*price); G.s.investments.crypto[sym]=0; log(`Sold ${amt.toFixed(3)} ${sym} for ${fmtMoney(amt*price)}.`,"money","Crypto"); cryptoMarket(); }
function businessCenter(){
  closePanel();
  let html=`<p style="color:var(--text-dim);font-size:12px">Cash ${fmtMoney(G.s.money)}</p>`;
  if(G.s.businesses.length){ html+=`<div class="section-head">Your Businesses</div>`;
    G.s.businesses.forEach(b=>{ const t=GAME.businessTypes.find(x=>x.id===b.id);
      html+=`<div class="list-row"><div class="lr-ico">${iconHTML(t?t.icon:"office")}</div><div class="lr-main"><div class="lr-title">${b.name} <span class="tag-pill">Lv ${b.level}</span></div><div class="lr-sub">last yr ${fmtMoney(b.lastProfit||0)} · value ${fmtMoney(b.value)}</div></div><div style="display:flex;flex-direction:column;gap:4px"><button class="lr-action" data-act="binvest_${b.uid}">Grow</button><button class="lr-action secondary" data-act="bsell_${b.uid}">Sell</button></div></div>`; });
  }
  html+=`<div class="section-head">Start a Business</div>`;
  GAME.businessTypes.forEach(t=>{ html+=rowHTML(t.icon,t.name,`Startup ${fmtMoney(Math.round(t.startup*G.s.wealthFactor))} · ~${fmtMoney(Math.round(t.baseProfit*G.s.wealthFactor))}/yr`,[{txt:"Found", id:"found_"+t.id}]); });
  openPanel({icon:"office", title:"Businesses", bodyHTML:html});
  wireRowActions(id=>{ if(id.startsWith("found_"))foundBusiness(id.slice(6)); else if(id.startsWith("binvest_"))growBusiness(id.slice(8)); else if(id.startsWith("bsell_"))sellBusiness(id.slice(6)); });
}
function foundBusiness(typeId){
  const t=GAME.businessTypes.find(x=>x.id===typeId); if(!t) return; const cost=Math.round(t.startup*G.s.wealthFactor);
  if(G.s.money<cost){ toast("You can't afford the startup cost."); return; }
  adjustMoney(-cost);
  G.s.businesses.push({uid:"b"+Math.random().toString(36).slice(2,7), id:t.id, name:`${G.s.last} ${t.name}`, level:1, value:cost, lastProfit:0});
  log(`🏢 You founded ${G.s.last} ${t.name}!`,"money","Business"); changeStat("happiness",6);
  businessCenter();
}
function growBusiness(uid){
  const b=G.s.businesses.find(x=>x.uid===uid); if(!b) return; const t=GAME.businessTypes.find(x=>x.id===b.id);
  const cost=Math.round(t.startup*0.5*b.level*G.s.wealthFactor);
  if(G.s.money<cost){ toast(`Expansion costs ${fmtMoney(cost)}.`); return; }
  adjustMoney(-cost); b.level++; log(`📈 You expanded ${b.name} to level ${b.level}.`,"money","Business"); businessCenter();
}
function sellBusiness(uid){
  const i=G.s.businesses.findIndex(x=>x.uid===uid); if(i<0) return; const b=G.s.businesses[i];
  adjustMoney(b.value); log(`💰 You sold ${b.name} for ${fmtMoney(b.value)}.`,"money","Business"); G.s.businesses.splice(i,1); businessCenter();
}

/* ============================================================
   FAME & CELEBRITY
   ============================================================ */
function fameHub(){
  closePanel();
  let html=`<p style="color:var(--text-dim)">Fame ${Math.round(G.s.fame)}% · Followers ${fmtFollowers(G.s.followers)}</p>`;
  html+=`<div class="section-head">Build Your Brand</div>`;
  html+=rowHTML("phone","Post Content","Grow followers & fame",[{txt:"Post", id:"fpost"}]);
  html+=rowHTML("camera","Photo Shoot","Polish your image",[{txt:"$500", id:"fshoot"}]);
  html+=rowHTML("mic","Pitch a Project","Big swing for stardom",[{txt:"Pitch", id:"fproject"}]);
  html+=rowHTML("crypto","Buy Followers","Sketchy shortcut",[{txt:"$2k", id:"fbuy"}]);
  openPanel({icon:"star", title:"Fame & Media", bodyHTML:html});
  wireRowActions(handleFameAction);
}
function handleFameAction(id){
  if(id==="fpost"){
    if(chance(0.4)){ const f=rand(2,5); changeStat("fame",f); G.s.followers+=rand(500,4000)+G.s.fame*100; log(`📱 Your post popped off — +${f} fame!`,"good","Fame"); }
    else { changeStat("fame",1); G.s.followers+=rand(50,500); log("📱 You posted. Modest engagement.","info","Fame"); }
    closePanel(); renderAll();
  } else if(id==="fshoot"){
    if(G.s.money<500){ toast("Can't afford it."); return; } adjustMoney(-500); changeStat("looks",rand(2,5)); changeStat("fame",rand(1,3)); G.s.followers+=rand(500,3000); log("📸 A glossy photo shoot boosted your image.","good","Fame"); closePanel(); renderAll();
  } else if(id==="fproject"){
    closePanel();
    askQuestion({icon:"mic", title:"Pitch a Project", body:"You pour yourself into a passion project — an album, film, app, or book.", choices:[
      {label:"Go all in", primary:true, fn:()=>{ if(chance(0.45)){ const f=rand(8,16); changeStat("fame",f); G.s.followers+=rand(20000,120000); adjustMoney(rand(5000,40000)); log(`🌟 Your project was a hit! +${f} fame and big money.`,"good","Fame"); changeStat("happiness",10); } else { changeStat("fame",-2); changeStat("mental",-4); log("🌟 Your project flopped. Back to the drawing board.","bad","Fame"); } }},
      {label:"Maybe later"},
    ]});
  } else if(id==="fbuy"){
    if(G.s.money<2000){ toast("Can't afford it."); return; } adjustMoney(-2000); G.s.followers+=rand(20000,80000);
    if(chance(0.3)){ changeStat("fame",-5); G.s.followers=Math.round(G.s.followers*0.5); log("📉 You got caught buying fake followers. Embarrassing!","bad","Fame"); }
    else log("🤫 You quietly padded your follower count.","info","Fame");
    closePanel(); renderAll();
  }
}

/* ============================================================
   HEALTH DEEP-DIVE — hospital, specialists, rehab, surgery
   ============================================================ */
function hospital(){
  closePanel();
  let html=`<p style="color:var(--text-dim)">Health ${Math.round(G.s.health)}% · Fitness ${Math.round(G.s.fitness)}% · Mental ${Math.round(G.s.mental)}%</p>`;
  if(G.s.conditions.length){ html+=`<div class="section-head">Conditions</div>`; G.s.conditions.forEach((c,i)=> html+=rowHTML(c.kind==="mental"?"brain":"capsule", c.name, c.kind==="mental"?"Mental health":"Physical", [{txt:"Treat", id:"treat_"+i}])); }
  if(G.s.addictions.length){ html+=`<div class="section-head">Addictions</div>`; G.s.addictions.forEach((a,i)=> html+=rowHTML("warning","Addicted to "+a,"Recovery is possible",[{txt:"Rehab", id:"rehab_"+i}])); }
  html+=`<div class="section-head">Services</div>`;
  html+=rowHTML("cross","Full Check-up","Catch problems early",[{txt:"$300", id:"checkup"}]);
  html+=rowHTML("capsule","See a Specialist","Best shot at a cure",[{txt:"$800", id:"specialist"}]);
  html+=rowHTML("medical","Surgery","Big health restore (risky)",[{txt:"Consult", id:"surg"}]);
  html+=rowHTML("brain","Therapy Session","Boost mental health",[{txt:"$200", id:"thp"}]);
  openPanel({icon:"cross", title:"Hospital", bodyHTML:html});
  wireRowActions(handleHospitalAction);
}
function handleHospitalAction(id){
  if(id.startsWith("treat_")){ const i=parseInt(id.slice(6)); const c=G.s.conditions[i]; if(!c)return; const cost=Math.round(400*G.s.wealthFactor); if(G.s.money<cost){toast("Can't afford treatment.");return;} adjustMoney(-cost); if(chance(0.65)){ G.s.conditions.splice(i,1); changeStat(c.kind==="mental"?"mental":"health",10); log(`You were treated for ${c.name}.`,"good","Health"); } else log(`Treatment for ${c.name} didn't fully work.`,"info","Health"); hospital(); }
  else if(id.startsWith("rehab_")){ const i=parseInt(id.slice(6)); const a=G.s.addictions[i]; if(!a)return; const cost=Math.round(3000*G.s.wealthFactor); if(G.s.money<cost){toast("Rehab costs "+fmtMoney(cost));return;} adjustMoney(-cost); if(chance(0.6)){ G.s.addictions.splice(i,1); changeStat("health",8); changeStat("mental",6); log(`🎉 You beat your ${a} addiction!`,"good","Recovery"); } else { changeStat("mental",-3); log(`Rehab for ${a} didn't stick this time.`,"bad","Recovery"); } hospital(); }
  else if(id==="checkup"){ const cost=Math.round(300*G.s.wealthFactor); if(G.s.money<cost){toast("Can't afford it.");return;} adjustMoney(-cost); if(G.s.health<60 && chance(0.5)){ addRandomCondition(); log("🩺 The check-up caught a developing condition.","info","Health"); } else { changeStat("health",rand(2,5)); log("🩺 Check-up complete — you're in good shape.","good","Health"); } hospital(); }
  else if(id==="specialist"){ const cost=Math.round(800*G.s.wealthFactor); if(G.s.money<cost){toast("Can't afford it.");return;} adjustMoney(-cost); if(G.s.conditions.length){ const c=G.s.conditions[0]; if(chance(0.85)){ G.s.conditions.shift(); changeStat(c.kind==="mental"?"mental":"health",14); log(`The specialist cured your ${c.name}!`,"good","Health"); } else log("Even the specialist couldn't fix it yet.","info","Health"); } else { changeStat("health",4); log("Nothing to treat — the specialist gave you tips.","good","Health"); } hospital(); }
  else if(id==="surg"){ closePanel(); const cost=Math.round(12000*G.s.wealthFactor); askQuestion({icon:"medical", title:"Major Surgery", body:`A major procedure could restore your health for ${fmtMoney(cost)} — but surgery is risky.`, choices:[
      {label:`Proceed (${fmtMoney(cost)})`, primary:true, fn:()=>{ if(G.s.money<cost){log("You can't afford surgery.","bad","Health");return;} adjustMoney(-cost); if(chance(0.8)){ changeStat("health",rand(20,35)); G.s.conditions=G.s.conditions.filter(c=>c.kind==="mental"); log("🏥 The surgery was a success!","good","Health"); } else { changeStat("health",-rand(15,30)); log("🏥 Complications during surgery. Rough recovery.","bad","Health"); } }},
      {label:"Cancel"},
    ]}); }
  else if(id==="thp"){ const cost=Math.round(200*G.s.wealthFactor); if(G.s.money<cost){toast("Can't afford it.");return;} adjustMoney(-cost); changeStat("mental",rand(6,14)); changeStat("happiness",rand(2,6)); const mc=G.s.conditions.find(c=>c.kind==="mental"); if(mc&&chance(0.5)){ G.s.conditions=G.s.conditions.filter(c=>c!==mc); log(`Therapy helped you overcome ${mc.name}.`,"good","Mental"); } else log("A productive therapy session.","good","Mental"); hospital(); }
}

/* ============================================================
   SKILLS
   ============================================================ */
function skillsPanel(){
  closePanel();
  let html=`<p style="color:var(--text-dim);font-size:13px">Practice is free (costs energy); lessons cost money but teach faster.</p>`;
  (GAME.skills||[]).forEach(sk=>{
    const lvl=Math.round((G.s.skills[sk.id]||0));
    html+=`<div class="list-row"><div class="lr-ico">${iconHTML(sk.icon)}</div><div class="lr-main"><div class="lr-title">${sk.name} <span class="tag-pill">${lvl}</span></div><div class="lr-sub">${sk.desc}</div><div class="mini-bar"><div style="width:${lvl}%;background:${statColor(lvl)}"></div></div></div><div style="display:flex;flex-direction:column;gap:4px"><button class="lr-action" data-act="prac_${sk.id}">Practice</button><button class="lr-action secondary" data-act="less_${sk.id}">Lessons</button></div></div>`;
  });
  openPanel({icon:"scroll", title:"Skills", bodyHTML:html});
  wireRowActions(id=>{ const i=id.indexOf("_"); const a=id.slice(0,i), sid=id.slice(i+1); if(a==="prac")practiceSkill(sid); else if(a==="less")takeLessons(sid); });
}
function practiceSkill(id){ const cur=G.s.skills[id]||0; const gain=Math.max(1,Math.round(rand(2,6)*(1-cur/120))); G.s.skills[id]=clamp(cur+gain); changeStat("happiness",-1); toast(`${skillDef(id).name} +${gain}`); skillsPanel(); }
function takeLessons(id){ const cost=Math.round(300*G.s.wealthFactor); if(G.s.money<cost){ toast(`Lessons cost ${fmtMoney(cost)}.`); return; } adjustMoney(-cost); const cur=G.s.skills[id]||0; const gain=Math.max(2,Math.round(rand(5,10)*(1-cur/130))); G.s.skills[id]=clamp(cur+gain); log(`You took ${skillDef(id).name} lessons (+${gain}).`,"money","Skills"); skillsPanel(); }

/* ============================================================
   ACHIEVEMENTS
   ============================================================ */
function checkAchievements(){
  if(!G.s||!G.s.achievements) return;
  (GAME.achievements||[]).forEach(a=>{
    if(G.s.achievements.includes(a.id)) return;
    let ok=false; try{ ok=a.test(G.s); }catch(e){}
    if(ok){ G.s.achievements.push(a.id); toast("Achievement: "+a.name); log(`🏆 Achievement unlocked: ${a.name} — ${a.desc}`, "good", "Achievement"); }
  });
}

/* ============================================================
   DYNASTY / HALL OF FAME (persists across lives)
   ============================================================ */
const HOF_KEY="lifeforge_hof";
function getHOF(){ try{ return JSON.parse(localStorage.getItem(HOF_KEY))||{lives:[],dynastyWealth:0}; }catch(e){ return {lives:[],dynastyWealth:0}; } }
function saveHOF(h){ try{ localStorage.setItem(HOF_KEY, JSON.stringify(h)); }catch(e){} }
function recordLife(){
  const h=getHOF(); const net=G.s.money+G.s.assets.reduce((s,a)=>s+a.value,0);
  h.lives.unshift({name:fullName(G.s), age:G.s.age, gen:G.s.generation||1, net, fame:Math.round(G.s.fame), cause:G.s.causeOfDeath||"—", ach:(G.s.achievements||[]).length});
  if(h.lives.length>50) h.lives.pop();
  h.dynastyWealth=(h.dynastyWealth||0)+Math.max(0,net);
  saveHOF(h);
}
function hallOfFamePanel(){
  const h=getHOF();
  let html=`<p style="color:var(--text-dim)">Total dynasty wealth across all lives: <b style="color:var(--accent)">${fmtMoney(h.dynastyWealth||0)}</b></p>`;
  if(!h.lives.length){ html+=`<p style="color:var(--text-dim);margin-top:10px">No lives recorded yet. Go live one!</p>`; }
  else { html+=`<div class="section-head">Past Lives</div>`;
    h.lives.forEach(L=>{ html+=`<div class="list-row"><div class="lr-ico">${iconHTML("crest")}</div><div class="lr-main"><div class="lr-title">${L.name} <span class="tag-pill">Gen ${L.gen}</span></div><div class="lr-sub">Lived to ${L.age} · ${L.cause} · net ${fmtMoney(L.net)} · ${L.ach} 🏆</div></div></div>`; });
  }
  openPanel({icon:"crest", title:"Hall of Fame", bodyHTML:html, choices:[{label:"Close", primary:true, fn:closePanel}]});
}

/* ============================================================
   CHARACTER BIO PAGE
   ============================================================ */
function bioPage(){
  if(!G.s) return; closePanel();
  const traits=(G.s.traits||[]).map(t=>`<span class="tag-pill green">${traitName(t)}</span>`).join(" ");
  let html=`<p style="text-align:center;color:var(--text-dim)">${cap(G.s.gender)} · ${G.s.age} yrs · ${G.s.country}${(G.s.generation||1)>1?` · Gen ${G.s.generation}`:""}</p>`;
  html+=`<div style="text-align:center;margin:8px 0">${traits||'<span class="tag-pill">no traits</span>'}</div>`;
  html+=`<div class="section-head">Status</div>`;
  let status="Unemployed";
  if(G.s.inPrison) status=`Inmate (${G.s.prisonYears}y left)`;
  else if(G.s.military) status=`${GAME.militaryRanks[G.s.military.rankIndex]}, ${branchName()}`;
  else if(G.s.job) status=currentJobTitle();
  else if(G.s.inSchool) status=schoolName();
  html+=`<p>${status}${G.s.politics?` · ${GAME.offices[G.s.politics.officeIndex].name}`:""}${G.s.mafia?` · ${GAME.mafiaRanks[G.s.mafia.rankIndex]} (mafia)`:""}</p>`;
  const net=G.s.money+G.s.assets.reduce((s,a)=>s+a.value,0)+stockValue()+cryptoValue();
  html+=`<p>Net worth: <b>${fmtMoney(net)}</b> · Fame ${Math.round(G.s.fame)} · Followers ${fmtFollowers(G.s.followers)}</p>`;
  html+=`<p>Family: ${G.s.people.filter(p=>p.alive).length} living · Crimes: ${(G.s.criminalRecord||[]).length} · Visited ${(G.s.travels||[]).length} place(s)</p>`;
  if(G.s.appearance) html+=`<p>Look: ${G.s.appearance.hair} hair · ${G.s.appearance.build} build${G.s.supernatural?` · <b style="color:var(--red)">${cap(G.s.supernatural.type)}</b>`:""}</p>`;
  const zz=zodiacDef(G.s.zodiac); const fd=faithDisplay();
  html+=`<p>${zz?`${zz.symbol} ${zz.name}`:""}${fd?` · ${fd.name}`:" · Secular"}</p>`;
  html+=`<div class="section-head">Top Skills</div>`;
  const top=(GAME.skills||[]).map(s=>({s,lvl:G.s.skills[s.id]||0})).sort((a,b)=>b.lvl-a.lvl).slice(0,5);
  top.forEach(({s,lvl})=>{ html+=`<div style="display:flex;align-items:center;gap:8px;margin:4px 0"><span style="width:18px">${iconHTML(s.icon)}</span><span style="width:80px;font-size:13px">${s.name}</span><div class="mini-bar" style="flex:1"><div style="width:${Math.round(lvl)}%;background:${statColor(lvl)}"></div></div><span style="font-size:12px;color:var(--text-dim);width:26px;text-align:right">${Math.round(lvl)}</span></div>`; });
  const unlocked=(G.s.achievements||[]);
  html+=`<div class="section-head">Achievements (${unlocked.length}/${(GAME.achievements||[]).length})</div>`;
  if(unlocked.length){ html+=`<div>`+unlocked.map(id=>{ const a=GAME.achievements.find(x=>x.id===id); return a?`<span class="tag-pill green">${a.name}</span> `:""; }).join("")+`</div>`; }
  else html+=`<p style="color:var(--text-dim)">None yet.</p>`;
  openPanel({icon:"scroll", title:fullName(G.s), bodyHTML:html});
}

/* ============================================================
   MILITARY
   ============================================================ */
function branchName(){ const b=(GAME.militaryBranches||[]).find(x=>x.id===(G.s.military&&G.s.military.branch)); return b?b.name:"Military"; }
function processMilitary(){
  if(!G.s.military) return;
  const pay=Math.round(GAME.militaryBasePay*(1+G.s.military.rankIndex*0.35)*G.s.wealthFactor);
  adjustMoney(pay); G.s.military.years++;
  log(`🎖️ You earned ${fmtMoney(pay)} serving in the ${branchName()}.`,"money","Military");
  if(G.s.military.rankIndex<GAME.militaryRanks.length-1 && G.s.fitness>48 && chance(0.3)){
    G.s.military.rankIndex++; log(`🎖️ Promoted to ${GAME.militaryRanks[G.s.military.rankIndex]}!`,"good","Military"); changeStat("happiness",6);
  }
}
function enlist(){
  closePanel();
  if(G.s.age<18){ toast("You must be 18 to enlist."); return; }
  askQuestion({icon:"medal", title:"Enlist", body:"Choose a branch to serve in. Military pay rises with rank, but deployments are dangerous.",
    choices:(GAME.militaryBranches||[]).map(b=>({label:b.name, fn:()=>{ G.s.military={branch:b.id, rankIndex:0, years:0}; G.s._wasMilitary=true; G.s.job=null; log(`🎖️ You enlisted in the ${b.name}!`,"good","Military"); changeStat("happiness",6); changeStat("fitness",4); }})).concat([{label:"Cancel"}])});
}
function dischargeMilitary(){
  closePanel();
  askQuestion({icon:"medal", title:"Leave the Service", body:`Discharge from the ${branchName()} as ${GAME.militaryRanks[G.s.military.rankIndex]}?`,
    choices:[{label:"Discharge", primary:true, fn:()=>{ log(`You were honorably discharged from the ${branchName()}.`,"info","Military"); G.s.military=null; }},{label:"Keep serving"}]});
}

/* ============================================================
   MAFIA
   ============================================================ */
function joinMafia(){
  closePanel();
  G.s.mafia={rankIndex:0, respect:0}; G.s._wasMafia=true;
  log("🕴️ You were brought into the family as an Associate.","info","Mafia"); changeStat("notoriety",5);
  renderAll();
}
function mafiaCenter(){
  closePanel();
  let html=`<p style="color:var(--text-dim)">Rank: <b>${GAME.mafiaRanks[G.s.mafia.rankIndex]}</b> · Respect ${G.s.mafia.respect} · Notoriety ${G.s.notoriety}</p>`;
  const nextNeed=(G.s.mafia.rankIndex+1)*25;
  if(G.s.mafia.rankIndex<GAME.mafiaRanks.length-1) html+=`<p style="color:var(--text-dim);font-size:12px">${nextNeed} respect to become ${GAME.mafiaRanks[G.s.mafia.rankIndex+1]}.</p>`;
  html+=`<div class="section-head">Jobs</div>`;
  GAME.mafiaJobs.forEach((j,i)=>{ html+=rowHTML(j.icon, j.name, `${fmtMoney(j.reward[0])}–${fmtMoney(j.reward[1])} · ${Math.round(j.risk*100)}% risk · +${j.respect} respect`, [{txt:"Do it", id:"mjob_"+i}]); });
  if(G.s.mafia.rankIndex<GAME.mafiaRanks.length-1 && G.s.mafia.respect>=nextNeed){ html+=`<div class="section-head">Advancement</div>`; html+=rowHTML("fedora","Get Made","Rise to "+GAME.mafiaRanks[G.s.mafia.rankIndex+1],[{txt:"Promote", id:"mrise"}]); }
  openPanel({icon:"fedora", title:"The Family", bodyHTML:html, choices:[{label:"Back", primary:true, fn:closePanel}]});
  wireRowActions(id=>{ if(id.startsWith("mjob_")) doMafiaJob(GAME.mafiaJobs[parseInt(id.slice(5))]); else if(id==="mrise") riseMafia(); });
}
function doMafiaJob(j){
  closePanel(); G.s.stats_lifetime.crimes++;
  let risk=j.risk - G.s.smarts/700 - ((G.s.skills&&G.s.skills.fighting)||0)/600;
  if(chance(risk)){
    if(chance(0.5)){ log(`🚨 The ${j.name} went bad — the cops got you!`,"bad","Mafia"); G.s.criminalRecord.push({crime:j.name,age:G.s.age}); goToPrison(Math.max(1,Math.round(j.respect/4))); }
    else { log(`A ${j.name} turned violent — you barely escaped.`,"bad","Mafia"); changeStat("health",-rand(12,25)); addRandomCondition(); }
    changeStat("karma", j.karma);
  } else {
    const haul=rand(j.reward[0],j.reward[1]); adjustMoney(haul); G.s.mafia.respect+=j.respect; G.s.notoriety+=Math.round(j.respect/2); changeStat("karma", j.karma);
    log(`🕴️ You pulled off the ${j.name} — ${fmtMoney(haul)} and +${j.respect} respect.`,"money","Mafia");
  }
  renderAll();
}
function riseMafia(){
  closePanel(); const need=(G.s.mafia.rankIndex+1)*25;
  if(G.s.mafia.respect<need){ toast("Not enough respect yet."); return; }
  G.s.mafia.rankIndex++; log(`🕴️ You've been made — you're now a ${GAME.mafiaRanks[G.s.mafia.rankIndex]}!`,"good","Mafia"); changeStat("happiness",10); changeStat("notoriety",10);
  renderAll();
}

/* ============================================================
   RIVALS (extended family handled at birth / via events)
   ============================================================ */
function spawnRival(){ const r=makeNPC("rival", pick(C().surnames)); r.age=clamp(G.s.age+rand(-3,3),6,80); r.relationship=rand(10,30); G.s.people.push(r); }

/* ============================================================
   REAL-ESTATE EMPIRE
   ============================================================ */
function processRealEstate(){
  let rent=0; (G.s.properties||[]).forEach(pr=>{ pr.value=Math.round(pr.value*(1+(Math.random()-0.45)*0.12)); rent+=pr.rent; });
  if(rent>0){ adjustMoney(rent); log(`🏘️ Earned ${fmtMoney(rent)} from your property portfolio.`,"money","Real Estate"); }
}
function propertyMarket(){
  closePanel();
  let html=`<p style="color:var(--text-dim);font-size:12px">Cash ${fmtMoney(G.s.money)} · ${G.s.properties.length} propertie(s) — values shift yearly, flip for profit</p>`;
  if(G.s.properties.length){ html+=`<div class="section-head">Your Portfolio</div>`;
    G.s.properties.forEach(pr=>{ html+=`<div class="list-row"><div class="lr-ico">${iconHTML("house")}</div><div class="lr-main"><div class="lr-title">${pr.name}</div><div class="lr-sub">value ${fmtMoney(pr.value)} · rent ${fmtMoney(pr.rent)}/yr</div></div><button class="lr-action secondary" data-act="psell_${pr.uid}">Sell</button></div>`; });
  }
  const types=["Downtown Apartment","Suburban Duplex","Beach Cottage","Commercial Unit","Warehouse","Office Suite","Lakeside Cabin"];
  const listings=[]; for(let i=0;i<5;i++){ const v=rand(40000,500000); listings.push({name:pick(types), value:Math.round(v*G.s.wealthFactor), rent:Math.round(v*0.06*G.s.wealthFactor)}); }
  window._propListings=listings;
  html+=`<div class="section-head">On the Market</div>`;
  listings.forEach((L,i)=>{ html+=rowHTML("house", L.name, `${fmtMoney(L.value)} · rent ${fmtMoney(L.rent)}/yr`, [{txt:"Buy", id:"pbuy_"+i}]); });
  openPanel({icon:"office", title:"Real Estate", bodyHTML:html});
  wireRowActions(id=>{ if(id.startsWith("pbuy_")) buyProperty(parseInt(id.slice(5))); else if(id.startsWith("psell_")) sellProperty(id.slice(6)); });
}
function buyProperty(i){ const L=window._propListings&&window._propListings[i]; if(!L) return; if(G.s.money<L.value){ toast("Can't afford it."); return; } adjustMoney(-L.value); G.s.properties.push({uid:"r"+Math.random().toString(36).slice(2,7), name:L.name, value:L.value, rent:L.rent}); log(`🏘️ Bought a ${L.name} for ${fmtMoney(L.value)}.`,"money","Real Estate"); propertyMarket(); }
function sellProperty(uid){ const idx=G.s.properties.findIndex(x=>x.uid===uid); if(idx<0) return; const pr=G.s.properties[idx]; adjustMoney(pr.value); log(`🏘️ Sold ${pr.name} for ${fmtMoney(pr.value)}.`,"money","Real Estate"); G.s.properties.splice(idx,1); propertyMarket(); }

/* ============================================================
   CAREER SPOTLIGHTS (sports / music / acting / model / influencer)
   ============================================================ */
function spotlightCareer(){ return G.s.job && CAREERS().find(c=>c.id===G.s.job.careerId && c.fame); }
function spotlightActions(cid){
  if(cid==="musician") return [{id:"song",icon:"music",label:"Write a Song",sub:"Quick release",btn:"Write"},{id:"album",icon:"music",label:"Record an Album",sub:"Big project",btn:"Record"},{id:"tour",icon:"mic",label:"Go on Tour",sub:"Money & fame",btn:"Tour"}];
  if(cid==="actor") return [{id:"audition",icon:"drama",label:"Audition for a Role",sub:"Land a part",btn:"Audition"},{id:"film",icon:"drama",label:"Star in a Film",sub:"Your big break",btn:"Star"}];
  if(cid==="athlete") return [{id:"train",icon:"dumbbell",label:"Train Hard",sub:"Boost fitness",btn:"Train"},{id:"season",icon:"ball",label:"Play the Season",sub:"Glory or injury",btn:"Play"}];
  if(cid==="model") return [{id:"runway",icon:"star",label:"Walk a Runway",sub:"Strut your stuff",btn:"Walk"},{id:"cover",icon:"camera",label:"Magazine Cover",sub:"Big exposure",btn:"Shoot"}];
  if(cid==="influencer") return [{id:"series",icon:"camera",label:"Launch a Series",sub:"Grow your channel",btn:"Launch"},{id:"collab",icon:"people",label:"Collab",sub:"Cross-promote",btn:"Collab"}];
  return [{id:"work",icon:"star",label:"Create Something",sub:"Try your craft",btn:"Go"}];
}
function spotlightPanel(){
  closePanel(); const c=spotlightCareer(); if(!c){ toast("You need a creative/fame career first."); return; }
  let html=`<p style="color:var(--text-dim)">${c.name} · Fame ${Math.round(G.s.fame)} · Followers ${fmtFollowers(G.s.followers)}</p><div class="section-head">Create & Perform</div>`;
  spotlightActions(c.id).forEach(a=> html+=rowHTML(a.icon,a.label,a.sub,[{txt:a.btn,id:"sp_"+a.id}]));
  openPanel({icon:"star", title:c.name+" Spotlight", bodyHTML:html});
  wireRowActions(id=>{ if(id.startsWith("sp_")) doSpotlight(id.slice(3)); });
}
function doSpotlight(id){
  closePanel(); const sk=G.s.skills||{};
  const hit=(base)=> chance(Math.min(0.85, base + ((sk.music||0)+(sk.art||0)+(sk.writing||0)+(sk.charisma||0)+(sk.fashion||0)+(sk.athletics||0))/2000));
  switch(id){
    case "song": if(hit(0.4)){ const f=rand(3,8); changeStat("fame",f); G.s.followers+=rand(2000,20000); adjustMoney(rand(1000,8000)); log(`🎵 Your new song is a hit! +${f} fame.`,"good","Spotlight"); } else { changeStat("fame",1); log("🎵 You released a song. Modest reception.","info","Spotlight"); } break;
    case "album": if(hit(0.4)){ const f=rand(8,16); changeStat("fame",f); G.s.followers+=rand(20000,150000); adjustMoney(rand(10000,80000)); changeStat("happiness",8); log(`🎵 Your album went platinum! +${f} fame.`,"good","Spotlight"); } else { changeStat("fame",-1); log("🎵 The album flopped.","bad","Spotlight"); } break;
    case "tour": adjustMoney(rand(5000,40000)); changeStat("fame",rand(3,7)); changeStat("health",-3); log("🎤 You toured the country — exhausting but lucrative.","money","Spotlight"); break;
    case "audition": if(hit(0.45)){ changeStat("fame",rand(2,5)); adjustMoney(rand(2000,15000)); log("🎬 You landed the role!","good","Spotlight"); } else log("🎬 You didn't get the part.","bad","Spotlight"); break;
    case "film": if(hit(0.4)){ const f=rand(8,18); changeStat("fame",f); adjustMoney(rand(20000,200000)); changeStat("happiness",8); log(`🎬 Your film was a blockbuster! +${f} fame.`,"good","Spotlight"); if(chance(0.3)){ changeStat("fame",6); log("🏆 You won an acting award!","good","Spotlight"); } } else { changeStat("fame",-2); log("🎬 The film bombed.","bad","Spotlight"); } break;
    case "train": changeStat("fitness",rand(5,10)); changeStat("health",2); log("🏋️ Intense training paid off.","good","Spotlight"); break;
    case "season": if(hit(0.45)){ const f=rand(5,12); changeStat("fame",f); adjustMoney(rand(20000,150000)); log(`⚽ A championship season! +${f} fame.`,"good","Spotlight"); } else { if(chance(0.3)){ changeStat("health",-15); addRandomCondition(); log("⚽ You suffered a season-ending injury.","bad","Spotlight"); } else log("⚽ An average season.","info","Spotlight"); } break;
    case "runway": changeStat("fame",rand(2,6)); changeStat("looks",2); adjustMoney(rand(3000,20000)); log("💃 You owned the runway.","good","Spotlight"); break;
    case "cover": if(hit(0.4)){ changeStat("fame",rand(5,12)); G.s.followers+=rand(10000,80000); adjustMoney(rand(5000,40000)); log("📸 You landed a magazine cover!","good","Spotlight"); } else log("📸 The shoot didn't make the cut.","info","Spotlight"); break;
    case "series": changeStat("fame",rand(2,6)); G.s.followers+=rand(5000,60000); log("📹 Your new series is gaining traction.","good","Spotlight"); break;
    case "collab": changeStat("fame",rand(1,4)); G.s.followers+=rand(3000,40000); log("🤝 A collab boosted you both.","good","Spotlight"); break;
    default: changeStat("fame",2); log("You worked on your craft.","info","Spotlight");
  }
  renderAll();
}

/* ============================================================
   TRAVEL
   ============================================================ */
function travelPanel(){
  closePanel();
  let html=`<p style="color:var(--text-dim);font-size:12px">Cash ${fmtMoney(G.s.money)} · Visited ${G.s.travels.length} place(s)</p>`;
  (GAME.destinations||[]).forEach(d=>{ const cost=Math.round(d.cost*G.s.wealthFactor); const been=G.s.travels.includes(d.id); html+=rowHTML(d.icon, d.name, `${d.vibe} · ${fmtMoney(cost)}${been?" · visited":""}`, [{txt:"Travel", id:"trv_"+d.id}]); });
  openPanel({icon:"suitcase", title:"Travel the World", bodyHTML:html});
  wireRowActions(id=>{ if(id.startsWith("trv_")) doTravel(id.slice(4)); });
}
function doTravel(id){
  const d=(GAME.destinations||[]).find(x=>x.id===id); if(!d) return; const cost=Math.round(d.cost*G.s.wealthFactor);
  closePanel();
  if(G.s.money<cost){ toast("Can't afford this trip."); return; }
  adjustMoney(-cost); if(!G.s.travels.includes(id)) G.s.travels.push(id);
  changeStat("happiness",rand(8,16)); changeStat("mental",rand(4,10));
  const r=Math.random();
  if(r<0.15){ changeStat("happiness",-6); addRandomCondition(); log(`✈️ You fell ill on your trip to ${d.name}.`,"bad","Travel"); }
  else if(r<0.3){ changeStat("happiness",-4); log(`✈️ Your luggage got lost in ${d.name}, but you made the best of it.`,"info","Travel"); }
  else if(r<0.45 && !G.s.people.some(p=>p.alive&&(p.relation==="lover"||p.relation==="spouse"))){ spawnLover(); log(`✈️ You had a whirlwind holiday romance in ${d.name}!`,"good","Travel"); }
  else log(`✈️ You had an amazing trip to ${d.name} — ${d.vibe}.`,"good","Travel");
  renderAll();
}

/* ============================================================
   SUPERNATURAL
   ============================================================ */
function seekOccult(){
  closePanel();
  askQuestion({icon:"moon", title:"Seek the Occult", body:"You delve into forbidden rituals and old legends. Dark forces may answer — or change you forever.",
    choices:[
      {label:"Embrace the unknown", primary:true, fn:()=>{ const r=Math.random(); if(r<0.25){ G.s.supernatural={type:"vampire"}; log("🦇 You have become a VAMPIRE. The night is yours.","bad","Supernatural"); changeStat("health",10); changeStat("looks",6); } else if(r<0.45){ G.s.supernatural={type:"werewolf"}; log("🐺 Bitten under the full moon — you are now a WEREWOLF.","bad","Supernatural"); changeStat("fitness",10); } else { changeStat("mental",-4); log("Nothing happened... or did it? You feel uneasy.","info","Supernatural"); } }},
      {label:"Back away slowly", fn:()=>{}},
    ]});
}
function supernaturalPanel(){
  closePanel(); const t=G.s.supernatural.type;
  let html=`<p style="color:var(--text-dim)">You are a ${t}. ${t==="vampire"?"You barely age at all.":"The moon calls to you."}</p><div class="section-head">Powers</div>`;
  if(t==="vampire"){
    html+=rowHTML("fang","Feed","Restore health (costs karma)",[{txt:"Feed", id:"sfeed"}]);
    html+=rowHTML("people","Turn Someone","Create a fledgling",[{txt:"Turn", id:"sturn"}]);
    html+=rowHTML("crest","Embrace Shadows","Lay low and recover",[{txt:"Rest", id:"srest"}]);
  } else {
    html+=rowHTML("wolf","Transform","Run wild, boost fitness",[{txt:"Shift", id:"sshift"}]);
    html+=rowHTML("moon","Howl at the Moon","Call the pack",[{txt:"Howl", id:"showl"}]);
  }
  html+=rowHTML("cross","Seek a Cure","Become human again",[{txt:"Cure", id:"scure"}]);
  openPanel({icon:t==="vampire"?"fang":"wolf", title:cap(t), bodyHTML:html});
  wireRowActions(handleSupernatural);
}
function handleSupernatural(id){
  if(id==="sfeed"){ changeStat("health",rand(8,16)); changeStat("happiness",4); changeStat("karma",-rand(4,10)); log("🦇 You fed in the dark. The hunger fades.","bad","Supernatural"); closePanel(); renderAll(); }
  else if(id==="sturn"){ spawnFriend(); changeStat("karma",-5); log("🦇 You turned someone into a creature of the night.","info","Supernatural"); closePanel(); renderAll(); }
  else if(id==="srest"){ changeStat("mental",rand(4,8)); changeStat("health",4); log("You rested deep in the shadows.","good","Supernatural"); closePanel(); renderAll(); }
  else if(id==="sshift"){ changeStat("fitness",rand(6,12)); changeStat("happiness",4); if(chance(0.2)){ changeStat("karma",-8); log("🐺 You blacked out and woke up miles from home...","bad","Supernatural"); } else log("🐺 You ran wild and free.","good","Supernatural"); closePanel(); renderAll(); }
  else if(id==="showl"){ changeStat("happiness",5); if(chance(0.5)) spawnFriend(); log("🐺 Your howl echoed through the night.","info","Supernatural"); closePanel(); renderAll(); }
  else if(id==="scure"){ closePanel(); askQuestion({icon:"cross", title:"Seek a Cure", body:"Give up your supernatural nature and live (and die) as a human again?", choices:[{label:"Become human", primary:true, fn:()=>{ G.s.supernatural=null; log("You found a cure and became human once more.","good","Supernatural"); }},{label:"Stay as you are"}]}); }
}

/* ============================================================
   SCENARIOS (alternate life starts)
   ============================================================ */
function scenarioPanel(){
  let html=`<p style="color:var(--text-dim);font-size:13px">Choose how your next life begins.</p>`;
  (GAME.scenarios||[]).forEach(sc=>{ html+=rowHTML(sc.icon, sc.name, sc.desc, [{txt:"Start", id:"sc_"+sc.id}]); });
  openPanel({icon:"sparkle", title:"Scenarios", bodyHTML:html});
  wireRowActions(id=>{ if(id.startsWith("sc_")) startScenario(id.slice(3)); });
}
function startScenario(id){
  const sc=(GAME.scenarios||[]).find(x=>x.id===id);
  newCharacter();
  if(sc&&sc.apply){ try{ sc.apply(G.s); }catch(e){} if(id!=="normal") log(`Scenario: ${sc.name} — ${sc.desc}`,"info","Scenario"); }
  closePanel(); startGame();
}

/* ============================================================
   RELIGION / FAITH
   ============================================================ */
function faithDisplay(){ const f=G.s.faith; if(!f) return null; const r=religionDef(f.religion); return { name:f.name||(r&&r.name)||"Your Faith", icon:(r&&r.icon)||"temple" }; }
function faithCenter(){
  closePanel();
  if(!G.s.faith||!G.s.faith.religion){
    let html=`<p style="color:var(--text-dim);font-size:13px">You're currently secular. A faith can bring peace of mind.</p><div class="section-head">Faiths</div>`;
    (GAME.religions||[]).forEach(r=>{ html+=rowHTML(r.icon, r.name, r.blurb, [{txt:"Join", id:"join_"+r.id}]); });
    html+=`<div class="section-head">Lead Your Own</div>`;
    if(G.s.fame>=30 || (G.s.skills&&G.s.skills.charisma>=50)) html+=rowHTML("temple","Found a Religion","Become a spiritual leader",[{txt:"Found", id:"found_faith"}]);
    else html+=`<p style="color:var(--text-dim);font-size:12px">Reach 30 fame or 50 charisma to found your own religion.</p>`;
    openPanel({icon:"temple", title:"Spirituality", bodyHTML:html});
    wireRowActions(id=>{ if(id.startsWith("join_")) joinFaith(id.slice(5)); else if(id==="found_faith") foundReligion(); });
  } else {
    const d=faithDisplay();
    let html=`<p style="color:var(--text-dim)">${d.name} · Devotion ${Math.round(G.s.faith.devotion)}%${G.s.faith.founder?` · Founder · ${fmtFollowers(G.s.faith.followers)} followers`:""}</p>`;
    html+=`<div class="section-head">Practice</div>`;
    html+=rowHTML("temple","Pray","Devotion & peace of mind",[{txt:"Pray", id:"pray"}]);
    html+=rowHTML("people","Attend Service","Worship together",[{txt:"Attend", id:"service"}]);
    html+=rowHTML("coin","Tithe","Give to your faith",[{txt:"Donate", id:"tithe"}]);
    if(G.s.faith.founder) html+=rowHTML("megaphone","Preach","Grow your flock (tithes)",[{txt:"Preach", id:"preach"}]);
    html+=`<div class="section-head">Other</div>`;
    html+=rowHTML("zodiac","Convert","Switch faiths",[{txt:"Convert", id:"convert"}]);
    html+=rowHTML("person","Leave Faith","Become secular",[{txt:"Leave", id:"leavefaith"}]);
    openPanel({icon:d.icon, title:d.name, bodyHTML:html});
    wireRowActions(handleFaith);
  }
}
function joinFaith(id){ G.s.faith={religion:id, devotion:rand(20,40)}; log(`🛐 You joined ${religionDef(id).name}.`,"good","Faith"); changeStat("mental",4); faithCenter(); }
function foundReligion(){ const name=pick(["The Awakened","New Dawn Collective","Circle of Stars","The Enlightened","Children of the Sky","The Inner Path"]); G.s.faith={religion:"custom", name, devotion:85, founder:true, followers:rand(50,500)}; log(`🛐 You founded your own religion: ${name}!`,"good","Faith"); changeStat("fame",8); changeStat("happiness",10); faithCenter(); }
function handleFaith(id){
  if(id==="pray"){ G.s.faith.devotion=clamp(G.s.faith.devotion+rand(3,8)); changeStat("mental",rand(2,5)); changeStat("happiness",2); toast("You prayed. Inner peace."); closePanel(); renderAll(); }
  else if(id==="service"){ G.s.faith.devotion=clamp(G.s.faith.devotion+rand(4,9)); changeStat("happiness",3); if(chance(0.3)) spawnFriend(); log("🛐 You attended a service.","good","Faith"); closePanel(); renderAll(); }
  else if(id==="tithe"){ const amt=Math.round(500*G.s.wealthFactor); if(G.s.money<amt){ toast("Can't afford to tithe."); return; } adjustMoney(-amt); G.s.faith.devotion=clamp(G.s.faith.devotion+8); changeStat("karma",5); log(`🛐 You tithed ${fmtMoney(amt)}.`,"money","Faith"); faithCenter(); }
  else if(id==="preach"){ G.s.faith.followers=(G.s.faith.followers||0)+rand(50,1200); const income=Math.round((G.s.faith.followers||0)*rand(1,5)/10); adjustMoney(income); changeStat("fame",rand(1,3)); log(`🛐 You preached, gaining followers (+${fmtMoney(income)} in tithes).`,"money","Faith"); faithCenter(); }
  else if(id==="convert"){ closePanel(); askQuestion({icon:"temple", title:"Convert", body:"Switch to which faith?", choices:(GAME.religions||[]).map(r=>({label:r.name, fn:()=>{ G.s.faith={religion:r.id, devotion:rand(15,30)}; log(`You converted to ${r.name}.`,"info","Faith"); }})).concat([{label:"Never mind"}])}); }
  else if(id==="leavefaith"){ closePanel(); askQuestion({icon:"person", title:"Leave Faith", body:"Become secular again?", choices:[{label:"Leave", primary:true, fn:()=>{ G.s.faith=null; log("You became secular.","info","Faith"); }},{label:"Stay"}]}); }
}
function readHoroscope(){
  closePanel(); const z=zodiacDef(G.s.zodiac); const h=pick(GAME.horoscopes||["The stars are quiet today."]);
  askQuestion({icon:"zodiac", title:(z?`${z.name} ${z.symbol}`:"Horoscope"), body:`"${h}"`, choices:[
    {label:"Take it to heart", primary:true, fn:()=>{ changeStat("mental",rand(1,4)); changeStat("happiness",2); }},
    {label:"Just for fun", fn:()=>{}},
  ]});
}

/* ============================================================
   TRIAL MINIGAME — sway the jury
   ============================================================ */
function trialMinigame(crimeName, sentence, onConvict){
  closePanel();
  let jury=clamp(45+Math.round((G.s.karma-50)/8)+(G.s.lawRetainer?10:0),10,80);
  let round=0; const maxR=3;
  const render=(msg)=>{
    const html=`<div class="mg-area"><div class="mg-status">${msg||`Sway the jury. Round ${round+1} of ${maxR}.`}</div>
      <div style="margin:10px 0 4px;color:var(--text-dim);font-size:12px">Jury favour — need 55% to be acquitted</div>
      <div class="bar" style="height:14px;max-width:320px;margin:0 auto"><div class="fill" style="width:${jury}%;background:${jury>=55?'var(--accent)':'var(--red)'}"></div></div>
      <p style="margin-top:6px;font-weight:700">${Math.round(jury)}%</p>
      <div class="modal-choices" style="margin-top:14px">
        <button class="choice-btn" data-t="evidence"><span>Present evidence</span><span class="choice-sub">Smarts</span></button>
        <button class="choice-btn" data-t="cross"><span>Cross-examine</span><span class="choice-sub">Smarts + Charisma</span></button>
        <button class="choice-btn" data-t="emotion"><span>Appeal to emotion</span><span class="choice-sub">Looks + Charisma</span></button>
      </div></div>`;
    openPanel({icon:"scales", title:`Trial: ${crimeName}`, bodyHTML:html, choices:[]});
    $$("#modalBody [data-t]").forEach(b=> b.onclick=()=>turn(b.dataset.t));
  };
  const turn=(type)=>{
    const sk=G.s.skills||{}; let delta=0;
    if(type==="evidence") delta=rand(-4,6)+Math.round(G.s.smarts/12);
    else if(type==="cross") delta=rand(-6,8)+Math.round((G.s.smarts+(sk.charisma||0))/20);
    else if(type==="emotion") delta=rand(-5,10)+Math.round((G.s.looks+(sk.charisma||0))/20);
    jury=clamp(jury+delta); round++;
    if(round>=maxR){
      closePanel();
      if(jury>=55){ log(`⚖️ The jury found you NOT GUILTY of ${crimeName}!`,"good","Court"); changeStat("happiness",10); }
      else { log(`⚖️ The jury found you GUILTY of ${crimeName}.`,"bad","Court"); if(onConvict) onConvict(); }
      renderAll();
    } else render(`${delta>=0?"+":""}${delta} favour — ${jury>=55?"the jury leans your way.":"keep fighting."}`);
  };
  render();
}

/* ============================================================
   PRISON-BREAK MINIGAME — timing bar
   ============================================================ */
function prisonBreakGame(){
  closePanel();
  let successes=0; const need=3; let pos=0, dir=1, raf=null; const lo=38, hi=62;
  const render=()=>{
    const html=`<div class="mg-area"><div class="mg-status">Stop the marker in the green zone — ${successes}/${need} done.</div>
      <div style="position:relative;height:26px;max-width:340px;margin:18px auto;background:var(--bg-soft);border:1px solid var(--line);border-radius:8px;overflow:hidden">
        <div style="position:absolute;left:${lo}%;width:${hi-lo}%;top:0;bottom:0;background:rgba(46,194,126,.35)"></div>
        <div id="pbMark" style="position:absolute;top:0;bottom:0;width:5px;background:var(--gold);left:0%"></div>
      </div>
      <button class="choice-btn primary" id="pbStop" style="max-width:200px;margin:0 auto">STOP</button></div>`;
    openPanel({icon:"lock", title:"Prison Break", bodyHTML:html, choices:[{label:"Give up", fn:()=>{ if(raf)cancelAnimationFrame(raf); closePanel(); renderAll(); }}]});
    const mark=$("#pbMark");
    const tick=()=>{ pos+=dir*1.7; if(pos>=100){pos=100;dir=-1;} if(pos<=0){pos=0;dir=1;} if(mark) mark.style.left=pos+"%"; raf=requestAnimationFrame(tick); };
    tick();
    $("#pbStop").onclick=()=>{
      if(raf)cancelAnimationFrame(raf);
      if(pos>=lo && pos<=hi){ successes++;
        if(successes>=need){ G.s.inPrison=false; G.s.prisonYears=0; G.s.notoriety+=20; G.s.criminalRecord.push({crime:"Prison Escape", age:G.s.age}); closePanel(); log("🏃 You escaped from prison! You're a fugitive now.","bad","Prison Break"); renderAll(); }
        else render();
      } else { G.s.prisonYears+=3; changeStat("health",-10); closePanel(); log("🚨 Your escape failed! 3 years added to your sentence.","bad","Prison Break"); renderAll(); }
    };
  };
  render();
}

/* ============================================================
   FAMILY TREE
   ============================================================ */
function familyTree(){
  closePanel();
  let html="";
  const tier=(label,rels,extra)=>{
    const list=G.s.people.filter(p=>rels.includes(p.relation));
    html+=`<div class="section-head">${label}</div>`;
    if(extra) html+=extra;
    if(!list.length && !extra){ html+=`<p style="color:var(--text-dim);font-size:12px">—</p>`; return; }
    list.forEach(p=>{ html+=`<div class="list-row"><div class="lr-ico">${iconHTML(npcIcon(p))}</div><div class="lr-main"><div class="lr-title">${fullName(p)} ${p.alive?"":'<span class="tag-pill red">late</span>'}</div><div class="lr-sub">${cap(p.relation)} · age ${p.age}</div></div></div>`; });
  };
  tier("Grandparents",["grandfather","grandmother"]);
  tier("Parents & Elders",["father","mother","aunt","uncle"]);
  const youRow=`<div class="list-row" style="border-color:var(--accent)"><div class="lr-ico">${iconHTML("crest")}</div><div class="lr-main"><div class="lr-title">${fullName(G.s)} (You)</div><div class="lr-sub">Generation ${G.s.generation||1} · age ${G.s.age}</div></div></div>`;
  tier("Your Generation",["sibling","cousin","spouse","lover"], youRow);
  tier("Children",["child"]);
  openPanel({icon:"tree", title:"Family Tree", bodyHTML:html});
}

/* ============================================================
   SAVE SLOTS + IN-GAME MENU
   ============================================================ */
function saveSlotsPanel(){
  const inGame = !$("#game").classList.contains("hidden") && !!G.s;
  let html=`<p style="color:var(--text-dim);font-size:13px">${inGame?"Save your current life to a slot, or load another life.":"Load a saved life."}</p>`;
  for(let i=1;i<=3;i++){
    const raw=localStorage.getItem("lifeforge_slot_"+i); let summary="Empty slot";
    if(raw){ try{ const s=JSON.parse(raw); summary=`${s.first} ${s.last} · age ${s.age} · Gen ${s.generation||1}`; }catch(e){} }
    const acts=[]; if(inGame) acts.push({txt:"Save", id:"sv_"+i}); if(raw) acts.push({txt:"Load", id:"ld_"+i, sec:true});
    if(!acts.length) acts.push({txt:"—", sec:true});
    html+=rowHTML("scroll", "Slot "+i, summary, acts);
  }
  openPanel({icon:"scroll", title:"Save Slots", bodyHTML:html});
  wireRowActions(id=>{
    if(id.startsWith("sv_")){ const i=id.slice(3); try{ localStorage.setItem("lifeforge_slot_"+i, JSON.stringify(G.s)); }catch(e){} toast("Saved to slot "+i); saveSlotsPanel(); }
    else if(id.startsWith("ld_")){ const i=id.slice(3); const raw=localStorage.getItem("lifeforge_slot_"+i); if(raw){ try{ G.s=JSON.parse(raw); migrate(); closePanel(); startGame(); if(!G.s.alive) showDeathScreen(); }catch(e){ toast("Could not load slot."); } } }
  });
}
function topMenu(){
  openPanel({icon:"clipboard", title:"Menu", bodyHTML:`<p style="color:var(--text-dim)">Game options & pages.</p>`, choices:[
    {label:"Character Bio", fn:()=>{ closePanel(); bioPage(); }},
    {label:"Family Tree", fn:()=>{ closePanel(); familyTree(); }},
    {label:"Save Slots", fn:()=>{ closePanel(); saveSlotsPanel(); }},
    {label:"Hall of Fame", fn:()=>{ closePanel(); hallOfFamePanel(); }},
    {label:"Main Menu (autosaves)", fn:()=>{ saveGame(); closePanel(); goToMenu(); }},
    {label:"Close", fn:closePanel},
  ]});
}

/* ============================================================
   MINIGAMES
   ============================================================ */
function memoryGame(){
  const emojis=["🍎","🚗","🐶","🎸","⚽","🌟","🍕","🎈"];
  const deck=[...emojis,...emojis].sort(()=>Math.random()-0.5);
  let flipped=[],matched=0,lock=false,moves=0;
  openPanel({icon:"🎮", title:"Memory Game", bodyHTML:`<div class="mg-area"><div class="mg-status" id="mgStat">Match all the pairs!</div><div class="mg-grid" id="mgGrid" style="grid-template-columns:repeat(4,1fr);max-width:300px;margin:0 auto"></div></div>`, choices:[{label:"Give Up",primary:true,fn:()=>{closePanel();renderAll();}}]});
  const grid=$("#mgGrid");
  deck.forEach((e)=>{ const cell=document.createElement("div"); cell.className="mg-cell"; cell.dataset.e=e; cell.textContent="❓";
    cell.onclick=()=>{ if(lock||cell.classList.contains("flipped")||cell.classList.contains("matched"))return;
      cell.classList.add("flipped"); cell.textContent=e; flipped.push(cell);
      if(flipped.length===2){ moves++; lock=true;
        if(flipped[0].dataset.e===flipped[1].dataset.e){ flipped.forEach(c=>c.classList.add("matched")); matched++; flipped=[]; lock=false;
          if(matched===emojis.length){ $("#mgStat").textContent=`🎉 Solved in ${moves} moves!`; changeStat("smarts",rand(3,7)); changeStat("happiness",4); setTimeout(()=>toast("Brain trained! Smarts up."),300); } }
        else { setTimeout(()=>{ flipped.forEach(c=>{c.classList.remove("flipped");c.textContent="❓";}); flipped=[]; lock=false; },700); } } };
    grid.appendChild(cell); });
}
function reflexGame(){
  openPanel({icon:"⚡", title:"Reflex Test", bodyHTML:`<div class="mg-area"><div class="mg-status" id="mgStat">Wait for green, then click FAST!</div><button id="reflexBtn" style="width:160px;height:160px;border-radius:50%;border:none;font-size:18px;font-weight:800;cursor:pointer;background:var(--red);color:#fff">WAIT…</button></div>`, choices:[{label:"Close",primary:true,fn:()=>{closePanel();renderAll();}}]});
  const btn=$("#reflexBtn"); let ready=false,startT=0,timer;
  const arm=()=>{ btn.textContent="WAIT…"; btn.style.background="var(--red)"; btn.style.color="#fff"; ready=false; timer=setTimeout(()=>{ ready=true; btn.style.background="var(--accent)"; btn.style.color="#06150e"; btn.textContent="CLICK!"; startT=performance.now(); }, rand(1200,3500)); };
  arm();
  btn.onclick=()=>{ if(!ready){ clearTimeout(timer); $("#mgStat").textContent="❌ Too early!"; arm(); return; }
    const rt=Math.round(performance.now()-startT); $("#mgStat").textContent=`⚡ ${rt}ms!`;
    if(rt<260){ changeStat("happiness",5); changeStat("smarts",2); toast("Lightning reflexes!"); } else { changeStat("happiness",2); toast("Not bad!"); }
    arm(); };
}
function casinoLobby(){
  closePanel();
  let html=`<p style="color:var(--text-dim)">Balance: ${fmtMoney(G.s.money)}</p>`;
  html+=rowHTML("dice","Hi-Lo","Guess higher or lower",[{txt:"Play", id:"g_hilo"}]);
  html+=rowHTML("cards","Blackjack","Beat the dealer to 21",[{txt:"Play", id:"g_bj"}]);
  html+=rowHTML("slots","Slots","Spin three reels",[{txt:"Play", id:"g_slots"}]);
  openPanel({icon:"slots", title:"Casino", bodyHTML:html});
  wireRowActions(id=>{ if(id==="g_hilo")hiLoGame(); else if(id==="g_bj")blackjackGame(); else if(id==="g_slots")slotsGame(); });
}
function hiLoGame(){
  let bet=100;
  const render=(msg="Place your bet, then guess Higher or Lower.")=>{
    const card=rand(2,14);
    openPanel({icon:"🎰", title:"Casino — Hi-Lo", bodyHTML:`<div class="mg-area"><div class="mg-status">${msg}</div><div style="font-size:64px;margin:10px">${cardFace(card)}</div><p style="color:var(--text-dim)">Balance: ${fmtMoney(G.s.money)} · Bet: ${fmtMoney(bet)}</p><div class="row-flex" style="margin:10px 0"><button class="menu-btn" id="betDown">- $100</button><button class="menu-btn" id="betUp">+ $100</button></div><div class="row-flex"><button class="choice-btn primary" id="guessHigh" style="flex:1">⬆️ Higher</button><button class="choice-btn primary" id="guessLow" style="flex:1">⬇️ Lower</button></div></div>`, choices:[{label:"Cash Out",primary:true,fn:()=>{closePanel();renderAll();}}]});
    $("#betUp").onclick=()=>{ bet=Math.min(bet+100,G.s.money); render(); };
    $("#betDown").onclick=()=>{ bet=Math.max(100,bet-100); render(); };
    const guess=high=>{ if(G.s.money<bet){ render("Not enough to bet that."); return; } const next=rand(2,14); if(next===card){ render(`Drew ${cardFace(next)} — tie! Bet returned.`); return; } const win=high?next>card:next<card; if(win){ adjustMoney(bet); changeStat("happiness",3); render(`Drew ${cardFace(next)} — you WON ${fmtMoney(bet)}! 🎉`); } else { adjustMoney(-bet); changeStat("happiness",-3); render(`Drew ${cardFace(next)} — you lost ${fmtMoney(bet)}. 😩`); } };
    $("#guessHigh").onclick=()=>guess(true); $("#guessLow").onclick=()=>guess(false);
  };
  render();
}
function cardFace(v){ const m={11:"J",12:"Q",13:"K",14:"A"}; return (m[v]||v)+"♠"; }
function blackjackGame(){
  let bet=100, over=false;
  function card(){ const v=rand(1,13); return v>10?10:(v===1?11:v); }
  function sum(h){ let s=h.reduce((a,b)=>a+b,0); let aces=h.filter(x=>x===11).length; while(s>21&&aces>0){s-=10;aces--;} return s; }
  let player=[card(),card()], dealer=[card()];
  const render=(msg)=>{
    const ps=sum(player), ds=sum(dealer);
    const html=`<div class="mg-area"><div class="mg-status">${msg||"Hit or Stand?"}</div>
      <p>Your hand: <b>${player.join(", ")}</b> = ${ps}</p>
      <p>Dealer: <b>${over?dealer.join(", ")+" = "+ds:dealer[0]+" + ?"}</b></p>
      <p style="color:var(--text-dim)">Balance ${fmtMoney(G.s.money)} · Bet ${fmtMoney(bet)}</p>
      <div class="row-flex"><button class="menu-btn" id="bjDown">- $100</button><button class="menu-btn" id="bjUp">+ $100</button></div>
      <div class="row-flex" style="margin-top:8px"><button class="choice-btn primary" id="bjHit" style="flex:1">${over?"New Hand":"Hit"}</button><button class="choice-btn primary" id="bjStand" style="flex:1">${over?"New Hand":"Stand"}</button></div></div>`;
    openPanel({icon:"cards", title:"Blackjack", bodyHTML:html, choices:[{label:"Leave Table",primary:true,fn:()=>{closePanel();renderAll();}}]});
    $("#bjUp").onclick=()=>{ if(!over){ bet=Math.min(bet+100,G.s.money); render(); } };
    $("#bjDown").onclick=()=>{ if(!over){ bet=Math.max(100,bet-100); render(); } };
    $("#bjHit").onclick=()=>{ if(over){ newRound(); return; } player.push(card()); if(sum(player)>21) finish(); else render(); };
    $("#bjStand").onclick=()=>{ if(over){ newRound(); return; } finish(); };
  };
  function finish(){
    if(G.s.money<bet){ render("Not enough cash to cover that bet."); return; }
    over=true; while(sum(dealer)<17) dealer.push(card());
    const ps=sum(player), ds=sum(dealer); let msg, win=0;
    if(ps>21){ msg="Bust! You lose."; win=-bet; }
    else if(ds>21){ msg="Dealer busts — you win!"; win=bet; }
    else if(ps>ds){ msg="You win!"; win=bet; }
    else if(ps<ds){ msg="Dealer wins."; win=-bet; }
    else { msg="Push — it's a tie."; win=0; }
    adjustMoney(win); changeStat("happiness", win>0?3:win<0?-2:0);
    render(msg);
  }
  function newRound(){ player=[card(),card()]; dealer=[card()]; over=false; render("New hand dealt. Hit or Stand?"); }
  render("Hit or Stand?");
}
function slotsGame(){
  let bet=100; const syms=["star","coin","heart","crown","crypto","sun","ball"];
  const render=(reels,msg)=>{
    const r=reels||["?","?","?"];
    const cell=s=>`<div style="width:60px;height:60px;display:flex;align-items:center;justify-content:center;background:var(--card-2);border:1px solid var(--line);border-radius:10px;margin:0 4px;font-size:34px">${s==="?"?"?":iconHTML(s)}</div>`;
    const html=`<div class="mg-area"><div class="mg-status">${msg||"Spin to win! 3 matching = 10× jackpot."}</div>
      <div class="row-flex" style="margin:14px 0">${r.map(cell).join("")}</div>
      <p style="color:var(--text-dim)">Balance ${fmtMoney(G.s.money)} · Bet ${fmtMoney(bet)}</p>
      <div class="row-flex"><button class="menu-btn" id="slDown">- $100</button><button class="menu-btn" id="slUp">+ $100</button></div>
      <button class="choice-btn primary" id="slSpin" style="margin-top:10px;max-width:200px">SPIN</button></div>`;
    openPanel({icon:"slots", title:"Slots", bodyHTML:html, choices:[{label:"Leave",primary:true,fn:()=>{closePanel();renderAll();}}]});
    $("#slUp").onclick=()=>{ bet=Math.min(bet+100,G.s.money); render(r,msg); };
    $("#slDown").onclick=()=>{ bet=Math.max(100,bet-100); render(r,msg); };
    $("#slSpin").onclick=()=>{
      if(G.s.money<bet){ render(r,"Not enough cash."); return; }
      adjustMoney(-bet);
      const res=[pick(syms),pick(syms),pick(syms)]; let win=0,m;
      if(res[0]===res[1]&&res[1]===res[2]){ win=bet*10; m=`JACKPOT! +${fmtMoney(win)}`; }
      else if(res[0]===res[1]||res[1]===res[2]||res[0]===res[2]){ win=bet*2; m=`Two match! +${fmtMoney(win)}`; }
      else m="No match. Spin again!";
      if(win){ adjustMoney(win); changeStat("happiness",3); } else changeStat("happiness",-1);
      render(res,m);
    };
  };
  render();
}

/* ============================================================
   ROW HELPERS
   ============================================================ */
function rowHTML(icon,title,sub,actions=[]){
  const btns=actions.map(a=>{ if(a.sec||a.id===undefined) return `<button class="lr-action secondary" disabled>${a.txt}</button>`; return `<button class="lr-action" data-act="${a.id}">${a.txt}</button>`; }).join("");
  return `<div class="list-row"><div class="lr-ico">${iconHTML(icon)}</div><div class="lr-main"><div class="lr-title">${title}</div><div class="lr-sub">${sub}</div></div>${btns}</div>`;
}
function wireRowActions(handler){ $$("#modalBody [data-act]").forEach(btn=>{ if(btn.disabled) return; btn.onclick=()=>handler(btn.dataset.act); }); }

/* ============================================================
   DEATH
   ============================================================ */
function checkDeath(){
  if(G.s.health<=0){ die("poor health"); return; }
  let p=0; if(G.s.age>60)p=(G.s.age-60)/700; if(G.s.age>90)p+=0.08; if(G.s.age>100)p+=0.15; if(G.s.health<30)p+=0.05;
  if(G.s.supernatural&&G.s.supernatural.type==="vampire") p*=0.15; // near-immortal
  if(chance(p)) die(pick(["old age","heart failure","natural causes","a sudden illness"]));
}
function die(cause){ G.s.alive=false; G.s.causeOfDeath=cause; checkAchievements(); recordLife(); log(`⚰️ You died of ${cause} at age ${G.s.age}.`,"bad","The End"); }
function showDeathScreen(){
  const lt=G.s.stats_lifetime||{}; const netWorth=G.s.money+G.s.assets.reduce((s,a)=>s+a.value,0);
  const heir=G.s.people.find(p=>p.alive && p.relation==="child");
  const inheritance=Math.max(0, Math.round(G.s.money*0.6));
  const choices=[];
  if(heir){ choices.push({label:`Continue as ${heir.name} (Gen ${(G.s.generation||1)+1})`, primary:true, fn:()=>continueAsChild(heir)}); }
  choices.push({label:"Start a New Life", primary:!heir, fn:()=>{ localStorage.removeItem(SAVE_KEY); closePanel(); goToMenu(); }});
  openPanel({icon:"⚰️", title:`${fullName(G.s)} · ${G.s.age} years`,
    bodyHTML:`<p style="text-align:center">Cause of death: <b>${G.s.causeOfDeath}</b></p>
      <div class="section-head">Life Summary (Generation ${G.s.generation||1})</div>
      <p>Net worth: <b>${fmtMoney(netWorth)}</b></p>
      <p>Jobs held: ${lt.jobsHeld||0} · Businesses: ${(G.s.businesses||[]).length}</p>
      <p>Partners: ${lt.partners||0} · Kids: ${lt.kids||0}</p>
      <p>Crimes committed: ${lt.crimes||0}</p>
      <p>Happiness ${Math.round(G.s.happiness)}% · Mental ${Math.round(G.s.mental)}%</p>
      <p>Karma ${Math.round(G.s.karma)} · Fame ${Math.round(G.s.fame)} · Followers ${fmtFollowers(G.s.followers)}</p>
      ${heir?`<p style="color:var(--accent);margin-top:8px">${heir.name} will inherit ${fmtMoney(inheritance)} and the family's property.</p>`:""}`,
    choices});
}
function continueAsChild(heir){
  const gen=(G.s.generation||1)+1;
  const inheritance=Math.max(0, Math.round(G.s.money*0.6));
  const country=C().countries.find(c=>c.name===G.s.country)||pick(C().countries);
  // rebuild family from the heir's point of view
  const newPeople=[];
  G.s.people.forEach(p=>{
    if(!p.alive || p.id===heir.id) return;
    if(p.relation==="spouse"||p.relation==="lover"){ newPeople.push({...p, relation:p.gender==="male"?"father":"mother"}); }
    else if(p.relation==="child"){ newPeople.push({...p, relation:"sibling"}); }
  });
  const age=heir.age||0;
  const ns={
    first:heir.name, last:heir.last, gender:heir.gender,
    country:country.name, flag:country.flag, wealthFactor:country.wealth,
    age, alive:true, causeOfDeath:null, money:inheritance,
    happiness:rand(55,80), health:rand(75,95),
    smarts: heir.smartsGene!=null?heir.smartsGene:rand(30,80),
    looks:  heir.looksGene!=null?heir.looksGene:rand(30,85),
    mental:rand(55,85), karma:50, fame:0, fitness:rand(20,50),
    edu: age>=18?1:0, inSchool: age<18, gpa:rand(50,90),
    job:null, addictions:[], conditions:[], criminalRecord:[],
    inPrison:false, prisonYears:0, notoriety:0,
    politics:null, lawRetainer:false,
    bornCountry:country.name, citizenships:[country.name], yearsInCountry:age,
    followers:0, market:null, investments:{stocks:{},crypto:{}}, businesses:[], generation:gen,
    people:newPeople, pets:[], assets:G.s.assets.slice(),
    log:[], firedOnce:[], recentEvents:[],
    stats_lifetime:{ jobsHeld:0, crimes:0, partners:0, kids:0 },
  };
  G.s=ns; initMarket(); closePanel();
  $("#feed").innerHTML="";
  log(`Generation ${gen}: you are now ${ns.first} ${ns.last}, age ${age}.`, "good", "New Generation");
  log(`You inherited ${fmtMoney(inheritance)} and the family's property.`, "money", "Inheritance");
  renderFeed(); renderAll();
}

/* ============================================================
   HELPERS
   ============================================================ */
function currentJobTitle(){ if(!G.s.job) return "Unemployed"; const c=CAREERS().find(x=>x.id===G.s.job.careerId); return c?c.ladder[G.s.job.rankIndex]:"Worker"; }
function schoolName(){ if(G.s.age<5) return "Toddler"; if(G.s.age<12) return "Primary School"; if(G.s.age<18) return "Secondary School"; return "Student"; }

/* ============================================================
   SCREENS / BOOT
   ============================================================ */
function showScreen(id){ $$(".screen").forEach(s=>s.classList.add("hidden")); $(id).classList.remove("hidden"); }
function goToMenu(){ showScreen("#menu"); $("#btnContinue").style.display=hasSave()?"block":"none"; }
function startGame(){ showScreen("#game"); $("#feed").innerHTML=""; renderFeed(); renderAll(); }

function boot(){
  // inject our custom SVG icons into static slots (stats, nav)
  $$("[data-icon]").forEach(el=>{ if(window.iconHTML) el.insertAdjacentHTML("afterbegin", iconHTML(el.dataset.icon)); });
  const sel=$("#cCountry");
  C().countries.forEach((c,i)=>{ const o=document.createElement("option"); o.value=i; o.textContent=c.name; sel.appendChild(o); });
  $("#btnNewLife").onclick=()=>{ newCharacter(); startGame(); };
  $("#btnCustomLife").onclick=()=>showScreen("#customScreen");
  $("#btnBackMenu").onclick=goToMenu;
  $("#btnContinue").onclick=()=>{ if(loadGame()){ startGame(); if(!G.s.alive) showDeathScreen(); } };
  $("#btnHOF").onclick=hallOfFamePanel;
  $("#btnScenarios").onclick=scenarioPanel;
  $(".id-block").onclick=()=>{ if(G.s) bioPage(); };
  $("#btnStartCustom").onclick=()=>{ newCharacter({ first:$("#cFirst").value.trim()||null, last:$("#cLast").value.trim()||null, gender:$("#cGender").value, country:C().countries[parseInt($("#cCountry").value)||0] }); startGame(); };
  $("#ageBtn").onclick=()=>{ if(modalOpen) return; ageUp(); };
  $("#btnMenuTop").onclick=topMenu;
  $("#btnSlots").onclick=saveSlotsPanel;
  $$(".nav-btn").forEach(b=> b.onclick=()=>openTab(b.dataset.tab));
  $("#modalBackdrop").onclick=()=>{ if(modalQueue.length===0) closePanel(); };
  goToMenu();
}
document.addEventListener("DOMContentLoaded", boot);
