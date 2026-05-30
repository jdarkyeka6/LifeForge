/* ============================================================
   events_lawsuit.js — civil court & litigation.
   Extends events_legal.js with the lawsuits YOU bring and the
   bigger civil cases (malpractice, custody, settlements).
   ============================================================ */
window.GAME = window.GAME || {}; window.GAME.events = window.GAME.events || [];
window.GAME.events.push(

  {id:"lw_slip_fall", min:18, max:100, weight:0.8, icon:"🛒", title:"Slip and Fall", text:"You slip on an unmarked wet floor at a big store and hurt your back.",
    choices:[
      {label:"Sue for damages", effects:{addCondition:"chronic back pain"}, log:"You lawyered up.", kind:"info",
        outcomes:[{chance:0.6,effects:{money:18000,happiness:4},log:"The store settled out of court. Cha-ching.",kind:"money"},{chance:0.4,effects:{money:-1500,mental:-3},log:"You lost — and ate the legal fees.",kind:"bad"}]},
      {label:"Just walk it off", effects:{health:-4}, log:"You limped home and let it go.", kind:"info"},
    ]},

  {id:"lw_malpractice", min:30, max:100, weight:0.6, icon:"⚕️", title:"Medical Malpractice", cond:{hasCondition:true},
    text:"You learn a doctor's mistake worsened your condition.",
    choices:[
      {label:"File a malpractice suit", effects:{mental:-3}, log:"You took on the hospital's lawyers.", kind:"info",
        outcomes:[{chance:0.5,effects:{money:60000,happiness:5},log:"A major settlement in your favor.",kind:"money"},{chance:0.5,effects:{money:-4000,mental:-5},log:"They out-lawyered you. Costly defeat.",kind:"bad"}]},
      {label:"Let it go", effects:{mental:-2}, log:"You didn't have the fight in you.", kind:"info"},
    ]},

  {id:"lw_custody", min:25, max:70, weight:0.9, icon:"👨‍👧", title:"Custody Battle", cond:{hasChild:true,single:true},
    text:"Your ex is fighting for full custody of {child}.",
    choices:[
      {label:"Fight for joint custody", effects:{money:-7000,mental:-6}, log:"A draining legal battle for your kid.", kind:"info",
        outcomes:[{chance:0.6,effects:{relChild:10,happiness:6},log:"The court granted you joint custody.",kind:"good"},{chance:0.4,effects:{relChild:-6,mental:-8},log:"You only got weekend visits. Heartbreaking.",kind:"bad"}]},
      {label:"Agree to their terms peacefully", effects:{karma:4,mental:-4,relChild:-3}, log:"You avoided a war for {child}'s sake.", kind:"info"},
    ]},

  {id:"lw_celeb_suit", min:20, max:100, weight:0.5, icon:"🌟", title:"Sued by a Celebrity", cond:{fameMin:30},
    text:"A celebrity claims you defamed them in a post and is suing for a fortune.",
    choices:[
      {label:"Hire a top defamation lawyer", effects:{money:-10000}, log:"You assembled a legal dream team.", kind:"money",
        outcomes:[{chance:0.6,effects:{fame:3,happiness:4},log:"Case dismissed — and you looked great doing it.",kind:"good"},{chance:0.4,effects:{money:-25000,fame:-4},log:"You settled for a painful sum.",kind:"bad"}]},
      {label:"Issue a public apology", effects:{fame:-2,karma:2}, log:"You swallowed your pride and apologized.", kind:"info"},
    ]},

  {id:"lw_patent_troll", min:24, max:100, weight:0.5, icon:"📜", title:"Patent Troll", cond:{hasBusiness:true},
    text:"A 'patent-holding company' claims your product infringes their patent.",
    choices:[
      {label:"Fight it in court", effects:{money:-6000,smarts:2}, log:"You refused to be shaken down.", kind:"info",
        outcomes:[{chance:0.6,effects:{money:3000,fame:1},log:"You exposed them as trolls and won costs.",kind:"good"},{chance:0.4,effects:{money:-9000},log:"The court sided with them. Expensive.",kind:"bad"}]},
      {label:"Pay the licensing 'fee'", effects:{money:-8000,mental:-3}, log:"You paid to make it disappear.", kind:"money"},
    ]},

  {id:"lw_frivolous", min:22, max:100, weight:0.6, icon:"😤", title:"Frivolous Lawsuit", cond:{moneyMin:5000},
    text:"Someone is suing you over something absurd — they claim your dog 'emotionally traumatized' them.",
    choices:[
      {label:"Counter-sue for harassment", effects:{}, log:"Two can play that game.", kind:"info",
        outcomes:[{chance:0.55,effects:{money:4000,happiness:5},log:"The judge tossed their case and awarded you costs.",kind:"money"},{chance:0.45,effects:{money:-3000,mental:-3},log:"It dragged on and drained you.",kind:"bad"}]},
      {label:"Settle for a small sum", effects:{money:-1500}, log:"Cheaper than the headache.", kind:"money"},
    ]},

  {id:"lw_class_payout", min:20, max:100, weight:0.6, icon:"💼", title:"Class Action Payout", text:"You're part of a class-action suit against a company that wronged customers.",
    choices:[
      {label:"Accept the settlement check", effects:{money:1200,happiness:2}, log:"A modest check arrived in the mail.", kind:"money"},
      {label:"Opt out and sue alone", effects:{}, log:"You went solo for a bigger payday.", kind:"info",
        outcomes:[{chance:0.4,effects:{money:9000,smarts:2},log:"Risky, but you won far more alone!",kind:"good"},{chance:0.6,effects:{money:-800},log:"You got nothing and paid filing fees.",kind:"bad"}]},
    ]},

  {id:"lw_will_dispute", min:35, max:100, weight:0.6, icon:"📃", title:"Contested Will", text:"A relative passed away, but the family is fighting over the will.",
    choices:[
      {label:"Lawyer up for your share", effects:{money:-2500,relAll:-4}, log:"You fought your own family in court.", kind:"info",
        outcomes:[{chance:0.5,effects:{money:30000},log:"You won a sizeable inheritance.",kind:"money"},{chance:0.5,effects:{mental:-5},log:"You won the case but lost the family.",kind:"bad"}]},
      {label:"Step back and keep the peace", effects:{karma:6,relAll:4}, log:"You chose family over money.", kind:"good"},
    ]},

);
