/* ============================================================
   extras.js — LifeForge feature layer (loaded after game.js).
   Adds: sound + haptics, a Prison Life panel, a Pet Care panel,
   and the first-run tutorial. Pure additions — these define new
   globals and are called from small hooks inside game.js.
   ============================================================ */
window.LF = window.LF || {};

/* ============================================================
   SOUND + HAPTICS  (synthesized via WebAudio — no asset files)
   ============================================================ */
(function(){
  let ctx=null, last=0;
  const on = ()=> localStorage.getItem("lf_sound")!=="off";
  function ac(){ if(ctx) return ctx; try{ ctx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ ctx=null; } return ctx; }
  function blip(freq,dur,type,gain){
    if(!on()) return; const c=ac(); if(!c) return; if(c.state==="suspended") c.resume();
    const o=c.createOscillator(), g=c.createGain();
    o.type=type||"sine"; o.frequency.value=freq; g.gain.value=gain||0.05;
    o.connect(g); g.connect(c.destination);
    const t=c.currentTime; o.start(t);
    g.gain.exponentialRampToValueAtTime(0.0001, t+dur); o.stop(t+dur);
  }
  LF.sfx=function(kind){
    if(!on()) return; const now=Date.now(); if(now-last<55) return; last=now;
    switch(kind){
      case "click": blip(330,0.05,"square",0.03); break;
      case "good":  blip(660,0.12,"sine",0.06); setTimeout(()=>blip(880,0.12,"sine",0.05),60); break;
      case "bad":   blip(196,0.22,"sawtooth",0.05); break;
      case "cash":  blip(988,0.07,"triangle",0.05); setTimeout(()=>blip(1319,0.09,"triangle",0.045),70); break;
      case "level": blip(523,0.1,"sine",0.06); setTimeout(()=>blip(659,0.1,"sine",0.06),90); setTimeout(()=>blip(784,0.15,"sine",0.06),180); break;
      case "age":   blip(440,0.05,"sine",0.04); break;
    }
  };
  LF.vibrate=function(p){ if(on() && navigator.vibrate){ try{ navigator.vibrate(p); }catch(e){} } };
  LF.sfxForKind=function(kind){
    if(kind==="good"){ LF.sfx("good"); LF.vibrate(20); }
    else if(kind==="bad"){ LF.sfx("bad"); LF.vibrate([25,35,25]); }
    else if(kind==="money"){ LF.sfx("cash"); }
  };
  function updateBtn(){ const b=document.getElementById("btnSound"); if(b) b.textContent=on()?"🔊":"🔇"; }
  LF.toggleSound=function(){ localStorage.setItem("lf_sound", on()?"off":"on"); updateBtn(); if(on()){ ac(); LF.sfx("click"); } };
  document.addEventListener("DOMContentLoaded", ()=>{
    updateBtn();
    const sb=document.getElementById("btnSound"); if(sb) sb.onclick=LF.toggleSound;
    const ab=document.getElementById("ageBtn"); if(ab) ab.addEventListener("click", ()=>{ LF.sfx("age"); LF.vibrate(12); });
    // unlock audio on first interaction (browsers require a gesture)
    const unlock=()=>{ const c=ac(); if(c&&c.state==="suspended") c.resume(); document.removeEventListener("pointerdown",unlock); };
    document.addEventListener("pointerdown", unlock);
  });
})();

/* ============================================================
   FIRST-RUN TUTORIAL  (shown once, ever)
   ============================================================ */
