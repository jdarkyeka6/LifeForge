/* ============================================================
   core.js — base game data (names, countries, education,
   diseases, pets, conditions). Currency is always "$".
   Edit freely — these feed straight into the game.
   ============================================================ */
window.GAME = window.GAME || {};
window.GAME.events = window.GAME.events || [];

window.GAME.core = {
  maleNames: ["James","Liam","Noah","Ethan","Mason","Lucas","Oliver","Aiden","Caleb","Felix","Marcus","Theo","Hugo","Dmitri","Kenji","Omar","Diego","Sven","Ravi","Cole","Leo","Max","Isaac","Julian","Adrian","Carlos","Mateo","Finn","Jasper","Elias","Hassan","Tobias","Andre","Victor","Nico","Soren","Malik","Reuben","Dante","Kai"],
  femaleNames: ["Emma","Olivia","Ava","Sophia","Isla","Mia","Luna","Nora","Zoe","Freya","Aria","Maya","Ines","Yuki","Amara","Priya","Lena","Sofia","Clara","Ruby","Hazel","Ivy","Elena","Nadia","Layla","Greta","Carmen","Anya","Talia","Esme","Fatima","Sienna","Daria","Noor","Wren","Cora","Mei","Rosa","Saoirse","Beatriz"],
  neutralNames: ["Alex","Sam","Jordan","Riley","Casey","Quinn","Avery","Sky","River","Rowan","Sage","Phoenix","Charlie","Frankie","Morgan","Remy","Blair","Eden","Ari","Marlowe"],
  surnames: ["Walker","Reed","Hayes","Stone","Brooks","Vance","Cole","Frost","Quinn","Marsh","Bishop","Cross","Lane","Webb","Hart","Pierce","Knight","Day","Wolfe","Sterling","Okafor","Nakamura","Petrov","Khan","Mendez","Larsen","Costa","Singh","Romano","Fischer","Bauer","Delgado","Novak","Haddad","Yamamoto","Adebayo","Kovac","Rossi","Bjornsson","Chen","Patel","Murphy","Schneider","Ferreira","Ivanov","Tanaka","Diallo","Andersson","Moreau","Kim"],
  // Currency now always "$". wealth = internal salary scaling per country.
  countries: [
    {name:"United States",flag:"🇺🇸",wealth:1.0},
    {name:"United Kingdom",flag:"🇬🇧",wealth:0.95},
    {name:"Canada",flag:"🇨🇦",wealth:0.9},
    {name:"Australia",flag:"🇦🇺",wealth:0.95},
    {name:"Germany",flag:"🇩🇪",wealth:0.95},
    {name:"Japan",flag:"🇯🇵",wealth:0.9},
    {name:"Brazil",flag:"🇧🇷",wealth:0.55},
    {name:"India",flag:"🇮🇳",wealth:0.45},
    {name:"Nigeria",flag:"🇳🇬",wealth:0.4},
    {name:"France",flag:"🇫🇷",wealth:0.92},
    {name:"Mexico",flag:"🇲🇽",wealth:0.5},
    {name:"South Korea",flag:"🇰🇷",wealth:0.88},
    {name:"Italy",flag:"🇮🇹",wealth:0.82},
    {name:"Spain",flag:"🇪🇸",wealth:0.8},
    {name:"Sweden",flag:"🇸🇪",wealth:0.93},
    {name:"South Africa",flag:"🇿🇦",wealth:0.5},
  ],
  eduLevels: ["None","High School","Community College","University","Graduate School"],
  diseases: [
    {name:"the flu", kind:"physical", minor:true},
    {name:"a broken arm", kind:"physical", minor:true},
    {name:"a broken leg", kind:"physical", minor:true},
    {name:"anxiety", kind:"mental", minor:false},
    {name:"depression", kind:"mental", minor:false},
    {name:"insomnia", kind:"mental", minor:true},
    {name:"an infection", kind:"physical", minor:true},
    {name:"high blood pressure", kind:"physical", minor:false},
    {name:"migraines", kind:"physical", minor:true},
    {name:"appendicitis", kind:"physical", minor:true},
    {name:"asthma", kind:"physical", minor:false},
    {name:"a stomach ulcer", kind:"physical", minor:true},
    {name:"chronic back pain", kind:"physical", minor:false},
    {name:"an eating disorder", kind:"mental", minor:false},
    {name:"burnout", kind:"mental", minor:true},
  ],
  pets: [
    {id:"dog",name:"Dog",icon:"🐶"},{id:"cat",name:"Cat",icon:"🐱"},
    {id:"hamster",name:"Hamster",icon:"🐹"},{id:"parrot",name:"Parrot",icon:"🦜"},
    {id:"rabbit",name:"Rabbit",icon:"🐰"},{id:"snake",name:"Snake",icon:"🐍"},
    {id:"fish",name:"Goldfish",icon:"🐠"},{id:"horse",name:"Horse",icon:"🐴"},
    {id:"turtle",name:"Turtle",icon:"🐢"},{id:"lizard",name:"Lizard",icon:"🦎"},
  ],
  traits: ["kind","funny","ambitious","lazy","honest","jealous","loyal","wild","caring","stubborn","generous","selfish","adventurous","shy","hot-headed","calm","creative","clever","clumsy","charming"],
};
