/* ============================================================
   events_politics.js — only fire while you hold office.
   Use approval (politics approval rating) and loseOffice.
   ============================================================ */
window.GAME = window.GAME || {}; window.GAME.events = window.GAME.events || [];
window.GAME.events.push(
  {id:"po_policy_tax", min:18, max:120, cond:{hasOffice:true}, icon:"🗳️", title:"Policy Vote: Taxes", text:"A bill to raise taxes for public services lands on your desk.",
    choices:[
      {label:"Vote for it", effects:{approval:-6,karma:6}, log:"You backed public services over popularity.", kind:"info"},
      {label:"Vote against it", effects:{approval:8,karma:-3}, log:"Voters loved the tax cut.", kind:"good"},
      {label:"Abstain", effects:{approval:-2}, log:"You dodged the vote. Pundits noticed.", kind:"info"},
    ]},
  {id:"po_scandal", min:18, max:120, cond:{hasOffice:true}, icon:"📉", title:"Scandal Brewing", text:"A journalist is digging into your past.",
    choices:[
      {label:"Get ahead of it", effects:{approval:-4,mental:-3}, log:"You held a press conference and owned it.", kind:"info"},
      {label:"Deny everything", effects:{}, log:"You denied it all...", kind:"info", outcomes:[{chance:0.45,effects:{approval:-25,loseOffice:true,happiness:-12},log:"The proof dropped. You were forced to resign!",kind:"bad"},{chance:0.55,effects:{approval:3},log:"The story had no legs. You survived.",kind:"good"}]},
      {label:"Bribe the journalist", cls:"danger", effects:{money:-20000,karma:-12}, log:"You paid them off...", kind:"info", outcomes:[{chance:0.3,effects:{approval:-30,loseOffice:true,jail:2},log:"The bribe leaked. Disgraced and charged!",kind:"bad"},{chance:0.7,effects:{approval:1},log:"The story quietly died.",kind:"info"}]},
    ]},
  {id:"po_debate", min:18, max:120, cond:{hasOffice:true}, icon:"🎙️", title:"Televised Debate", text:"You're facing a rival in a live debate.",
    choices:[
      {label:"Stick to the issues", effects:{}, log:"You debated the policy...", kind:"info", outcomes:[{chance:0.5+0,effects:{approval:10,fame:4},log:"Sharp and presidential — approval up!",kind:"good"},{chance:0.5,effects:{approval:-3},log:"A bit dry. Forgettable performance.",kind:"info"}]},
      {label:"Attack your rival", effects:{karma:-4}, log:"You went on the offensive...", kind:"info", outcomes:[{chance:0.5,effects:{approval:8},log:"The crowd ate it up.",kind:"good"},{chance:0.5,effects:{approval:-10},log:"It came off as desperate.",kind:"bad"}]},
    ]},
  {id:"po_donor", min:18, max:120, cond:{hasOffice:true}, icon:"💰", title:"Big Donor", text:"A wealthy donor offers a fortune — with strings attached.",
    choices:[
      {label:"Take the money", cls:"danger", effects:{money:50000,karma:-10,approval:-3}, log:"You accepted the donation and the favors owed.", kind:"money"},
      {label:"Refuse on principle", effects:{approval:6,karma:8}, log:"You stayed clean. Voters respect it.", kind:"good"},
    ]},
  {id:"po_disaster", min:18, max:120, cond:{hasOffice:true}, icon:"🚨", title:"Crisis Hits", text:"A natural disaster strikes your region. All eyes are on you.",
    choices:[
      {label:"Lead the response", effects:{approval:14,fame:6,mental:-5,money:-5000}, log:"You led from the front. A defining moment.", kind:"good"},
      {label:"Delegate it", effects:{approval:-8}, log:"You stayed in the office. Voters wanted more.", kind:"bad"},
    ]},
  {id:"po_ribbon", min:18, max:120, cond:{hasOffice:true}, icon:"🎀", title:"Ribbon Cutting", text:"A new community center is opening.",
    choices:[
      {label:"Show up and smile", effects:{approval:4,happiness:3}, log:"Great photo op. Approval ticked up.", kind:"good"},
      {label:"Skip it", effects:{approval:-2}, log:"You had better things to do.", kind:"info"},
    ]},
);