LF.maybeTutorial=function(){
  if(localStorage.getItem("lf_tutorial_done")) return;
  const steps=[
    {icon:"👋", title:"Welcome to LifeForge", body:"You'll live an entire life — one year at a time. Every choice shapes who you become."},
    {icon:"🟢", title:"Age Up", body:"Tap the big green ＋ button to advance a year. Each year brings income, random events and choices."},
    {icon:"📊", title:"Mind Your Stats", body:"Keep an eye on Happiness, Health, Smarts, Looks and more. Look after them to live well — and long."},
    {icon:"🧭", title:"Take Charge", body:"Use the bottom tabs — Career, Assets, Relationships and Activities — to study, work, invest, love and explore."},
  ];
  let i=0;
  (function show(){
    if(i>=steps.length){ localStorage.setItem("lf_tutorial_done","1"); return; }
    const s=steps[i++]; const last=i>=steps.length;
    openPanel({icon:s.icon, title:s.title, bodyHTML:`<p>${s.body}</p>`, choices:[
      {label: last?"Start Living":"Next", primary:true, fn:()=>{ if(window.LF)LF.sfx("click"); closePanel(); show(); }},
      {label:"Skip", fn:()=>{ localStorage.setItem("lf_tutorial_done","1"); closePanel(); }},
    ]});
  })();
};

/* ============================================================
   PRISON LIFE PANEL  (surfaced from Career when incarcerated)
   ============================================================ */
function prisonPanel(){
  if(!G.s.inPrison){ toast("You're not incarcerated."); return; }
  G.s.prison = G.s.prison || {behavior:50, gang:false};
  const pr=G.s.prison;
  let html=`<p style="color:var(--text-dim);font-size:12px">Sentence: ${G.s.prisonYears} year(s) left · Behavior ${Math.round(pr.behavior)}%${pr.gang?" · 🩸 Gang member":""}</p>`;
  html+=`<div class="section-head">Daily Life</div>`;
  html+=rowHTML("🏋️","Hit the Yard","Build fitness (small risk)",[{txt:"Workout", id:"pr_yard"}]);
  html+=rowHTML("📚","Library Program","Study and stay sharp",[{txt:"Study", id:"pr_library"}]);
  html+=`<div class="section-head">Inmate Politics</div>`;
  if(pr.gang) html+=rowHTML("🩸","Your Crew","Protection, but heat",[{txt:"Run with them", id:"pr_gang"}]);
  else html+=rowHTML("🩸","Join a Gang","Protection at a price",[{txt:"Join", id:"pr_gang"}]);
  html+=rowHTML("📦","Contraband Hustle","Risky prison cash",[{txt:"Hustle", id:"pr_hustle"}]);
  html+=`<div class="section-head">Getting Out</div>`;
  html+=rowHTML("😇","Good Behavior","Earn parole credit",[{txt:"Behave", id:"pr_behave"}]);
  html+=rowHTML("⚖️","Parole Hearing","Plead for early release",[{txt:"Request", id:"pr_parole"}]);
  html+=rowHTML("🔓","Attempt Escape","Very risky minigame",[{txt:"Escape", id:"pr_escape"}]);
  openPanel({icon:"⛓️", title:"Prison Life", bodyHTML:html});
  wireRowActions(handlePrisonAction);
}
function handlePrisonAction(id){
  if(!G.s.inPrison){ closePanel(); return; }
  const pr=G.s.prison;
  if(id==="pr_yard"){
    changeStat("fitness",rand(3,7)); changeStat("health",2);
    if(chance(0.18)){ changeStat("health",-rand(4,9)); changeStat("happiness",-3); pr.behavior=clamp(pr.behavior-5); log("🥊 A yard fight broke out — you took some hits.","bad","Prison"); }
    else toast("💪 Solid workout.");
    return prisonPanel();
  }
  if(id==="pr_library"){ changeStat("smarts",rand(2,5)); pr.behavior=clamp(pr.behavior+3); toast("📚 You studied."); return prisonPanel(); }
  if(id==="pr_gang"){
    if(pr.gang){ if(chance(0.3)){ changeStat("health",-rand(3,8)); log("🩸 Crew business turned violent.","bad","Prison"); } else { G.s.notoriety=(G.s.notoriety||0)+2; toast("Your crew has your back."); } return prisonPanel(); }
    pr.gang=true; pr.behavior=clamp(pr.behavior-12); G.s.notoriety=(G.s.notoriety||0)+8;
    log("🩸 You joined a prison gang. Safer inside — but the law's watching.","info","Prison");
    return prisonPanel();
  }
  if(id==="pr_hustle"){
    if(pr.lastHustleAge===G.s.age){ toast("Lay low — you've hustled enough this year."); return; }
    pr.lastHustleAge=G.s.age;
    if(chance(pr.gang?0.7:0.5)){ const cash=rand(200,900); adjustMoney(cash); G.s.notoriety=(G.s.notoriety||0)+2; log(`📦 Your contraband hustle netted ${fmtMoney(cash)}.`,"money","Prison"); }
    else { G.s.prisonYears+=1; pr.behavior=clamp(pr.behavior-15); changeStat("happiness",-6); log("🚨 You got caught hustling — a year added to your sentence.","bad","Prison"); }
    renderAll(); return prisonPanel();
  }
  if(id==="pr_behave"){
    if(pr.lastBehaveAge===G.s.age){ toast("You've already been a model inmate this year."); return; }
    pr.lastBehaveAge=G.s.age; pr.behavior=clamp(pr.behavior+rand(8,15)); changeStat("happiness",-2);
    toast("😇 Model prisoner behavior noted.");
    return prisonPanel();
  }
  if(id==="pr_parole"){
    if(pr.lastParoleAge===G.s.age){ toast("Your next hearing is next year."); return; }
    pr.lastParoleAge=G.s.age;
    const chanceOut=clamp(pr.behavior/100*0.6 + Math.max(0,G.s.karma)/400 - (pr.gang?0.15:0), 0.05, 0.85);
    if(Math.random()<chanceOut){ G.s.inPrison=false; G.s.prisonYears=0; changeStat("happiness",15); log("⚖️ Parole granted — you're a free person again!","good","Prison"); closePanel(); renderAll(); }
    else { changeStat("happiness",-5); log("⚖️ Parole denied. Better luck next year.","bad","Prison"); renderAll(); prisonPanel(); }
    return;
  }
  if(id==="pr_escape"){ closePanel(); if(typeof prisonBreakGame==="function") prisonBreakGame(); return; }
  closePanel(); renderAll();
}

