/* ============================================================
   events_career.js — work life (most require a job).
   ============================================================ */
window.GAME = window.GAME || {}; window.GAME.events = window.GAME.events || [];
window.GAME.events.push(
  {id:"cr_overtime", min:18, max:70, cond:{hasJob:true}, icon:"⏰", title:"Overtime", text:"Your boss offers extra hours for bonus pay.",
    choices:[
      {label:"Take the overtime", effects:{money:1500,gainPerf:5,happiness:-3,mental:-2}, log:"You earned a bonus, but you're tired.", kind:"money"},
      {label:"Protect your evenings", effects:{happiness:4,mental:2}, log:"Work-life balance wins.", kind:"good"},
    ]},
  {id:"cr_creditstolen", min:20, max:60, cond:{hasJob:true}, icon:"😤", title:"Stolen Credit", text:"A coworker took credit for your big idea.",
    choices:[
      {label:"Call them out publicly", effects:{}, log:"You spoke up in the meeting...", kind:"info", outcomes:[{chance:0.5,effects:{gainPerf:8,happiness:4},log:"The boss sided with you!",kind:"good"},{chance:0.5,effects:{gainPerf:-6,mental:-4},log:"It looked petty. Backfired.",kind:"bad"}]},
      {label:"Let it slide", effects:{mental:-5}, log:"You seethed quietly.", kind:"bad"},
      {label:"Plot revenge", cls:"danger", effects:{karma:-6}, log:"You schemed against them...", kind:"info", outcomes:[{chance:0.4,effects:{loseJob:true},log:"You got caught and fired.",kind:"bad"},{chance:0.6,effects:{happiness:4},log:"Sweet, petty revenge.",kind:"info"}]},
    ]},
  {id:"cr_raise", min:20, max:65, cond:{hasJob:true}, icon:"💰", title:"Asking for a Raise", text:"You feel underpaid. Do you ask?",
    choices:[
      {label:"Ask confidently", effects:{}, log:"You marched into the office...", kind:"info", outcomes:[{chance:0.45,effects:{raise:0.12,happiness:8},log:"You got a 12% raise! 💸",kind:"money"},{chance:0.55,effects:{happiness:-4},log:"\"Maybe next quarter.\"",kind:"info"}]},
      {label:"Stay quiet", effects:{mental:-2}, log:"You didn't rock the boat.", kind:"info"},
    ]},
  {id:"cr_layoffs", min:20, max:60, cond:{hasJob:true}, icon:"📉", title:"Layoff Rumors", text:"The company is making cuts.",
    choices:[
      {label:"Work extra hard", effects:{gainPerf:8,mental:-4}, log:"You proved your value.", kind:"good"},
      {label:"Update your resume", effects:{smarts:2}, log:"Always have a plan B.", kind:"info", outcomes:[{chance:0.3,effects:{loseJob:true,happiness:-8},log:"You got laid off anyway.",kind:"bad"}]},
    ]},
  {id:"cr_officeparty", min:20, max:65, cond:{hasJob:true}, icon:"🥳", title:"Office Party", text:"It's the annual work party.",
    choices:[
      {label:"Network with the boss", effects:{gainPerf:6,happiness:3}, log:"You made a great impression.", kind:"good"},
      {label:"Hit the open bar", effects:{happiness:6,health:-2}, log:"Fun night...", kind:"info", outcomes:[{chance:0.25,effects:{gainPerf:-8,happiness:-6},log:"You embarrassed yourself badly.",kind:"bad"}]},
      {label:"Leave early", effects:{mental:2}, log:"Not your scene.", kind:"info"},
    ]},
  {id:"cr_mentor", min:22, max:60, cond:{hasJob:true}, icon:"🧑‍🏫", title:"A Mentor", text:"A senior colleague offers to mentor you.",
    choices:[
      {label:"Accept eagerly", effects:{smarts:4,gainPerf:8,happiness:4}, log:"You're learning fast.", kind:"good"},
      {label:"Decline politely", effects:{}, log:"You'd rather figure it out solo.", kind:"info"},
    ]},
  {id:"cr_quitdream", min:22, max:55, cond:{hasJob:true,moneyMin:3000}, icon:"🚀", title:"Chase the Dream", text:"You dream of starting your own business.",
    choices:[
      {label:"Take the leap", effects:{loseJob:true,money:-3000,happiness:8,mental:-4}, log:"You quit to start a business...", kind:"info", outcomes:[{chance:0.35,effects:{money:15000,happiness:10,fame:4},log:"Your startup is taking off!",kind:"money"},{chance:0.65,effects:{happiness:-10,mental:-6},log:"The business flopped. Tough lesson.",kind:"bad"}]},
      {label:"Keep dreaming", effects:{mental:-2}, log:"Maybe someday.", kind:"info"},
    ]},
  {id:"cr_bribe", min:25, max:60, cond:{hasJob:true}, icon:"💵", title:"Under the Table", text:"A client offers you a cash bribe to bend the rules.",
    choices:[
      {label:"Take it", cls:"danger", effects:{money:8000,karma:-12}, log:"You pocketed the cash...", kind:"money", outcomes:[{chance:0.3,effects:{loseJob:true,jail:1},log:"You got caught. Fired and charged!",kind:"bad"}]},
      {label:"Refuse & report it", effects:{karma:10,gainPerf:6}, log:"Your integrity was noticed.", kind:"good"},
    ]},
  {id:"cr_riskyjob", min:18, max:60, cond:{hasJob:true,risky:true}, icon:"🚨", title:"Line of Duty", text:"A dangerous situation unfolds on the job.",
    choices:[
      {label:"Act heroically", effects:{}, log:"You charged in...", kind:"info", outcomes:[{chance:0.6,effects:{fame:8,happiness:8,gainPerf:10,karma:6},log:"You're a hero! Commended for bravery.",kind:"good"},{chance:0.4,effects:{health:-22,addCondition:true,mental:-6},log:"You were seriously injured.",kind:"bad"}]},
      {label:"Play it safe", effects:{gainPerf:-4}, log:"You followed protocol.", kind:"info"},
    ]},
  {id:"cr_award", min:25, max:65, cond:{hasJob:true}, icon:"🏆", title:"Employee of the Year", text:"You're nominated for a company award.",
    choices:[{label:"Accept graciously", effects:{}, log:"The votes are in...", kind:"info", outcomes:[{chance:0.5,effects:{gainPerf:10,happiness:10,money:2000},log:"🏆 You won, with a cash prize!",kind:"money"},{chance:0.5,effects:{happiness:2},log:"Runner-up. Still an honor.",kind:"info"}]}]},
  {id:"cr_commute", min:20, max:60, cond:{hasJob:true}, icon:"🚆", title:"Brutal Commute", text:"Your daily commute is wearing you down.",
    choices:[
      {label:"Move closer to work", effects:{money:-2000,mental:6,happiness:4}, log:"Shorter commute, happier you.", kind:"good"},
      {label:"Negotiate remote work", effects:{}, log:"You asked to work from home...", kind:"info", outcomes:[{chance:0.5,effects:{mental:8,happiness:6},log:"Approved! Goodbye traffic.",kind:"good"},{chance:0.5,effects:{mental:-3},log:"Denied. Back to the grind.",kind:"info"}]},
      {label:"Suffer through it", effects:{mental:-4}, log:"Another year of gridlock.", kind:"bad"},
    ]},
  {id:"cr_sideproject", min:20, max:60, cond:{hasJob:true}, icon:"💡", title:"Side Hustle", text:"You have an idea for a side hustle.",
    choices:[
      {label:"Build it nights & weekends", effects:{mental:-4,smarts:3}, log:"You hustled hard...", kind:"info", outcomes:[{chance:0.45,effects:{money:4000,happiness:6},log:"Your side hustle is making money!",kind:"money"},{chance:0.55,effects:{happiness:-3},log:"It fizzled out. Good experience though.",kind:"info"}]},
      {label:"Focus on the day job", effects:{gainPerf:4}, log:"One thing at a time.", kind:"info"},
    ]},
);
