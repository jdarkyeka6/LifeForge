/* ============================================================
   shop.js — everything you can buy. Placeholders (emoji icons).
   Swap in your own custom assets later; the shop reads this list.
   ============================================================ */
window.GAME = window.GAME || {};
window.GAME.shop = {
  homes: [
    {id:"trailer", name:"Trailer",          icon:"🚐", price:18000,  upkeep:300},
    {id:"studio",  name:"Studio Apartment", icon:"🏚️", price:48000,  upkeep:600},
    {id:"condo",   name:"City Condo",       icon:"🏢", price:160000, upkeep:1400},
    {id:"townhouse",name:"Townhouse",       icon:"🏘️", price:240000, upkeep:2000},
    {id:"house",   name:"Suburban House",   icon:"🏡", price:320000, upkeep:2600},
    {id:"villa",   name:"Modern Villa",     icon:"🏠", price:780000, upkeep:5200},
    {id:"penthouse",name:"Penthouse",       icon:"🌆", price:1500000,upkeep:9000},
    {id:"mansion", name:"Hillside Mansion", icon:"🏰", price:2400000,upkeep:14000},
    {id:"island",  name:"Private Island",   icon:"🏝️", price:25000000,upkeep:90000},
  ],
  cars: [
    {id:"bike",    name:"Bicycle",       icon:"🚲", price:400},
    {id:"scooter", name:"Scooter",       icon:"🛵", price:2200},
    {id:"beater",  name:"Old Beater",    icon:"🚗", price:3500},
    {id:"sedan",   name:"Family Sedan",  icon:"🚙", price:24000},
    {id:"truck",   name:"Pickup Truck",  icon:"🛻", price:38000},
    {id:"sport",   name:"Sports Car",    icon:"🏎️", price:78000},
    {id:"luxury",  name:"Luxury SUV",    icon:"🚐", price:120000},
    {id:"super",   name:"Supercar",      icon:"🏎️", price:340000},
    {id:"hyper",   name:"Hypercar",      icon:"🚓", price:2200000},
  ],
  luxury: [
    {id:"phone",   name:"Flagship Phone",icon:"📱", price:1200},
    {id:"console", name:"Game Console",  icon:"🎮", price:600},
    {id:"watch",   name:"Designer Watch",icon:"⌚", price:14000},
    {id:"jewelry", name:"Diamond Ring",  icon:"💍", price:22000},
    {id:"art",     name:"Fine Art Piece",icon:"🖼️", price:95000},
    {id:"boat",    name:"Yacht",         icon:"🛥️", price:560000},
    {id:"jet",     name:"Private Jet",   icon:"✈️", price:8000000},
    {id:"rocket",  name:"Space Trip",    icon:"🚀", price:18000000},
  ],
};
