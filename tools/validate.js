#!/usr/bin/env node
/* ============================================================
   tools/validate.js — LifeForge content & integration check.
   Loads every script (in index.html order) under a stubbed DOM,
   then asserts data integrity. Exits non-zero on any problem so
   CI fails fast. Run locally with:  node tools/validate.js
   ============================================================ */
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const fail = (msg) => { console.error("✗ " + msg); process.exitCode = 1; };
const ok = (msg) => console.log("✓ " + msg);

// ---- stubbed browser environment (boot() is deferred, so nothing runs) ----
const makeEl = () => new Proxy(
  { style:{}, classList:{ add(){}, remove(){}, toggle(){} }, dataset:{}, textContent:"", innerHTML:"",
    insertAdjacentHTML(){}, appendChild(){}, removeChild(){}, remove(){}, addEventListener(){}, removeEventListener(){}, click(){}, forEach(){} },
  { get(t,p){ return p in t ? t[p] : () => makeEl(); }, set(t,p,v){ t[p]=v; return true; } }
);
const sandbox = {};
sandbox.window = sandbox;
sandbox.document = { documentElement: makeEl(), body: makeEl(), addEventListener(){}, removeEventListener(){},
  querySelector:()=>makeEl(), querySelectorAll:()=>[], createElement:()=>makeEl(), getElementById:()=>makeEl() };
sandbox.localStorage = { _:{}, getItem(k){ return k in this._ ? this._[k] : null; }, setItem(k,v){ this._[k]=String(v); }, removeItem(k){ delete this._[k]; }, clear(){ this._={}; } };
sandbox.navigator = { vibrate:()=>true };
sandbox.console = console;
sandbox.setTimeout = ()=>0; sandbox.clearTimeout = ()=>{};
sandbox.requestAnimationFrame = ()=>0; sandbox.cancelAnimationFrame = ()=>{};
sandbox.AudioContext = function(){ return { state:"running", currentTime:0, resume(){}, createOscillator(){ return { type:"", frequency:{value:0}, connect(){}, start(){}, stop(){} }; }, createGain(){ return { gain:{ value:0, exponentialRampToValueAtTime(){} }, connect(){} }; }, destination:{} }; };
vm.createContext(sandbox);

// ---- load scripts in the exact order index.html declares them ----
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const files = ["assets/icons.js",
  ...[...html.matchAll(/<script src="(data\/[^"]+|game\.js|extras\.js)"><\/script>/g)].map(m => m[1])];

for (const f of files) {
  try { vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), sandbox, { filename: f }); }
  catch (e) { fail(`runtime error loading ${f}: ${e.message}`); process.exit(1); }
}
ok(`loaded ${files.length} scripts without runtime errors`);

const G = sandbox.window.GAME;
const ev = G.events || [];

// ---- keys the engine actually supports (keep in sync with game.js) ----
const EFFECTS = new Set(["happiness","health","smarts","looks","mental","karma","fame","fitness","money","addAddiction","addCondition","cureCondition","relAll","relRandom","relPartner","relChild","newFriend","newLover","newBaby","newPet","losePet","marryPartner","loseJob","gainPerf","raise","jail","approval","loseOffice","notoriety","followers","newRival","devotion","loseFaith"]);
const CONDS = new Set(["hasJob","noJob","inSchool","single","hasPartner","hasLover","married","hasChild","hasFriend","hasPet","moneyMin","gender","risky","career","hasOffice","immigrant","fameMin","trait","hasMilitary","hasMafia","skillMin","supernatural","hasRival","hasFaith","zodiac","ownHome","ownCar","hasBusiness","hasProperty","hasCondition","hasAddiction","eduMin","moneyMax"]);
const diseases = new Set((G.core.diseases || []).map(d => d.name));

// ---- integrity checks ----
const ids = ev.map(e => e.id);
const dups = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
if (dups.length) fail(`duplicate event ids: ${dups.join(", ")}`); else ok(`no duplicate event ids (${ev.length} events)`);

const badEff = new Set(), badCond = new Set(), badDis = new Set();
let malformed = 0;
const checkEff = (o) => {
  for (const k of Object.keys(o.effects || {})) if (!EFFECTS.has(k)) badEff.add(k);
  const a = (o.effects || {}).addCondition;
  if (typeof a === "string" && !diseases.has(a)) badDis.add(a);
};
for (const e of ev) {
  if (!e.id || !Array.isArray(e.choices) || !e.choices.length) { malformed++; continue; }
  for (const k of Object.keys(e.cond || {})) if (!CONDS.has(k)) badCond.add(k);
  for (const c of e.choices) { checkEff(c); (c.outcomes || []).forEach(checkEff); }
}
if (malformed) fail(`${malformed} malformed event(s) (missing id/choices)`); else ok("all events well-formed");
if (badEff.size) fail(`unsupported effect keys: ${[...badEff].join(", ")}`); else ok("all effect keys supported");
if (badCond.size) fail(`unsupported cond keys: ${[...badCond].join(", ")}`); else ok("all condition keys supported");
if (badDis.size) fail(`unknown named conditions: ${[...badDis].join(", ")}`); else ok("all named conditions valid");

// ---- achievements & careers sanity ----
let achErr = 0;
(G.achievements || []).forEach(a => { try { a.test({ skills:{}, people:[], investments:{} }); } catch (e) { achErr++; } });
if (achErr) fail(`${achErr} achievement test(s) threw`); else ok(`${(G.achievements||[]).length} achievement tests run cleanly`);
if (!G.careers.some(c => c.id === "paramedic")) fail("paramedic career missing");

// ---- key feature globals are wired ----
for (const fn of ["prisonPanel","petPanel","sportsCenter","handleSportsAction"]) {
  if (vm.runInContext(`typeof ${fn}`, sandbox) !== "function") fail(`global ${fn}() is missing`);
}
if (vm.runInContext(`typeof LF.settingsPanel`, sandbox) !== "function") fail("LF.settingsPanel is missing");

if (process.exitCode) { console.error("\nVALIDATION FAILED"); }
else console.log("\nAll checks passed ✅");
