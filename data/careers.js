/* ============================================================
   careers.js — every career path.
   edu: 0 None · 1 High School · 2 College · 3 University · 4 Grad
   base = starting salary (scaled by country wealth)
   ladder = 5 promotion ranks
   flags: fame (builds fame), fit (rewards fitness), risky (danger events)
   ============================================================ */
window.GAME = window.GAME || {};
window.GAME.careers = [
  // ---- No education required ----
  {id:"retail",   name:"Retail",          icon:"🛒", edu:0, base:24000, ladder:["Cashier","Senior Cashier","Shift Lead","Supervisor","Store Manager"]},
  {id:"food",     name:"Fast Food",       icon:"🍔", edu:0, base:21000, ladder:["Crew Member","Cook","Shift Manager","Asst. Manager","General Manager"]},
  {id:"barista",  name:"Barista",         icon:"☕", edu:0, base:23000, ladder:["Trainee","Barista","Head Barista","Café Lead","Café Owner"]},
  {id:"cleaner",  name:"Janitor",         icon:"🧹", edu:0, base:22000, ladder:["Cleaner","Senior Cleaner","Team Lead","Facilities Lead","Facilities Manager"]},
  {id:"driver",   name:"Delivery Driver", icon:"🚚", edu:0, base:28000, ladder:["Courier","Driver","Senior Driver","Route Lead","Depot Manager"]},
  {id:"trades",   name:"Construction",    icon:"🔨", edu:0, base:34000, ladder:["Laborer","Apprentice","Journeyman","Foreman","Site Manager"]},
  {id:"mechanic", name:"Mechanic",        icon:"🔧", edu:0, base:33000, ladder:["Trainee","Mechanic","Senior Mechanic","Lead Tech","Garage Owner"]},
  {id:"farmer",   name:"Farmer",          icon:"🌾", edu:0, base:30000, ladder:["Farmhand","Farmer","Senior Farmer","Farm Lead","Estate Owner"]},
  {id:"musician", name:"Musician",        icon:"🎸", edu:0, base:26000, ladder:["Busker","Gigging Musician","Recording Artist","Touring Act","Superstar"], fame:true},
  {id:"actor",    name:"Actor",           icon:"🎬", edu:0, base:30000, ladder:["Extra","Supporting","Lead Role","Star","A-Lister"], fame:true},
  {id:"influencer",name:"Influencer",     icon:"📸", edu:0, base:18000, ladder:["Nobody","Micro-Creator","Rising Star","Big Name","Mega Influencer"], fame:true},
  {id:"athlete",  name:"Pro Athlete",     icon:"⚽", edu:0, base:60000, ladder:["Reserve","Squad Player","Starter","Captain","Legend"], fame:true, fit:true},
  {id:"model",    name:"Model",           icon:"💃", edu:0, base:35000, ladder:["Catalog","Runway","Brand Face","Cover Model","Supermodel"], fame:true},
  {id:"soldier",  name:"Soldier",         icon:"🎖️", edu:0, base:38000, ladder:["Recruit","Private","Sergeant","Lieutenant","Commander"], fit:true, risky:true},

  // ---- High school ----
  {id:"office",   name:"Office Admin",    icon:"🗂️", edu:1, base:38000, ladder:["Clerk","Coordinator","Office Manager","Operations Lead","Director"]},
  {id:"police",   name:"Police Officer",  icon:"👮", edu:1, base:46000, ladder:["Cadet","Officer","Detective","Sergeant","Chief"], fit:true, risky:true},
  {id:"firefighter",name:"Firefighter",   icon:"🚒", edu:1, base:45000, ladder:["Recruit","Firefighter","Engineer","Captain","Fire Chief"], fit:true, risky:true},
  {id:"paramedic",name:"Paramedic",       icon:"🚑", edu:1, base:43000, ladder:["EMT Trainee","EMT","Paramedic","Senior Paramedic","EMS Chief"], fit:true, risky:true},
  {id:"chef",     name:"Chef",            icon:"👨‍🍳", edu:1, base:36000, ladder:["Line Cook","Chef de Partie","Sous Chef","Head Chef","Executive Chef"]},
  {id:"realtor",  name:"Real Estate",     icon:"🏘️", edu:1, base:42000, ladder:["Agent","Senior Agent","Broker","Senior Broker","Agency Owner"]},
  {id:"electrician",name:"Electrician",   icon:"⚡", edu:1, base:44000, ladder:["Apprentice","Electrician","Senior Electrician","Master Electrician","Contractor"]},

  // ---- College ----
  {id:"nurse",    name:"Nursing",         icon:"💉", edu:2, base:62000, ladder:["Nurse Aide","Registered Nurse","Charge Nurse","Nurse Manager","Chief Nursing Officer"]},
  {id:"teacher",  name:"Teaching",        icon:"📚", edu:2, base:48000, ladder:["Teaching Assistant","Teacher","Senior Teacher","Head of Dept","Principal"]},
  {id:"engineer", name:"Software Eng.",   icon:"💻", edu:2, base:85000, ladder:["Junior Dev","Engineer","Senior Engineer","Staff Engineer","CTO"]},
  {id:"finance",  name:"Finance",         icon:"📈", edu:2, base:78000, ladder:["Analyst","Associate","VP","Director","Managing Director"]},
  {id:"accountant",name:"Accountant",     icon:"🧮", edu:2, base:55000, ladder:["Junior Accountant","Accountant","Senior Accountant","Controller","CFO"]},
  {id:"journalist",name:"Journalist",     icon:"📰", edu:2, base:42000, ladder:["Intern","Reporter","Senior Reporter","Editor","Editor-in-Chief"], fame:true},
  {id:"pilot",    name:"Airline Pilot",   icon:"✈️", edu:2, base:90000, ladder:["Cadet","First Officer","Captain","Senior Captain","Chief Pilot"]},
  {id:"designer", name:"Designer",        icon:"🎨", edu:2, base:50000, ladder:["Junior Designer","Designer","Senior Designer","Art Director","Creative Director"]},

  // ---- University ----
  {id:"lawyer",   name:"Lawyer",          icon:"⚖️", edu:3, base:95000, ladder:["Paralegal","Associate","Senior Associate","Partner","Managing Partner"]},
  {id:"scientist",name:"Scientist",       icon:"🔬", edu:3, base:72000, ladder:["Lab Tech","Researcher","Senior Researcher","Lead Scientist","Director of R&D"]},
  {id:"architect",name:"Architect",       icon:"📐", edu:3, base:70000, ladder:["Junior Architect","Architect","Senior Architect","Principal","Firm Partner"]},
  {id:"politician",name:"Politician",     icon:"🏛️", edu:3, base:65000, ladder:["Aide","Councillor","Mayor","Governor","President"], fame:true},
  {id:"vet",      name:"Veterinarian",    icon:"🐾", edu:3, base:80000, ladder:["Vet Tech","Veterinarian","Senior Vet","Clinic Lead","Clinic Owner"]},

  // ---- Graduate ----
  {id:"doctor",   name:"Doctor",          icon:"🩺", edu:4, base:120000,ladder:["Intern","Resident","Physician","Specialist","Chief of Medicine"]},
  {id:"surgeon",  name:"Surgeon",         icon:"🔪", edu:4, base:160000,ladder:["Surgical Resident","Surgeon","Senior Surgeon","Chief Surgeon","Director of Surgery"]},
  {id:"dentist",  name:"Dentist",         icon:"🦷", edu:4, base:110000,ladder:["Associate Dentist","Dentist","Senior Dentist","Practice Lead","Practice Owner"]},
  {id:"professor",name:"Professor",       icon:"🎓", edu:4, base:75000, ladder:["Lecturer","Assistant Professor","Associate Professor","Professor","Dean"]},
];
