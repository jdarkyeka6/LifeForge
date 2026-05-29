/* ============================================================
   icons.js — LifeForge's OWN icon set.
   Original flat-rounded SVG artwork (no emoji). House palette.
   Usage:  iconHTML("house")  or  iconHTML("🏠")  -> <svg>…</svg>
           faceSVG("happy")   -> reactive character face
   Add a new icon: drop an entry in ICONS, then (optionally) map
   any emoji to it in EMOJI_MAP. Unknown tokens fall back to a star.
   ============================================================ */
(function(){
  // palette
  const A="#2ec27e", A2="#1f9e63", D="#27313f", DD="#1b232e", L="#e8edf3",
        G="#f2c14e", R="#ef5350", B="#4c8dff", P="#b07cff", PK="#ff8fa3",
        SK="#f0c08a", BR="#7a4a2b", GY="#9aa7b6", W="#ffffff", BL="#5b3a29";
  const r=(x,y,w,h,rx,f)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}"/>`;
  const c=(cx,cy,rad,f)=>`<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${f}"/>`;
  const p=(d,f)=>`<path d="${d}" fill="${f}"/>`;
  const ln=(d,s,w=1.8)=>`<path d="${d}" fill="none" stroke="${s}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

  // ---- icon artwork (inner markup, 24x24 canvas) ----
  const ICONS = {
    // stats
    smile:  c(12,12,9,G)+c(9,10.5,1.3,D)+c(15,10.5,1.3,D)+ln("M8.2 14Q12 17.5 15.8 14",D,1.8),
    heart:  p("M12 20.5S3.5 15 3.5 9.2A4.4 4.4 0 0112 6.6 4.4 4.4 0 0120.5 9.2C20.5 15 12 20.5 12 20.5Z",R),
    brain:  p("M10 4.2A3.2 3.2 0 006.9 7 3.1 3.1 0 005.6 12.8 3.1 3.1 0 007.6 18 2.7 2.7 0 0010.4 19.6 1 1 0 0011 18.7V5.2A1 1 0 0010 4.2Z",P)+p("M13.6 4.2A3.2 3.2 0 0116.7 7 3.1 3.1 0 0118 12.8 3.1 3.1 0 0116 18 2.7 2.7 0 0113.2 19.6 1 1 0 0112.6 18.7V5.2A1 1 0 0113.6 4.2Z","#9d6be8"),
    star:   p("M12 2.8l2.5 5.6 6 .6-4.5 4 1.3 5.9L12 21.4 6.7 18.9 8 13 3.5 9l6-.6z",G),
    leaf:   p("M5.5 19C5.5 10.5 12 4.6 19.5 4.6 19.5 13 13 19 5.5 19Z",A)+ln("M8.5 16C11 12.5 14 10 17.5 8.2",A2,1.6),
    // nav
    briefcase: r(3.5,8,17,11,2.5,A)+r(8.5,5,7,3.5,1.5,A2)+r(3.5,12,17,2,0,A2),
    house:  p("M12 3.5 21 11v9.5H3V11z",A)+r(10,14,4,6,1,DD)+p("M12 3.5 21 11H3z","#2ab574"),
    people: c(8.5,9,3,A)+c(15.5,9,3,A2)+p("M3 20c0-3.3 2.5-5.5 5.5-5.5S14 16.7 14 20z",A)+p("M11 20c0-3.3 2.5-5.5 5.5-5.5S22 16.7 22 20z",A2),
    target: c(12,12,9,A)+c(12,12,6,DD)+c(12,12,3.2,A)+c(12,12,1.2,W),
    // money / misc ui
    coin:   c(12,12,9,G)+c(12,12,6.6,"#e0a92e")+`<text x="12" y="16" font-size="9" font-weight="800" text-anchor="middle" fill="${DD}" font-family="Segoe UI,sans-serif">$</text>`,
    cash:   r(3,7,18,10,2,A)+c(12,12,3,G)+r(3,7,3,10,0,A2)+r(18,7,3,10,0,A2),
    // categories / objects
    food:   p("M12 4c-3 0-5 2.2-5 5h10c0-2.8-2-5-5-5z",R)+r(6,9,12,2,1,L)+p("M7 12c.6 4 1.8 7 5 7s4.4-3 5-7z","#ffb3b3"),
    car:    p("M4 14l1.6-4A3 3 0 018.4 8h7.2a3 3 0 012.8 2l1.6 4z",B)+r(3,13,18,5,2,"#3f78e0")+c(7.5,18.5,1.8,D)+c(16.5,18.5,1.8,D),
    bike:   c(6.5,16,4,GY)+c(17.5,16,4,GY)+ln("M6.5 16 11 8h4l2.5 8M11 8l3 8",A,1.8),
    gift:   r(4,10,16,9,2,A)+r(3.5,7.5,17,3.5,1.5,A2)+r(11,7.5,2,11.5,0,G)+p("M12 7.5C10 4 6.5 5 8 7.5zM12 7.5C14 4 17.5 5 16 7.5z",G),
    ring:   c(12,14,5.5,G)+c(12,14,3.2,DD)+p("M9.5 8 12 4l2.5 4z",B),
    baby:   c(12,12,8,SK)+c(9.5,12,1.1,D)+c(14.5,12,1.1,D)+ln("M10 15h4",D,1.4)+p("M6 9a6 6 0 0112 0z","#cfe3ff"),
    person: c(12,8,4,GY)+p("M4.5 20c0-4.2 3.4-7 7.5-7s7.5 2.8 7.5 7z",GY),
    paw:    c(8,9,2,A)+c(16,9,2,A)+c(5.5,13,1.7,A)+c(18.5,13,1.7,A)+p("M12 12c3 0 5 2.4 5 4.6S14.5 20 12 20s-5-1.2-5-3.4S9 12 12 12z",A),
    dog:    p("M5 8c0-2 1-4 3-3l1.5 2h5L21 5c2-1 3 1 3 3 0 0-1 2-3 2v6a3 3 0 01-3 3H8a3 3 0 01-3-3V10C3 10 2 8 2 8z",BR)+c(9.5,12,1.1,D)+c(14.5,12,1.1,D)+c(12,15,1.4,D),
    cat:    p("M5 9 4 4l4 3h8l4-3-1 5v6a3 3 0 01-3 3H8a3 3 0 01-3-3z","#8a8f98")+c(9.5,12,1.1,D)+c(14.5,12,1.1,D)+ln("M12 14v1.5M9 16h6",D,1.2),
    medical:c(12,12,9,W)+p("M10.5 6h3v3.5H17v3h-3.5V16h-3v-3.5H7v-3h3.5z",R),
    cross:  c(12,12,9,A)+p("M10.5 6h3v3.5H17v3h-3.5V16h-3v-3.5H7v-3h3.5z",W),
    dumbbell: r(2,10,3,4,1,A)+r(5,8,2.5,8,1,A2)+r(7,11,10,2,1,GY)+r(17.5,8,2.5,8,1,A2)+r(19,10,3,4,1,A),
    drama:  p("M4 5h7v6a3.5 3.5 0 01-7 0z",G)+p("M13 5h7v6a3.5 3.5 0 01-7 0z",B)+c(6.5,8,.8,D)+c(8.5,8,.8,D)+c(15.5,8,.8,D)+c(17.5,8,.8,D),
    camera: r(3,8,18,12,3,D)+r(8,5.5,8,3.5,1.5,D)+c(12,14,3.6,A)+c(12,14,1.8,L),
    music:  c(8,17,2.5,A)+c(17,15,2.5,A2)+r(10,6,2,11,0,A)+r(19,6,2,9,0,A2)+r(10,6,11,2.5,1,A),
    ball:   c(12,12,9,W)+p("M12 4l2.5 2-1 3h-3l-1-3z",D)+p("M5 11l3 .5 1 3-2 2.2z",D)+p("M19 11l-3 .5-1 3 2 2.2z",D),
    palette:p("M12 3a9 9 0 000 18c1.5 0 2-1 2-2 0-1.5 1-2 2.5-2H18a3 3 0 003-3c0-5-4-9-9-9z",G)+c(8,9,1.4,R)+c(12,7.5,1.4,B)+c(16,9,1.4,A)+c(8,14,1.4,P),
    book:   p("M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3z",B)+p("M5 4h11a3 3 0 013 3H8a3 3 0 00-3 3z","#6fa0ff")+r(8,9,8,1.4,.7,W)+r(8,12,6,1.4,.7,W),
    globe:  c(12,12,9,B)+ln("M3 12h18M12 3c3 4 3 14 0 18M12 3c-3 4-3 14 0 18M4.5 7.5c4.5 2.5 10.5 2.5 15 0M4.5 16.5c4.5-2.5 10.5-2.5 15 0",L,1.1),
    dice:   r(4,4,16,16,4,W)+c(9,9,1.5,R)+c(15,9,1.5,R)+c(12,12,1.5,R)+c(9,15,1.5,R)+c(15,15,1.5,R),
    sun:    c(12,12,5,G)+ln("M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2",G,1.8),
    mug:    p("M5 7h11v8a4 4 0 01-4 4H9a4 4 0 01-4-4z",G)+p("M16 9h2a2.5 2.5 0 010 5h-2z","#e0a92e")+r(5,5.5,11,2,1,W),
    warning:p("M12 3 22 20H2z",G)+r(11,9,2,6,1,DD)+c(12,17.5,1.2,DD),
    crime:  p("M3 11c2-3 5-4 9-4s7 1 9 4l-1 2c-3-1-5-1-8-1s-5 0-8 1z",D)+c(8,11,2.2,W)+c(16,11,2.2,W)+c(8,11,1,D)+c(16,11,1,D),
    scales: ln("M12 4v15M6 19h12M5 7h14",L,1.6)+p("M5 7 2.5 13h5z",G)+p("M19 7 16.5 13h5z",G),
    wrench: p("M16 3a5 5 0 00-4.6 7L4 17.4 6.6 20l7.4-7.4A5 5 0 1016 3z",GY)+c(16,8,1.6,D),
    hammer: r(13,4,7,4,1.5,GY)+ln("M9 11 4 18a1.6 1.6 0 002.2 2.2L13 15",BR,2.4)+r(11,8,4,4,1,"#c9d2dd"),
    bolt:   p("M13 2 4 13h6l-1 9 9-12h-6z",G),
    flask:  p("M10 3h4v6l4.5 8a2.5 2.5 0 01-2.2 3.6H7.7A2.5 2.5 0 015.5 17L10 9z",B)+p("M8 14h8l1.5 3H6.5z",A),
    plane:  p("M21 12 13 10V5a1.5 1.5 0 00-3 0v5L2 12l8 1v4l-2 1.5V20l4-1 4 1v-1.5L14 17v-4z",L),
    phone:  r(7,2,10,20,3,D)+r(8.5,4.5,7,13,1,B)+c(12,19.5,1.2,L),
    controller: p("M6 8h12a4 4 0 014 4v3a3 3 0 01-5.5 1.6L15 15H9l-1.5 1.6A3 3 0 012 15v-3a4 4 0 014-4z",D)+ln("M6.5 12v3M5 13.5h3",L,1.4)+c(16.5,12.5,1.1,A)+c(18.5,14.5,1.1,G),
    watch:  r(8,7,8,10,2,D)+r(9.5,3,5,4,1,GY)+r(9.5,17,5,4,1,GY)+c(12,12,2.6,A),
    picture:r(3,5,18,14,2.5,D)+r(5,7,14,10,1,B)+c(9,10.5,1.6,G)+p("M5 17 10 12l3 3 3-2.5 3 3V17z",A),
    boat:   p("M3 14h18l-2.5 5H5.5z",L)+r(11,4,2,9,0,GY)+p("M13 5l5 6h-5z",R),
    rocket: p("M12 2c3 2 5 6 5 11l-2 3H9l-2-3c0-5 2-9 5-11z",L)+c(12,9,2,B)+p("M7 14l-3 4 4-1zM17 14l3 4-4-1z",R),
    cloud:  p("M7 18a4 4 0 01-.5-8 5 5 0 019.7-1A3.5 3.5 0 0117 18z",GY)+ln("M9 20l-1 1.5M13 20l-1 1.5M17 20l-1 1.5",B,1.6),
    clover: c(9,9,3,A)+c(15,9,3,A)+c(9,15,3,A2)+c(15,15,3,A2)+ln("M12 13v6",A2,1.6),
    cap:    p("M2 9 12 4l10 5-10 5z",A)+p("M7 12v4c0 1.5 2.5 3 5 3s5-1.5 5-3v-4l-5 2.5z",A2)+r(20,9,1.4,5,.7,G),
    shield: p("M12 3 5 6v6c0 4 3 7 7 8 4-1 7-4 7-8V6z",B)+ln("M9 12l2 2 4-4",W,1.8),
    flame:  p("M12 3c1 3-2 4-2 7a2 2 0 004 0c2 2 3 3 3 6a5 5 0 01-10 0c0-4 3-6 5-13z",R)+p("M12 11c1 2 2 2.5 2 4a2 2 0 01-4 0c0-1.5 1-2 2-4z",G),
    chefhat:p("M7 12a4 4 0 11-1-7.9 4 4 0 017.9-1 4 4 0 016.1 4.9A4 4 0 0117 12z",W)+r(7,12,10,7,1.5,W)+ln("M9 14v3M12 14v3M15 14v3",GY,1.2),
    plant:  p("M12 20V9",A2)+ln("M12 20V9",A2,1.8)+p("M12 11C9 11 6 9 6 5c4 0 6 2 6 6z",A)+p("M12 12c3 0 6-2 6-6-4 0-6 2-6 6z",A2),
    heartbroken: p("M12 20.5S3.5 15 3.5 9.2A4.4 4.4 0 0112 6.6Z",R)+p("M12 6.6A4.4 4.4 0 0120.5 9.2C20.5 15 12 20.5 12 20.5Z","#c0392b")+ln("M12 7l-2 4 3 2-2 4",G,1.4),
    skull:  c(12,11,8,L)+r(7,16,10,4,1.5,L)+c(9,11,2,D)+c(15,11,2,D)+p("M11 15h2l-1 2z",D)+ln("M9 19v2M12 19v2M15 19v2",L,1.4),
    lock:   r(5,10,14,10,2.5,G)+p("M8 10V8a4 4 0 018 0v2",DD)+ln("M8 10V8a4 4 0 018 0v2","#e0a92e",1.8)+c(12,15,1.6,DD),
    calendar:r(3,5,18,16,2.5,B)+r(3,5,18,4,2.5,"#3f78e0")+r(7,3,2,4,1,L)+r(15,3,2,4,1,L)+c(8,13,1.3,W)+c(12,13,1.3,W)+c(16,13,1.3,W),
    bulb:   c(12,9,6,G)+p("M9 14h6v3a3 3 0 01-6 0z",GY)+ln("M10 18h4",DD,1.4),
    megaphone: p("M4 10v4l9 4V6z",A)+r(2,10,3,4,1,A2)+p("M13 6 20 4v16l-7-2z",A)+ln("M16 11h3",W,1.4),
    trophy: p("M7 4h10v4a5 5 0 01-10 0z",G)+p("M7 5H4a3 3 0 003 4zM17 5h3a3 3 0 01-3 4z","#e0a92e")+r(10,12,4,3,0,"#e0a92e")+r(8,15,8,2.5,1,G)+r(6,17.5,12,2.5,1.5,G),
    scissors: c(7,7,2.5,B)+c(7,17,2.5,B)+ln("M9 8.5 20 18M9 15.5 20 6",GY,1.8),
    chat:   p("M4 5h16a2 2 0 012 2v8a2 2 0 01-2 2H9l-4 4v-4H4a2 2 0 01-2-2V7a2 2 0 012-2z",A)+c(8,11,1.2,W)+c(12,11,1.2,W)+c(16,11,1.2,W),
    box:    p("M3 7 12 3l9 4-9 4z",G)+p("M3 7v10l9 4V11z","#e0a92e")+p("M21 7v10l-9 4V11z","#caa02b"),
    clipboard: r(5,4,14,17,2.5,B)+r(9,2.5,6,3,1.5,GY)+r(8,9,8,1.6,.8,W)+r(8,12.5,8,1.6,.8,W)+r(8,16,5,1.6,.8,W),
    badge:  c(12,10,6,B)+ln("M9.5 10l1.5 1.5 3.5-3.5",W,1.8)+p("M8 15l-1 6 5-2 5 2-1-6z",R),
    tooth:  p("M7 4c-2 0-3 2-3 4 0 3 1 4 1.5 7S6.5 21 8 21s1.5-3 2-5 .5-2 2-2 1.5 0 2 2 .5 5 2 5 1.5-3 2-6 1.5-4 1.5-7c0-2-1-4-3-4-1.5 0-2.5 1-4 1S8.5 4 7 4z",W),
    // --- systems: law, politics, emigration, romance ---
    gavel:  `<g transform="rotate(40 11 9)">`+r(5,5.5,11,4,2,GY)+r(9.6,9,3,8.5,1.2,BR)+`</g>`+r(4,19.5,12,2.5,1.2,D),
    ballot: r(4,9,16,11,2,A)+r(8,3.5,8,7,1,W)+ln("M9.5 6.8 11 8.3 14 5.3",A2,1.6)+r(9,12.5,6,1.6,.8,A2),
    passport: r(5,3,14,18,2,B)+c(12,10,3.3,W)+ln("M9.8 10h4.4M12 7.7v4.6",B,1)+r(8,16,8,1.5,.7,"#9ec1ff"),
    podium: p("M8 9.5h8l-1.2 11H9.2z",A)+r(11,4,2,5.5,1,GY)+c(12,4,2,D)+r(6,20.5,12,1.6,.8,A2),
    date:   `<g transform="rotate(-12 9 12)">`+p("M7 5h4l-.6 4a1.4 1.4 0 01-2.8 0z",PK)+ln("M9 9.5V17M7.5 17.5h3",L,1.3)+`</g>`+`<g transform="rotate(12 15 12)">`+p("M13 5h4l-.6 4a1.4 1.4 0 01-2.8 0z",PK)+ln("M15 9.5V17M13.5 17.5h3",L,1.3)+`</g>`,
    suitcase: r(4,8,16,11,2.5,B)+r(8.5,5,7,3.5,1.5,"#3f78e0")+r(4,12,16,2,0,"#3f78e0"),
    // --- money empire / fame / health / generations ---
    chart:  ln("M4 18 9 12 13 15 20 7",A,2.2)+ln("M16 7 20 7 20 11",A,2.2)+r(3.5,19,17,1.6,.8,GY),
    crypto: p("M12 2 20 12 12 22 4 12z",B)+p("M12 6 16 12 12 18 8 12z",L),
    office: r(5,3,14,18,1.5,B)+r(7.5,6,2.5,2.5,.5,W)+r(13.5,6,2.5,2.5,.5,W)+r(7.5,10,2.5,2.5,.5,W)+r(13.5,10,2.5,2.5,.5,W)+r(7.5,14,2.5,2.5,.5,W)+r(13.5,14,2.5,2.5,.5,W)+r(10,17.5,4,3.5,.5,DD),
    dna:    ln("M8 3C16 8 8 16 16 21",P,1.8)+ln("M16 3C8 8 16 16 8 21",P,1.8)+ln("M9.5 6h5M9 9.5h6M9 14.5h6M9.5 18h5",PK,1.4),
    scale:  r(4,5,16,15,3,GY)+c(12,12.5,4.6,L)+ln("M12 12.5 14.2 9.6",A2,1.6)+c(12,12.5,1,DD)+r(9,17.5,6,1.2,.6,DD),
    mic:    r(9,3,6,10,3,GY)+ln("M7 11a5 5 0 0010 0",GY,1.6)+ln("M12 16v4M9 20h6",L,1.6),
    capsule:`<g transform="rotate(45 12 12)">`+r(7,8,10,8,4,R)+r(7,8,5,8,4,L)+ln("M7 8 7 16",GY,.8)+`</g>`,
    // --- batch 1: traits, skills, military, mafia, meta ---
    medal:  p("M8 3 12 9 9 11 6 5z",B)+p("M16 3 12 9 15 11 18 5z",R)+c(12,15,5,G)+c(12,15,3,"#e0a92e")+p("M12 13l.7 1.4 1.5.2-1.1 1 .3 1.5-1.4-.8-1.4.8.3-1.5-1.1-1 1.5-.2z",W),
    fedora: p("M4 15c0-1 3.5-2 8-2s8 1 8 2-3.5 2-8 2-8-1-8-2z",D)+p("M7 14c0-4 1.5-7 5-7s5 3 5 7z",DD)+r(7,12.5,10,1.6,.8,GY),
    scroll: r(6,4,12,16,2,"#e8dcc0")+r(6,4,12,2.5,1,"#cbbf9e")+r(6,17.5,12,2.5,1,"#cbbf9e")+r(8.5,8,7,1.3,.6,BR)+r(8.5,11,7,1.3,.6,BR)+r(8.5,14,5,1.3,.6,BR),
    crest:  p("M12 3 5 5.5V12c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V5.5z",A)+p("M12 3 5 5.5V12c0 4.5 3 7.5 7 9z",A2)+p("M12 8l1.2 2.6 2.8.3-2.1 1.9.6 2.8L12 14.2 9.5 15.6l.6-2.8L8 10.9l2.8-.3z",G),
    fang:   c(12,11,8,L)+c(9,10,1.4,R)+c(15,10,1.4,R)+p("M9 14l1.2 3 1.2-3zM13.6 14l1.2 3 1.2-3z",W),
    moon:   p("M17 13.5A6.5 6.5 0 1110.5 7 5 5 0 0017 13.5z",G)+c(19,6,1,G)+c(16,4,.7,G),
    crown:  p("M4 17 5.5 8l4 4L12 6l2.5 6 4-4L20 17z",G)+r(4,17,16,3,1,"#e0a92e")+c(9.5,11,1,W)+c(14.5,11,1,W),
    wolf:   p("M5 8 4 4l3.5 2.5h9L20 4l-1 4 1 3c0 4-3.5 7-8 7s-8-3-8-7z","#7a6a5a")+c(9.5,11,1.2,G)+c(14.5,11,1.2,G)+p("M11 14h2l-1 1.5z",D),
    // --- batch 3: religion, zodiac, family tree ---
    temple: p("M12 2.5 21 8H3z",G)+r(4.5,8,2.2,8,.5,L)+r(8,8,2.2,8,.5,L)+r(11.5,8,2.2,8,.5,L)+r(15,8,2.2,8,.5,L)+r(3,16,18,2.6,.6,A2),
    zodiac: c(12,12,9,P)+c(12,12,6.6,DD)+p("M14.5 12a3.6 3.6 0 11-3-3.5 3 3 0 003 3.5z",G)+c(15.5,8.5,.8,G)+c(8.5,15,.7,B),
    tree:   r(11,13,2,7,1,BR)+c(8.5,9.5,4,A)+c(15.5,9.5,4,A2)+c(12,6.5,4.2,A),
    // --- batch 4: casino games ---
    cards:  `<g transform="rotate(-12 9 12)">`+r(4,5,9,13,1.5,L)+p("M8.5 8l1.5 3-1.5 3-1.5-3z",R)+`</g>`+`<g transform="rotate(12 15 12)">`+r(11,6,9,13,1.5,W)+p("M15.5 9l1.3 2.6-1.3 2.6-1.3-2.6z",D)+`</g>`,
    slots:  r(4,4,16,16,2.5,B)+r(6,6.5,12,7,1,L)+ln("M10 6.5v7M14 6.5v7",GY,1)+c(8,10,1.3,R)+c(12,10,1.3,A)+c(16,10,1.3,G)+r(7.5,15.5,9,2.2,1,"#3f78e0")+r(19,9,1.6,5,.8,GY),
    sparkle: p("M12 2l1.8 6.5L20 10l-6.2 1.5L12 18l-1.8-6.5L4 10l6.2-1.5z",G)+c(18,5,1.4,A)+c(5,17,1.2,B),
  };

  const EMOJI_MAP = {
    // stats / ui
    "😊":"smile","😄":"smile","❤️":"heart","🧠":"brain","✨":"star","🧘":"leaf","🧘‍♀️":"leaf",
    "🎓":"cap","🏠":"house","🎯":"target","💵":"cash","💰":"coin","💸":"cash","🪙":"coin",
    // careers
    "🛒":"food","🍔":"food","☕":"mug","🧹":"house","🚚":"car","🔨":"hammer","🔧":"wrench","🌾":"plant",
    "🎸":"music","🎬":"drama","📸":"camera","⚽":"ball","💃":"star","🎖️":"badge","🗂️":"clipboard",
    "👮":"shield","🚒":"flame","👨‍🍳":"chefhat","🏘️":"house","⚡":"bolt","💉":"medical","📚":"book",
    "💻":"controller","📈":"cash","🧮":"clipboard","📰":"book","✈️":"plane","🎨":"palette","⚖️":"scales",
    "🔬":"flask","📐":"clipboard","🏛️":"shield","🐾":"paw","🩺":"cross","🔪":"medical","🦷":"tooth",
    // shop
    "🚐":"car","🏚️":"house","🏢":"house","🏡":"house","🌆":"house","🏰":"house","🏝️":"sun","🚲":"bike",
    "🛵":"bike","🚗":"car","🚙":"car","🛻":"car","🏎️":"car","🚓":"car","📱":"phone","🎮":"controller",
    "⌚":"watch","💍":"ring","🖼️":"picture","🛥️":"boat","🚀":"rocket",
    // pets
    "🐶":"dog","🐱":"cat","🐹":"paw","🦜":"paw","🐰":"paw","🐍":"paw","🐠":"paw","🐴":"paw","🐢":"paw","🦎":"paw",
    // activities / misc
    "🏋️":"dumbbell","💄":"sparkle","🌍":"globe","💼":"briefcase","🎰":"dice","🏖️":"sun","🍺":"mug",
    "🚬":"warning","🦹":"crime","🧑‍🤝‍🧑":"people",
    // relationships
    "👨":"person","👩":"person","🧒":"person","💑":"heart","🍼":"baby","💔":"heartbroken","👵":"person",
    // crime
    "🤏":"crime","🛍️":"gift","🏦":"coin",
    // events grab-bag
    "👶":"baby","🚼":"baby","🧸":"gift","🐉":"star","🥦":"food","🏫":"cap","🐝":"star","🌳":"plant",
    "🎅":"gift","🤒":"medical","🍋":"food","🎂":"gift","📝":"book","🏊":"ball","🍪":"food","🌙":"star",
    "🎤":"music","🎉":"sparkle","💘":"heart","📄":"book","🤘":"music","🤝":"people","😈":"crime",
    "🚪":"house","🗡️":"crime","🗯️":"chat","💒":"ring","📞":"phone","⏰":"calendar","😤":"warning",
    "📉":"warning","🥳":"sparkle","🧑‍🏫":"book","🚨":"warning","🏆":"trophy","🚆":"car","💡":"bulb",
    "🎣":"leaf","📖":"book","📜":"book","🦴":"medical","✍️":"book","😌":"smile","🌦️":"cloud","💬":"chat",
    "🎵":"music","🥗":"food","📢":"megaphone","🫶":"heart","📘":"book","🤢":"medical","☀️":"sun",
    "🥧":"food","⭐":"star","💭":"chat","💇":"scissors","🍀":"clover","⛓️":"lock","🍴":"food","🪜":"briefcase",
    "📦":"box","🍀":"clover","🥗":"food","🩹":"medical","🔓":"lock","🕯️":"heart","🌷":"plant","🏍️":"bike",
    "💞":"heart","💝":"gift","🧾":"clipboard","🎟️":"music","🧗":"dumbbell",
    // systems
    "🔨":"gavel","👨‍⚖️":"gavel","🗳️":"ballot","🛂":"passport","🛃":"passport","🎙️":"podium",
    "🍷":"date","🥂":"date","🌹":"heart","💌":"heart","🏳️":"ballot","📋":"clipboard",
    // money / fame / health / generations
    "📈":"chart","📊":"chart","💹":"chart","💎":"crypto","🏢":"office","🏪":"office","🏬":"office",
    "🧬":"dna","⚕️":"cross","🏥":"cross","💊":"capsule","🩹":"capsule","⚖":"scales","🎤":"mic",
    "📺":"mic","🌟":"star","💫":"star","🤩":"star","👑":"trophy","📣":"megaphone","🧑‍🍼":"baby",
    // batch 1
    "🎖️":"medal","🎗️":"medal","🪖":"medal","🕴️":"fedora","🤵":"fedora","🔫":"crime","📜":"scroll",
    "🏅":"medal","🛡️":"crest","🦇":"fang","🧛":"fang","🐺":"wolf","✅":"scroll","🥷":"crime",
    // batch 2
    "🌙":"moon","🌕":"moon","🌑":"moon","👑":"crown","🏰":"crown","🎻":"music","🎹":"music","🎟️":"mic",
    "🏝️":"sun","🗽":"office","🗼":"office","🏔️":"plant","🧳":"suitcase","💇‍♀️":"scissors","💇‍♂️":"scissors",
    // batch 3
    "🛐":"temple","🙏":"temple","⛪":"temple","🕌":"temple","🕍":"temple","🔯":"zodiac","♈":"zodiac",
    "🔮":"zodiac","🌳":"tree","🌲":"tree","📿":"temple","🕊️":"temple",
    // batch 4
    "🃏":"cards","🎴":"cards","♠️":"cards","🎰":"slots","💰":"coin","🏆":"trophy","🥇":"trophy",
  };

  function inner(token){
    if(!token) return ICONS.sparkle;
    if(typeof token==="string" && token.indexOf("<")===0) return null; // already svg
    if(ICONS[token]) return ICONS[token];
    if(EMOJI_MAP[token]) return ICONS[EMOJI_MAP[token]] || ICONS.sparkle;
    return ICONS.sparkle;
  }
  window.iconHTML = function(token, cls=""){
    if(typeof token==="string" && token.indexOf("<svg")===0) return token;
    const body = inner(token);
    return `<svg class="lf-ic ${cls}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  };
  window.ICONS = ICONS;

  // ---- reactive character face ----
  window.faceSVG = function(state, hairColor){
    let skin=SK, hair=hairColor||BL, eyeL, eyeR, mouth, extra="";
    eyeL = c(9,11,1.4,D); eyeR = c(15,11,1.4,D);
    switch(state){
      case "happy":
        mouth = ln("M8 13.5Q12 17.5 16 13.5",D,1.8); extra = `<path d="M7.5 10.2Q9 9 10.5 10.2" fill="none" stroke="${D}" stroke-width="1.2" stroke-linecap="round"/><path d="M13.5 10.2Q15 9 16.5 10.2" fill="none" stroke="${D}" stroke-width="1.2" stroke-linecap="round"/>`;
        break;
      case "sad":
        mouth = ln("M8.5 15.5Q12 12 15.5 15.5",D,1.8);
        extra = ln("M7.5 9.5 10 10.5M16.5 9.5 14 10.5",D,1.2);
        break;
      case "sick":
        skin = "#bcd3a6";
        mouth = ln("M9 14.5q1.5-1.4 3 0t3 0",D,1.6);
        extra = `<path d="M17.5 7c1 1.5 1 3 0 4-1-1-1-2.5 0-4z" fill="${B}" opacity=".8"/>`;
        break;
      case "stressed":
        mouth = ln("M9 15h6",D,1.6);
        extra = ln("M7 8.5 10 10M17 8.5 14 10",D,1.4) + `<path d="M18 6q1.5 1 0 3" fill="none" stroke="${B}" stroke-width="1.2" stroke-linecap="round"/>`;
        break;
      case "prison":
        mouth = ln("M9 15h6",D,1.6);
        extra = ln("M6 4v16M10 4v16M14 4v16M18 4v16",GY,1.4);
        break;
      case "dead":
        skin = "#c9c1b4";
        eyeL = ln("M7.7 9.7 10.3 12.3M10.3 9.7 7.7 12.3",D,1.6);
        eyeR = ln("M13.7 9.7 16.3 12.3M16.3 9.7 13.7 12.3",D,1.6);
        mouth = ln("M9 15.5h6",D,1.6); hair = "#8a8276";
        break;
      case "vampire":
        skin = "#dfe4ea"; hair = "#1a1a1a";
        eyeL = c(9,11,1.5,R); eyeR = c(15,11,1.5,R);
        mouth = ln("M9 14.5h6",D,1.4);
        extra = `<path d="M10 15l.8 1.8.8-1.8zM12.4 15l.8 1.8.8-1.8z" fill="${W}"/>`;
        break;
      case "werewolf":
        skin = "#8a7a66"; hair = "#5b4a36";
        eyeL = c(9,11,1.5,G); eyeR = c(15,11,1.5,G);
        mouth = ln("M9 15h6",D,1.4);
        extra = p("M4 6 6 2 8 6zM16 6 18 2 20 6","#5b4a36") + `<path d="M10.5 15l1 1.6.8-1.6zM11.7 15l1 1.6.8-1.6z" fill="${W}"/>`;
        break;
      default: // neutral
        mouth = ln("M9 14.5h6",D,1.6);
    }
    const head = c(12,12.5,9,skin);
    const hairTop = p("M3.5 11a8.5 8.5 0 0117 0 10 10 0 00-17 0z", hair);
    return `<svg viewBox="0 0 24 24" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">${head}${hairTop}${eyeL}${eyeR}${mouth}${extra}</svg>`;
  };
})();
