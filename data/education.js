/* ============================================================
   education.js — majors, scholarships & student finance.
   Feeds the deepened higher-education system: pick a major
   (boosts related careers), chase scholarships, take loans
   (tracked as real debt with interest), or drop out.
   eduLevels (from core.js): 0 None ·1 High School ·2 College
   ·3 University ·4 Graduate School.
   ============================================================ */
window.GAME = window.GAME || {};
window.GAME.education = {
  // Each major boosts hiring odds for the listed career ids.
  majors: [
    {id:"general",     name:"Undeclared",         icon:"📋", boosts:[]},
    {id:"cs",          name:"Computer Science",    icon:"💻", boosts:["engineer"]},
    {id:"business",    name:"Business",            icon:"📈", boosts:["finance","accountant","realtor","office"]},
    {id:"premed",      name:"Pre-Med",             icon:"🩺", boosts:["doctor","surgeon","nurse","dentist","vet"]},
    {id:"prelaw",      name:"Pre-Law",             icon:"⚖️", boosts:["lawyer","politician"]},
    {id:"arts",        name:"Fine Arts",           icon:"🎨", boosts:["designer","actor","musician","model"]},
    {id:"engineering", name:"Engineering",         icon:"📐", boosts:["architect","engineer","pilot"]},
    {id:"science",     name:"Natural Sciences",    icon:"🔬", boosts:["scientist","doctor"]},
    {id:"education",   name:"Education",           icon:"📚", boosts:["teacher","professor"]},
    {id:"journalism",  name:"Journalism & Media",  icon:"📰", boosts:["journalist","influencer"]},
  ],
  // Scholarships, checked best-first when enrolling. coverage = fraction of tuition waived.
  scholarships: [
    {id:"merit",   name:"Full Merit Scholarship", icon:"🏅", coverage:1.0,  minGpa:88, minSmarts:82},
    {id:"academic",name:"Academic Scholarship",   icon:"🎖️", coverage:0.6,  minGpa:78, minSmarts:70},
    {id:"athletic",name:"Athletic Scholarship",   icon:"🏆", coverage:0.7,  minFitness:82},
    {id:"partial", name:"Partial Grant",          icon:"📜", coverage:0.3,  minGpa:65},
  ],
  collegeYears: 3,        // years per higher-ed phase
  tuitionPerYear: 12000,  // scaled by country wealth
  loanInterest: 0.05,     // yearly interest on student debt
};