/* ============================================================
   PET CARE PANEL  (surfaced from Relationships)
   ============================================================ */
function petPanel(){
  G.s.pets.forEach(p=>{ if(p.bond==null)p.bond=60; if(p.tricks==null)p.tricks=0; if(p.trophies==null)p.trophies=0; });
  let html=`<p style="color:var(--text-dim);font-size:12px">${G.s.pets.length} companion(s) · Cash ${fmtMoney(G.s.money)}</p>`;
  if(!G.s.pets.length) html+=`<p style="color:var(--text-dim)">You don't have any pets yet.</p>`;
  G.s.pets.forEach(p=>{
    html+=`<div class="list-row"><div class="lr-ico" style="font-size:26px">${p.icon}</div><div class="lr-main"><div class="lr-title">${p.name} <span class="tag-pill">Lv ${p.level}</span></div><div class="lr-sub">${p.breed} · ${p.tricks} trick(s) · ${p.trophies} 🏆 · bond ${Math.round(p.bond)}%</div><div class="mini-bar"><div style="width:${p.bond}%;background:${statColor(p.bond)}"></div></div></div><div style="display:flex;flex-direction:column;gap:4px"><button class="lr-action" data-act="pet_feed_${p.uid}">Feed</button><button class="lr-action" data-act="pet_play_${p.uid}">Play</button></div></div>`;
    html+=`<div class="row-flex" style="justify-content:flex-start;margin:-2px 0 8px 0"><button class="lr-action secondary" data-act="pet_train_${p.uid}">Teach trick</button><button class="lr-action secondary" data-act="pet_vet_${p.uid}">Vet visit</button><button class="lr-action" data-act="pet_show_${p.uid}">Pet show</button></div>`;
  });
  html+=`<div class="section-head">Adopt</div>`;
  html+=rowHTML("🐾","Adopt a Pet","From the shelter · $300",[{txt:"Adopt", id:"pet_adopt"}]);
  openPanel({icon:"🐾", title:"Pet Care", bodyHTML:html});
  wireRowActions(handlePetAction);
}
function petBy(uid){ return G.s.pets.find(p=>p.uid===uid); }
function handlePetAction(id){
  if(id==="pet_adopt"){
    if(G.s.money<300){ toast("Adoption fee is $300."); return; }
    adjustMoney(-300); spawnPet(); changeStat("happiness",6);
    log("🐾 You adopted a new pet!","good","Pets"); renderAll(); return petPanel();
  }
  const m=id.match(/^pet_(feed|play|train|vet|show)_(.+)$/); if(!m){ closePanel(); return; }
  const act=m[1], p=petBy(m[2]); if(!p){ return petPanel(); }
  if(act==="feed"){ if(G.s.money<20){ toast("You need $20 for food."); return; } adjustMoney(-20); p.bond=clamp(p.bond+rand(3,7)); changeStat("happiness",2); toast(`${p.name} happily munched away.`); }
  else if(act==="play"){ p.bond=clamp(p.bond+rand(5,10)); changeStat("happiness",rand(3,6)); changeStat("fitness",1); toast(`You played with ${p.name}! 🐾`); }
  else if(act==="train"){ if(p.bond<30){ toast(`${p.name} needs more bonding first.`); return; } p.tricks++; if(p.tricks%2===0) p.level++; p.bond=clamp(p.bond+2); changeStat("happiness",3); log(`🎓 ${p.name} learned a new trick! (${p.tricks} total)`,"good","Pets"); }
  else if(act==="vet"){ const fee=Math.round(200*G.s.wealthFactor); if(G.s.money<fee){ toast(`A vet visit costs ${fmtMoney(fee)}.`); return; } adjustMoney(-fee); p.bond=clamp(p.bond+5); changeStat("happiness",2); log(`🩺 ${p.name} got a clean bill of health.`,"money","Pets"); }
  else if(act==="show"){
    if(p.lastShowAge===G.s.age){ toast(`${p.name} already competed this year.`); return; }
    p.lastShowAge=G.s.age;
    const skill=p.level*12 + p.tricks*6 + p.bond/4;
    if(Math.random()*100 < clamp(skill,5,90)){ p.trophies++; const prize=rand(300,1200); adjustMoney(prize); changeStat("happiness",10); changeStat("fame",2); log(`🏆 ${p.name} won the pet show! Prize ${fmtMoney(prize)}.`,"good","Pets"); }
    else { changeStat("happiness",-3); log(`${p.name} didn't place at the show this time.`,"info","Pets"); }
  }
  renderAll(); return petPanel();
}

/* ============================================================
   SETTINGS  — accessibility + data management (export/import).
   Opened from the main menu and the in-game menu.
   ============================================================ */
(function(){
  const SIZES=["small","normal","large"];
  function textSize(){ return localStorage.getItem("lf_textsize")||"normal"; }
  function reduceMotion(){ return localStorage.getItem("lf_reducemotion")==="on"; }
  function soundOn(){ return localStorage.getItem("lf_sound")!=="off"; }
  LF.applySettings=function(){
    const html=document.documentElement; if(!html||!html.classList) return;
    SIZES.forEach(s=> html.classList.remove("lf-text-"+s));
    if(textSize()!=="normal") html.classList.add("lf-text-"+textSize());
    html.classList.toggle("lf-reduce-motion", reduceMotion());
  };
  function saveKey(){ return (typeof SAVE_KEY!=="undefined") ? SAVE_KEY : "lifeforge_save_v2"; }

  function settingsPanel(){
    if(window.LF) LF.sfx("click");
    const sz=textSize();
    let html=`<div class="section-head">Display</div>`;
    html+=rowHTML("🔠","Text Size",`Currently: ${sz[0].toUpperCase()+sz.slice(1)}`,[{txt:"Change", id:"set_text"}]);
    html+=rowHTML("🎞️","Reduce Motion",reduceMotion()?"On — animations off":"Off — animations on",[{txt:reduceMotion()?"Turn off":"Turn on", id:"set_motion"}]);
    html+=`<div class="section-head">Audio</div>`;
    html+=rowHTML("🔊","Sound & Haptics",soundOn()?"On":"Off",[{txt:soundOn()?"Mute":"Unmute", id:"set_sound"}]);
    html+=`<div class="section-head">Your Data</div>`;
    html+=rowHTML("📤","Export Save","Download a backup file",[{txt:"Export", id:"set_export"}]);
    html+=rowHTML("📥","Import Save","Restore from a backup file",[{txt:"Import", id:"set_import"}]);
    html+=rowHTML("🗑️","Wipe All Data","Delete saves & settings",[{txt:"Wipe", id:"set_wipe"}]);
    openPanel({icon:"⚙️", title:"Settings", bodyHTML:html});
    wireRowActions(handleSettings);
  }
  LF.settingsPanel=settingsPanel;

  function handleSettings(id){
    if(id==="set_text"){ const i=(SIZES.indexOf(textSize())+1)%SIZES.length; localStorage.setItem("lf_textsize",SIZES[i]); LF.applySettings(); LF.sfx("click"); return settingsPanel(); }
    if(id==="set_motion"){ localStorage.setItem("lf_reducemotion", reduceMotion()?"off":"on"); LF.applySettings(); return settingsPanel(); }
    if(id==="set_sound"){ if(LF.toggleSound) LF.toggleSound(); return settingsPanel(); }
    if(id==="set_export"){ exportSave(); return; }
    if(id==="set_import"){ importSave(); return; }
    if(id==="set_wipe"){ confirmWipe(); return; }
    closePanel();
  }

  function exportSave(){
    try{ if(typeof saveGame==="function" && typeof G!=="undefined" && G.s) saveGame(); }catch(e){}
    const data=localStorage.getItem(saveKey());
    if(!data){ toast("No save to export yet."); return; }
    try{
      const blob=new Blob([data], {type:"application/json"});
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url; a.download="lifeforge-save-"+new Date().toISOString().slice(0,10)+".json";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      toast("📤 Save exported.");
    }catch(e){ toast("Export failed."); }
  }

  function importSave(){
    const inp=document.createElement("input");
    inp.type="file"; inp.accept="application/json,.json";
    inp.onchange=()=>{
      const file=inp.files && inp.files[0]; if(!file) return;
      const reader=new FileReader();
      reader.onload=()=>{
        try{
          const text=String(reader.result);
          const obj=JSON.parse(text); // validate
          if(!obj || typeof obj!=="object" || obj.age==null){ toast("That doesn't look like a LifeForge save."); return; }
          localStorage.setItem(saveKey(), text);
          if(typeof loadGame==="function" && loadGame()){
            closePanel();
            if(typeof startGame==="function") startGame();
            if(typeof G!=="undefined" && G.s && !G.s.alive && typeof showDeathScreen==="function") showDeathScreen();
            toast("📥 Save imported!");
          } else { toast("Could not load that save."); }
        }catch(e){ toast("Invalid save file."); }
      };
      reader.readAsText(file);
    };
    inp.click();
  }

  function confirmWipe(){
    openPanel({icon:"🗑️", title:"Wipe All Data?", bodyHTML:`<p>This permanently deletes your saved game, save slots and settings on this device. This cannot be undone.</p>`, choices:[
      {label:"Delete everything", primary:true, fn:()=>{ try{ localStorage.clear(); }catch(e){} closePanel(); if(typeof goToMenu==="function") goToMenu(); toast("All data wiped."); }},
      {label:"Cancel", fn:()=>settingsPanel()},
    ]});
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    LF.applySettings();
    const mb=document.getElementById("btnSettings"); if(mb) mb.onclick=settingsPanel;
  });
})();
