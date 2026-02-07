<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta id="vp" name="viewport" content="width=device-width, initial-scale=1.0">
  <title>room2.net | multiplayer</title>

  <link rel="icon" type="image/png" href="https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/fav1.png">

  <style>
    header,
    .site-header {
      display: none !important;
    }

    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
    }

    .player-purpose{
  display: none;
}


/* overlay */
#room2::after{
  content:"";
  position:absolute;
  inset:-2px; /* a bit bigger so it touches edges */
  background: rgba(0,0,0,0.26); /* slightly less dark than before */
  opacity: var(--room2-dark, 1); /* 1 = dark/off, 0 = lit/on */
  pointer-events:none;           /* doors stay clickable */
  z-index: 0;                    /* behind doors/objects */
}





   /* --- Bathroom darkness overlay that DOES NOT affect doors/clicks --- */
#room4{
  isolation: isolate; /* keeps overlay stacking contained */
}

#room4::after{
  content:"";
  position:absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;

  background: rgba(0, 0, 0, 0.317);
  opacity: 1;
  transition: opacity 500ms ease;
  pointer-events: none;
  z-index: 0;
}
/* when light is on, remove darkness */
#room4.light-on::after{
  opacity: 0;
}

/* ensure doors + clickable regions render above overlay */
#room4 .door,
#room4 .clickable-region,
#room4 .room-label{
  position: absolute; /* keep your existing absolute behavior */
  z-index: 2;
}

    body {
      font-family: Arial, Helvetica, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      user-select: none;
      background-color: #ebebeb;
    }

/* NEVER show player chat on host */
body.host-scale #player-chat{
  display: none !important;
}

    /* host view ~30% bigger on desktop */
    body.host-scale .everything {
      transform: scale(1.3);
      transform-origin: top center;
    }

    .everything {
      position: relative;
      width: 400px;
      height: 520px;
    }

    .background {
      position: fixed;
      top: 0;
      left: 0;
      width: 414px;
      height: 750px;
      background-size: cover;
      background-position: center;
      z-index: -1;
      background-image: url('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/background1.png');
    }

    .host-banner {
      position: absolute;
      top: -2px !important;
      right: 0;
      font-size: 12px;
      padding: 3px 7px;
      background: #000;
      color: #00ff88;
      border: 1px solid #000;
      border-bottom: none;
      letter-spacing: 0.5px;
      display: none;
      text-transform: none;
      z-index: 0 !important; /* below popups */
    }

 

/* 0 = day, 1 = night */
#map::before{
  content:"";
  position:absolute;
  inset:-2px;                   /* match your other overlays */
  background: rgba(0, 0, 0, 0.651); /* night darkness strength */
  opacity: var(--house-dark, 0);
  transition: opacity 5s ease; /* smooth fade */
  pointer-events:none;           /* doors stay clickable */
  z-index: 0;                    /* behind rooms/doors/players */
}


    #map {
      position: relative;
      -webkit-tap-highlight-color: transparent;
      background-color: transparent;
      width: 400px;
      height: 400px;
      background-image: url('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/laag1binnen.png');
      background-size: 400px;
      background-repeat: no-repeat;
      overflow: visible;
      background-position: 0 -3px;
      border: 2px solid #333;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 5px;
      margin: 18px auto 0;
      box-sizing: border-box;
    }

    @media screen and (max-width: 479px) {
      #map { overflow: visible; }
    }

    .room {
      position: absolute;
      background-color: transparent;
      border: 2px solid transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8em;
      color: #555;
      text-align: center;
      cursor: pointer;
      opacity: 1;
      transition: transform 0.35s ease-in-out, opacity 0.2s ease-in-out;
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
      z-index: 1;
    }

    .room.active {
      transform: scale(1.01);
      z-index: 4;
      opacity: 1;
    }

    .room-label {
      display: none;
    }

    .player {
      width: 22px;
      height: 40px;
      z-index: 999;
      background:
        url('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/poppetje1Tekengebied%201%404x.png')
        no-repeat center center / contain;
      position: absolute;
      display: block;
      transition: transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1);
      will-change: transform;
      -webkit-tap-highlight-color: transparent;
      pointer-events: none;
    }

    .random-object {
      width: 22px;
      height: 40px;
      background:
        url('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/poppetje2Tekengebied%201%404x.png')
        no-repeat center center / contain;
      position: absolute;
      cursor: pointer;
      z-index: 1001;
      transition: transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1);
    }

    .conversation-indicator {
      position: absolute;
      top: -22px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 13px;
      color: #00ff88;
      background: #363636;
      border: 1px solid #00ff88;
      padding: 1px 5px;
      border-radius: 0;
      display: none;
      pointer-events: none;
    }
    .random-object.arrival-sparkle {
  outline: 2px solid #00ff88;
  outline-offset: 1px;
  animation: hostArrivalPulse 3.4s ease-in-out;
}

/* 3 slow pulses */
@keyframes hostArrivalPulse {
  0%   { outline-color: transparent; }
  10%  { outline-color: #00ff88; }
  20%  { outline-color: transparent; }

  40%  { outline-color: #00ff88; }
  50%  { outline-color: transparent; }

  70%  { outline-color: #00ff88; }
  80%  { outline-color: transparent; }

  100% { outline-color: transparent; }
}

    .door {
      position: absolute;
      background-color: #131313;
      border: 1px solid #000;
      cursor: pointer;
      z-index: 2;
      transition: background-color 0.1s ease, transform 0.08s ease;
      pointer-events: none;
      -webkit-tap-highlight-color: transparent;
    }
    .door-horizontal {
      width: 40px;
      height: 9px;
      border-radius: 1px;
    }
    .door-vertical {
      width: 9px;
      height: 40px;
      border-radius: 1px;
    }
    .door:hover {
      background-color: #ff9900;
      transform: scale(1.03);
    }

    .door-popup {
      display: none !important;
    }

    .clickable-region {
      position: absolute;
      cursor: pointer;
    }

    #tv-area.tv-on::after {
      content: "";
      position: absolute;
      inset: -1px;
      border: 2px solid #00ff88;
      animation: tvPulse 0.6s infinite alternate;
      pointer-events: none;
    }

    @keyframes tvPulse {
      0%   { opacity: 0.4; }
      100% { opacity: 1; }
    }

    /* shower visual on/off like TV */
    #shower-area.shower-on::after {
      content: "";
      position: absolute;
      inset: -1px;
      border: 2px solid #00ff88;
      animation: showerPulse 0.6s infinite alternate;
      pointer-events: none;
    }

    @keyframes showerPulse {
      0%   { opacity: 0.4; }
      100% { opacity: 1; }
    }

    /* main dialogue popups (gardening, etc.) docked left, above map */
    .popup-message {
      position: absolute;
      top: -34px;         /* above the map, no longer inside */
      left: -2px;         /* hugs left side */
      transform: none;
      background-color: #ffffff;
      color: #000000;
      padding: 6px 8px;
      border-radius: 0;
      font-size: 14px;
      display: none;
      z-index: 1000;
      max-width: 260px;
      text-align: left;
      box-sizing: border-box;
      align-items: center;
      gap: 3px !important;
    }

    .popup-message .actor-text.tight-after-icon {
      margin-left: -2px; /* pull the 's' closer to the icon */
    }

    .popup-message .actor-icon {
      width: 10px;   /* was 15px */
      height: 20px;
      background-size: contain;
      background-repeat: no-repeat;
      flex-shrink: 0;
    }

    .popup-message .actor-host {
      background-image: url('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/poppetje2Tekengebied%201%404x.png');
    }

    .popup-message .actor-player {
      background-image: url('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/poppetje1Tekengebied%201%404x.png');
    }

    .popup-message .actor-text {
      font-size: 14px;
      line-height: 1.2;
      white-space: nowrap;
    }

    .popup-message.host-msg {
      background-color: #e0f4ff;
    }
    .popup-message.player-msg {
      background-color: #ffe0e0;
    }



    /* Host inventory bar */
    .action-bar {
      width: 400px;
      margin: 0 auto 0;
      display: none;
      box-sizing: border-box;
      grid-template-columns: repeat(5, 1fr);
      gap: 2px;
      font-size: 13px;
    }


/* =========================
   HOST ACTION BAR BUTTONS
   ========================= */

/* main button */
.action-btn {
  position: relative;
  margin: 0;
  padding: 2px 0 3px;
  border-radius: 0;
  background-color: #ababab;
  color: #000000;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;

  user-select: none;
  font-family: Arial, Helvetica, sans-serif;
  text-transform: none;
  box-sizing: border-box;
  min-height: 10px;

  border: none;
  outline: none;
  box-shadow: none;
  appearance: none;

  /* subtle “paper” feel (safe, not a texture) */
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.18),
    inset 0 -1px 0 rgba(0,0,0,0.12);
}

/* press */
.action-btn:active {
  transform: scale(0.97);
}

/* active flash */
.action-btn.active-flash {
  background-color: #00ff88;
  color: #111111;
}

/* ---------- icon/label ---------- */

/* center main icon cleanly */
.action-btn .label {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* if you're using <img class="icon">, lock sizing so it never blows up */
.action-btn .label .icon {
  width: 18px !important;
  height: 18px !important;
  max-width: 18px;
  max-height: 18px;
  object-fit: contain;
  display: block;
}

/* (optional) if you still have emoji text labels anywhere */
.action-btn span.label {
  font-size: 15px;
  font-weight: bold;
}

/* key label */
.action-btn .key {
  display: inline-block;
  font-size: 10px;
  opacity: 0.7;
  font-weight: bold;
  line-height: 1;
}

/* host-scale tweak */
body.host-scale .action-btn .label .icon {
  width: 20px !important;
  height: 20px !important;
  max-width: 20px;
  max-height: 20px;
}

/* ---------- OFF badge bottom-right ---------- */

/* ---------- OFF badge bottom-right (small + controlled) ---------- */
.action-btn .off-badge{
  position:absolute;
  right:4px;
  bottom:3px;

  display:inline-flex;
  align-items:center;
  gap:2px;

  padding:2px 3px;
  border-radius:3px;
  background:rgba(0,0,0,0.15);

  /* lock text sizing */
  font-size:9px;
  line-height:1;
  opacity:0.7;

  pointer-events:auto;
}

/* IMPORTANT: lock the stop PNG size so it can't become huge */
.action-btn .off-badge .off-icon{
  width:9px !important;
  height:9px !important;
  max-width:9px;
  max-height:9px;
  object-fit:contain;
  display:block;
  flex:0 0 auto;
}

/* the number/letter after the icon */
.action-btn .off-badge{
  font-weight:700;         /* optional: makes the 0/X/8/9 readable */
  letter-spacing:0.2px;
}

/* host-scale tweak */
body.host-scale .action-btn .off-badge{
  font-size:10px;
}
body.host-scale .action-btn .off-badge .off-icon{
  width:10px !important;
  height:10px !important;
  max-width:10px;
  max-height:10px;
}

/* slightly dim badge when main button isn't flashing */
.action-btn:not(.active-flash) .off-badge{
  opacity:0.55;
}

.player-chat-wrap{
  width: 400px;
  margin: 0 auto;
  display: none; /* we’ll show it only for players on phone */
}

    /* Player chat bar styled like host login */
    .player-chat {
      width: 400px;
      margin: 0 auto 0;
      display: none;
      box-sizing: border-box;
      padding: 6px 8px;
      border: 2px solid #00ff88;
      background: #000;
      grid-template-columns: 1fr auto;
      gap: 6px;
      font-size: 12px;
    }

    .player-chat input{
  width:100%;
  padding:6px 8px;
  border-radius:0;
  border:1px solid #00ff88;
  background:#050505;
  color:#00ff88;
  font-size:14px;
  font-family: Arial, Helvetica, sans-serif;
  box-sizing:border-box;
  -webkit-appearance:none;
  appearance:none;
  caret-color:#00ff88;
}


.player-chat input::placeholder{
  color:#00ff88;
  opacity:0.6;
}


/* REMOVE iOS focus ring */
.player-chat input:focus,
.player-chat input:focus-visible{
  outline:none !important;
  box-shadow:none !important;
  border-color:#00ff88 !important;
}


    
/* nicer locked look: grey, calmer, not neon */
.player-chat input:disabled{
  background: #585858;
  border-color: #5a5a5a;
  border:1px solid #2f2f2f;

  color: #c7c7c7;
  caret-color: transparent;
}

.player-chat input:disabled::placeholder{
  color:#ececec;
  opacity:1;
}

.player-chat button:disabled{
  background:#2a2a2a;
  border-color:#757575;
  color:#c7c7c7;
  cursor: default;
}


.player-chat button{
  padding:6px 14px;
  border-radius:0;
  border:1px solid #00ff88;
  background:#00ff88;
  color:#000;
  cursor:pointer;
  font-size:14px;
  font-family: Arial, Helvetica, sans-serif;
  text-transform: lowercase;
}




/* ===== TIMELINE BAR ===== */
.timeline-wrap{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 16px;
  background: transparent;
  z-index: 3000;
  overflow: hidden;
  display: none; /* only show for host after login */
}

.timeline-bar{
  height: 100%;
  width: 0%;
  background: rgba(0, 0, 0, 0.448);
  transition: width 0.12s linear;
}

.timeline-text{
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  font-weight: 800;
  color: rgba(0, 0, 0, 0.448);
  mix-blend-mode: multiply;
  user-select: none;
}
/* ===== CREDITS OVERLAY (stable) ===== */
.credits-overlay{
  position: fixed;
  inset: 0;
  background: rgba(50, 50, 50, 0);
  display: none;
  z-index: 4000;
  pointer-events: none;
  opacity: 0;
  transition: opacity 1.2s ease, background 1.2s ease;
}

.credits-overlay.show{
  display: flex;
  pointer-events: auto; /* blocks clicks */
  opacity: 1;
  background: rgba(0,0,0,0.96); /* almost black */
  align-items: center;
  justify-content: center;
}

.credits-frame{
  width: min(560px, 88vw);
  padding: 22px 18px;
  box-sizing: border-box;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(0,0,0,0.25);
}

.credits-roll{
  color: #ffffff;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
}

.credits-title{
  font-size: 22px;
  letter-spacing: 2px;
  font-weight: 700;
  margin-bottom: 14px;
}

.credits-heading{
  font-size: 12px;
  opacity: 0.75;
  margin-top: 14px;
  letter-spacing: 1px;
  text-transform: lowercase;
}

.credits-line{
  font-size: 18px;
  font-weight: 700;
  margin-top: 6px;
}

.credits-gap{
  height: 10px;
}

@keyframes creditsScroll{
  0%   { transform: translateY(110%); }
  100% { transform: translateY(-140%); }
}

.credits-title{
  font-size: 22px;
  letter-spacing: 2px;
  font-weight: 700;
  margin-bottom: 12px;
}

.credits-heading{
  font-size: 14px;
  opacity: 0.8;
  margin-top: 16px;
  letter-spacing: 1px;
  text-transform: lowercase;
}

.credits-line{
  font-size: 18px;
  font-weight: 700;
  margin-top: 6px;
}

.credits-gap{
  height: 18px;
}




    .player-chat button:active {
      transform: scale(0.97);
    }

    .host-login-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.92);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      color: #00ff88;
    }

    .host-login-panel {
      border: 2px solid #00ff88;
      padding: 14px 18px;
      background: #000;
      border-radius: 0;
      width: 300px;
      box-sizing: border-box;
    }

    .host-login-subtitle {
      font-size: 16px;
      margin-bottom: 7px;
      color: #ffffff;
      text-transform: none;
    }

    .host-login-title {
      font-size: 14px;
      margin-bottom: 10px;
      text-transform: lowercase;
      color: #00ff88;
    }

    .host-login-input {
      width: 100%;
      box-sizing: border-box;
      padding: 6px 8px;
      border-radius: 0;
      border: 1px solid #00ff88;
      background: #050505;
      color: #00ff88;
      font-size: 16px;
      margin-bottom: 8px;
      font-family: Arial, Helvetica, sans-serif;
    }

    .host-login-input:focus {
      outline: none;
      box-shadow: none;
    }

    .host-login-button {
      width: 100%;
      padding: 6px 8px;
      border-radius: 0;
      border: 1px solid #00ff88;
      background: #00ff88;
      color: #000;
      cursor: pointer;
      font-size: 14px;
      font-family: Arial, Helvetica, sans-serif;
      text-transform: lowercase;
    }

    .host-login-button:active {
      transform: scale(0.97);
    }

    .room1 { top: 9px;   left: 9px;   width: 72px;  height: 170px; }
    .room2 { top: 37px;  left: 90px;  width: 220px; height: 143px; }
    .room3 { top: 139px; left: 319px; width: 72px;  height: 131px; }
    .room4 { top: 188px; left: 9px;   width: 72px;  height: 81px;  }
    .room5 { top: 188px; left: 90px;  width: 159px; height: 81px;  }
    .room6 { top: 188px; left: 257px; width: 54px;  height: 81px;  }
    .room7 { top: 278px; left: 257px; width: 90px;  height: 90px;  }

    .room1 .door1 { left: 68%; bottom: -12px; transform: translateX(-50%); }
    .room1 .door2 { right: -12px; top: 59%; transform: translateY(-50%); }

    .room2 .door1 { left: -12px; top: 50%; transform: translateY(-50%); }
    .room2 .door3 { bottom: -12px; left: 59%; transform: translateX(-50%); }
    .room2 .door4 { bottom: -12px; left: 89%; transform: translateX(-50%); }

    .room3 .door1 { left: -12px; top: 69%; transform: translateY(-50%); }

    .room4 .door1 { left: 68%; top: -12px; transform: translateX(-50%); }
    .room4 .door2 { right: -12px; top: 30%; transform: translateY(-50%); }

    .room5 .door1 { left: -13px; top: 30%; transform: translateY(-50%); }
    .room5 .door2 { right: -12px; top: 30%; transform: translateY(-50%); }
    .room5 .door3 { top: -12px; left: 82%; transform: translateX(-50%); }

    .room6 .door1 { left: -12px; top: 30%; transform: translateY(-50%); }
    .room6 .door2 { bottom: -12px; left: 50%; transform: translateX(-50%); }
    .room6 .door3 { right: -12px; top: 50%; transform: translateY(-50%); }
    .room6 .door4 { top: -12px; left: 50%; transform: translateX(-50%); }

    .room7 .door1 { top: -12px; left: 30% !important; transform: translateX(-50%); }

    /* PHONE / SMALL SCREEN TWEAKS */
    @media (max-width: 480px) {
      body {
        align-items: flex-start;
      }


      .player-purpose{
    display: block;
    margin-top: 10px;
    padding: 0 6px;
    font-size: 18px;
    line-height: 1.2;
    text-align: center;
    color: rgb(0, 0, 0);
  }

  body.host-scale .player-chat-wrap,
  body.host-scale .player-purpose{
    display: none !important;
  }



      .everything {
        margin-top: 34px;
        margin-bottom: 0px;
        height: 520px; /* keep enough space for chat under map */
      }

      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        overflow: hidden;          /* disables scrolling */
        overscroll-behavior: none; /* prevents rubber-band */
        touch-action: manipulation;/* avoids scroll gestures becoming scroll */
      }

   

      #map {
        transform: scale(0.93) !important;
        transform-origin: top center;
        margin-top: 24px;
        overflow: visible !important;
      }

      .host-banner {
        z-index: 1 !important; /* below popups */
        right: 14px;
        top: 0px !important;

        font-size: 13px;
        padding: 4px 8px;
      }

      .popup-message .actor-icon {
        width: 14px;
        height: 22px;
      }

      /* locked input must ALWAYS be grey (overrides focus rule) */
.player-chat input:disabled,
.player-chat input:disabled:focus,
.player-chat input:disabled:focus-visible{
  border-color: #2f2f2f !important;
  outline: none !important;
  box-shadow: none !important;
}

      .player,
      .random-object {
        width: 24px;
        height: 44px;
      }


      

 
      .action-btn.has-off {
  position: relative;
}

.action-btn .off-badge {
  position: absolute;
  right: 3px;
  bottom: 2px;

  font-size: 8px;        /* smaller text */
  line-height: 1;
  padding: 1px 2px;

  background: #1a1a1a;
  color: #ff7777;

  border: 1px solid #2a2a2a;
  border-radius: 0;

  opacity: 0.7;
  cursor: pointer;
  user-select: none;
  font-weight: normal;
}

.action-btn .off-badge span,
.action-btn .off-badge svg {
  font-size: 8px;
}

.action-btn .off-badge:active {
  transform: scale(0.9);
}

.popup-message {


  top: 15px !important; /* 10px lower */

    left: 50% !important;
  right: auto !important;
  bottom: auto !important;

  transform: translateX(-50%) !important;

  width: max-content;
  z-index: 10000 !important;
  max-width: 86vw;

  font-size: 17px !important;         /* slightly bigger */
  padding: 6px 8px;
  text-align: center;

  align-items: center;
  display: none;
  white-space: normal;
}

  .popup-message .actor-text {
    font-size: 17px !important;
    white-space: normal;
  }


  /* when chat is locked, make the whole bar grey */
.player-chat:has(input:disabled){
  border-color: #5a5a5a !important;
  background: #2a2a2a; /* optional: slightly greyed bar */
}

  /* wrapper is the anchored block */
  .player-chat-wrap{
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: calc(400px * 0.93 + 18px + 7px);

    width: min(428px, calc(100vw - 4px));
    margin: 0 auto;
  }
  
  /* chat is normal flow inside wrapper */
  .player-chat{
    position: static;        /* <-- IMPORTANT */
    width: 100%;
    margin: 0;
  }


      .player-chat input,
      .player-chat button {
        font-size: 16px;
      }

      body.host-scale .everything {
        transform: scale(1.0);
        transform-origin: top center;
      }
    }
  </style>
</head>
<body>


<!-- TIMELINE BAR (host-controlled) -->
<div id="timelineWrap" class="timeline-wrap" aria-hidden="true">
    <div id="timelineBar" class="timeline-bar"></div>
    <div id="timelineText" class="timeline-text">0%</div>
  </div>
  
  <!-- END CREDITS OVERLAY -->
  <div id="creditsOverlay" class="credits-overlay" aria-hidden="true">
    <div class="credits-frame">
      <div id="creditsRoll" class="credits-roll">
        <div class="credits-title">CREDITS</div>
        <div class="credits-line">room2.net</div>
        <div class="credits-gap"></div>
  
        <div class="credits-heading">host played by</div>
        <div class="credits-line">Isabel Marin Rayo</div>
        <div class="credits-gap"></div>
  
        <div class="credits-heading">created by</div>
        <div class="credits-line">Joram van Duijn</div>
        <div class="credits-gap"></div>

        <div class="credits-heading">script by</div>
        <div class="credits-line">Anniek de Vetten</div>
        <div class="credits-gap"></div>
  
        <div class="credits-heading">map design by</div>
        <div class="credits-line">Marit Reezigt</div>
        <div class="credits-gap"></div>
  
        <div class="credits-line">thank you for participating!</div>
      </div>
    </div>
  </div>
  


<div class="background"></div>

<!-- host login overlay -->
<div id="host-login" class="host-login-overlay">
  <div class="host-login-panel">
    <div class="host-login-subtitle">please JOIN! visit room2.net</div>
    <div class="host-login-title">host login</div>
    <input
      id="host-password"
      class="host-login-input"
      type="password"
      maxlength="10"
      autocomplete="off"
    />
    <button id="host-login-button" class="host-login-button">enter as host</button>
  </div>
</div>

<div class="everything">
  <div id="host-banner" class="host-banner"></div>

  <div id="map">
    <!-- main popup, now anchored to the map -->
    <div id="popup-message" class="popup-message"></div>

    <div id="player" class="player">
        <div id="player-indicator" class="conversation-indicator">...</div>
        <div id="player-poke" class="conversation-indicator">!</div>
      </div>
    <div id="host" class="random-object">
      <div id="host-indicator" class="conversation-indicator">?</div>
    </div>

    <!-- ROOM 1 -->
    <div id="room1" class="room room1">
      <div class="room-label"></div>
      <div class="door door1 door-horizontal" data-target="room4"></div>
      <div class="door door2 door-vertical" data-target="room2"></div>

      <div class="clickable-region"
           style="left: 5px; top: 3px; width: 55px; height: 50px;"
           onclick="if(window.currentRoom==='room1'){playClickSound(); playSound('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/trees1.mp3');}">
      </div>
      <div class="clickable-region"
           style="left: 3px; bottom: 3px; width: 55px; height: 45px;"
           onclick="if(window.currentRoom==='room1'){playClickSound(); playSound('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/trees1.mp3');}">
      </div>
    </div>

    <!-- ROOM 2 – computer lab -->
    <div id="room2" class="room room2">
      <div class="room-label"></div>
      <div class="door door1 door-vertical" data-target="room1"></div>
      <div class="door door3 door-horizontal" data-target="room5"></div>
      <div class="door door4 door-horizontal" data-target="room6"></div>

      <div class="clickable-region"
           style="left: 98px; top: 5px; width: 38px; height: 30px;"
           onclick="if(window.currentRoom==='room2'){playClickSound(); playSound('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/computersound2.mp3');}">
      </div>
      <div class="clickable-region"
           style="left: 94px; top: 105px; width: 25px; height: 27px;"
           onclick="if(window.currentRoom==='room2'){playClickSound(); playSound('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/3dprinter3.mp3');}">
      </div>
      <div class="clickable-region"
           style="right: 23px; bottom: 7px; width: 63px; height: 58px;"
           onclick="if(window.currentRoom==='room2'){playClickSound(); playSound('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/hologram1.mp3');}">
      </div>
      <div class="clickable-region"
           style="right: 3px; top: 3px; width: 60px; height: 46px;"
           onclick="if(window.currentRoom==='room2'){playClickSound(); playSound('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/bookcase1.mp3');}">
      </div>
      <div class="clickable-region"
           style="left: 3px; top: 3px; width: 80px; height: 46px;"
           onclick="if(window.currentRoom==='room2'){playClickSound(); playSound('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/serversound1.mp3');}">
      </div>
      <div class="clickable-region"
           style="left: 3px; bottom: 3px; width: 80px; height: 46px;"
           onclick="if(window.currentRoom==='room2'){playClickSound(); playSound('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/serversound1.mp3');}">
      </div>
    </div>

    <!-- ROOM 3 – kitchen -->
    <div id="room3" class="room room3">
      <div class="room-label"></div>
      <div class="door door1 door-vertical" data-target="room6"></div>

      <div class="clickable-region"
           style="left: 10px; top: 11px; width: 43px; height: 65px;"
           onclick="if(window.currentRoom==='room3'){playClickSound(); playSound('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/diningtable1.mp3');}">
      </div>
      <div class="clickable-region"
           style="left: 8px; bottom: 1px; width: 13px; height: 11px;"
           onclick="if(window.currentRoom==='room3'){playClickSound(); playSound('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/stove1.mp3');}">
      </div>
      <div class="clickable-region"
           style="left: 34px; bottom: 1px; width: 14px; height: 11px;"
           onclick="if(window.currentRoom==='room3'){playClickSound(); playSound('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/loudsink1.mp3');}">
      </div>
    </div>

    <!-- ROOM 4 – bathroom -->
    <div id="room4" class="room room4">
      <div class="room-label"></div>
      <div class="door door1 door-horizontal" data-target="room1"></div>
      <div class="door door2 door-vertical" data-target="room5"></div>

      <div id="shower-area" class="clickable-region"
           style="left: 0px; top: 0px; width: 24px; height: 24px;"
           onclick="if(window.currentRoom==='room4'){playClickSound(); playSound('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/douche.mp3');}">
      </div>
      <div class="clickable-region"
           style="left: 21px; top: 62px; width: 14px; height: 15px;"
           onclick="if(window.currentRoom==='room4'){playClickSound(); playSound('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/sink1.mp3');}">
      </div>
      <div class="clickable-region"
           style="left: 0px; top: 33px; width: 8px; height: 22px;"
           onclick="if(window.currentRoom==='room4'){playClickSound(); playSound('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/washinghands1.mp3');}">
      </div>
      <div class="clickable-region"
           style="right: 0px; top: 45px; width: 8px; height: 25px;"
           onclick="if(window.currentRoom==='room4'){playClickSound(); playSound('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/cabinclick.mp3');}">
      </div>
    </div>

    <!-- ROOM 5 – living -->
    <div id="room5" class="room room5">
      <div class="room-label"></div>
      <div class="door door1 door-vertical" data-target="room4"></div>
      <div class="door door2 door-vertical" data-target="room6"></div>
      <div class="door door3 door-horizontal" data-target="room2"></div>

      <div class="clickable-region"
           style="left: 94px; top: 25px; width: 55px; height: 45px;"
           onclick="if(window.currentRoom==='room5'){playClickSound();}">
      </div>
      <div id="tv-area" class="clickable-region"
           style="left: 24px; top: 2px; width: 34px; height: 8px;"
           onclick="if(window.currentRoom==='room5'){playClickSound(); playSound('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/tvbutton1.mp3');}">
      </div>
      <div class="clickable-region"
           style="left: 5px; bottom: 2px; width: 34px; height: 34px;"
           onclick="if(window.currentRoom==='room5'){playClickSound();}">
      </div>
      <div class="clickable-region"
           style="left: 70px; bottom: 1px; width: 20px; height: 10px;"
           onclick="if(window.currentRoom==='room5'){playClickSound();}">
      </div>
    </div>

    <!-- ROOM 6 – hall -->
    <div id="room6" class="room room6">
      <div class="room-label"></div>
      <div class="door door1 door-vertical" data-target="room5"></div>
      <div class="door door2 door-horizontal" data-target="room7"></div>
      <div class="door door3 door-vertical" data-target="room3"></div>
      <div class="door door4 door-horizontal" data-target="room2"></div>
    </div>

    <!-- ROOM 7 – bedroom -->
    <div id="room7" class="room room7">
      <div class="room-label"></div>
      <div class="door door1 door-horizontal" data-target="room6"></div>

      <div class="clickable-region"
           style="left: 40px; top: 19px; width: 55px; height: 47px;"
           onclick="if(window.currentRoom==='room7'){playClickSound(); playSound('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/bed2.mp3');}">
      </div>
    </div>

</div><!-- /map -->


  <!-- Host-only action bar -->
  <div class="action-bar">
    <button class="action-btn" data-action="sleep">
      <span class="label"><img class="icon" src="https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/icon_sleeping.png" alt="sleep"></span>
      <span class="key">Z</span>
    </button>
  
    <button class="action-btn has-off" data-action="serverAmbOn">
      <span class="label"><img class="icon" src="https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/icon_servers.png" alt="server ambience"></span>
      <span class="key">C</span>
      <span class="off-badge" data-action="serverAmbOff">
        8<img class="off-icon" src="https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/icon_cancel.png" alt="off">
      </span>
        </button>

 

  
    <button class="action-btn" data-action="table">
      <span class="label"><img class="icon" src="https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/icon_table.png" alt="table"></span>
      <span class="key">T</span>
    </button>
  
    <button class="action-btn" data-action="piano">
      <span class="label"><img class="icon" src="https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/icon_piano.png" alt="piano"></span>
      <span class="key">P</span>
    </button>
  
    <button class="action-btn has-off" data-action="lightOn">
      <span class="label"><img class="icon" src="https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/icon_light.png" alt="light"></span>
      <span class="key">L</span>
      <span class="off-badge" data-action="lightOff">
        9<img class="off-icon" src="https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/icon_cancel.png" alt="off">
      </span>    </button>



  
    <button class="action-btn" data-action="water">
      <span class="label"><img class="icon" src="https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/icon_gardening.png" alt="garden"></span>
      <span class="key">W</span>
    </button>
  
    <button class="action-btn has-off" data-action="showerOn">
      <span class="label"><img class="icon" src="https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/icon_shower.png" alt="shower"></span>
      <span class="key">S</span>
      <span class="off-badge" data-action="showerOff">
        X<img class="off-icon" src="https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/icon_cancel.png" alt="off">
      </span>
        </button>


  
    <button class="action-btn" data-action="brush">
      <span class="label"><img class="icon" src="https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/icon_toothbrush.png" alt="brush"></span>
      <span class="key">B</span>
    </button>
  
    <button class="action-btn" data-action="dinner">
      <span class="label"><img class="icon" src="https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/icon_cooking.png" alt="cook"></span>
      <span class="key">D</span>
    </button>
  
    <button class="action-btn has-off" data-action="tvOn">
      <span class="label"><img class="icon" src="https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/icon_tv.png" alt="tv"></span>
      <span class="key">1</span>
      <span class="off-badge" data-action="tvOff">
        0<img class="off-icon" src="https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/icon_cancel.png" alt="off">
      </span>
        </button>
    </div>

  
<!-- Player chat + purpose (players only, phone) -->
<div id="player-chat-wrap" class="player-chat-wrap">
    <div id="player-chat" class="player-chat">
      <input id="chat-input" type="text" maxlength="24" placeholder="type your reaction…" />
      <button id="chat-send">send</button>
    </div>
  
    <div id="player-purpose" class="player-purpose">
        <b>your purpose</b> in room2<br>
        is to reply to the host!
      </div>
  </div>
  </div><!-- /.everything -->

<script src="/socket.io/socket.io.js"></script>
<script>
const isHost =
  window.location.pathname === '/host' ||
  window.location.search.includes('host=1'); // keep backward compatibility


  window.isHost = isHost;
  const socket = io();

  const isMobile = /Mobi|Android/i.test(navigator.userAgent || '');

  console.log('Multiplayer client starting. isHost =', isHost);

  if (isHost) {
    document.body.classList.add('host-scale');
  }

  let currentRoom  = 'room5';
  let hostRoom     = 'room5';
  let currentAudio = null;
  let tvAudio      = null;
  let showerAudio  = null;
  let moveAudio    = null;
  let hostUnlocked = !isHost;
  let lightAudio   = null; // bathroom light hum loop (host only)
  let bathroomLightEnabled = false; // light can be enabled, but only plays in room4

  let serverLightEnabled = false; // or false if you want it OFF by default
let serverLightLastOn = null;  // internal edge-detect


  let resultShowing = false;


  let serverAmbientEnabled = false;


// ===== TIMELINE / CREDITS =====
const TIMELINE_TOTAL_MS = 10 * 60 * 1000; // 10 minutes
let timelineRunning = false;
let timelineElapsed = 0;     // ms
let timelineLastTick = null; // performance.now()
let timelineRAF = null;
let timelineFinished = false;



  let convoOpen = false;       // is a conversation currently collecting?
  let hostWaiting = false;     // are we showing the "waiting..." popup?

  let convoLoopAudio = null;
let lastLoginLen = 0;


let lastConvoLoopUrl = null;

let ambientAudio = null;
let ambientRoom = null;

// set your per-room ambient here
const ROOM_AMBIENT = {
  room1: 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/morningbird.mp3', // garden
  room2: 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/serverspaceloud.mp3',   // server room
  room6: 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/serverspacesoft.mp3'          // hallway (example)
  // room3, room5, room7 can be added too
};

const CONVO_LOOP_POOL = [
  'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/waitforanswer4.mp3'
];



const PLAYER_JOIN_SOUND_URL = 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/joined3.mp3';





  window.currentRoom = currentRoom;





  let currentConversationId = null;
  let hasRespondedThisRound = false;
  let typingTimeout = null; // for shared typing indicator timing

  const HOST_LOGIN_SUCCESS_URL = 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/enter2.mp3';
  const CREDITS_SOUND_URL = 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/enter_serverroom2.mp3';
  const LOGIN_MOMENT = 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/welcome2.mp3';


  const actionBarEl   = document.querySelector('.action-bar');
  const playerChatEl  = document.getElementById('player-chat');
  const chatInputEl   = document.getElementById('chat-input');
  const chatSendEl    = document.getElementById('chat-send');
  const hostIndicator = document.getElementById('host-indicator');
  const hostBannerEl  = document.getElementById('host-banner');
  const hostLoginEl   = document.getElementById('host-login');
  const hostPasswordEl= document.getElementById('host-password');
  const hostLoginBtn  = document.getElementById('host-login-button');

  const mapEl         = document.getElementById('map');
  const playerEl      = document.getElementById('player');
  const hostEl        = document.getElementById('host');
  const popupMsgEl    = document.getElementById('popup-message');
  const tvAreaEl      = document.getElementById('tv-area');
  const showerAreaEl  = document.getElementById('shower-area');
  const playerTypingIndicator = document.getElementById('player-indicator'); // "..."
  const playerPokeIndicator   = document.getElementById('player-poke');      // "!"
  const roomGraph = {
    room1: ['room2','room4'],
    room2: ['room1','room5','room6'],
    room3: ['room6'],
    room4: ['room1','room5'],
    room5: ['room2','room4','room6'],
    room6: ['room2','room3','room5','room7'],
    room7: ['room6']
  };




  // one-shot "enter room" sounds (host only)
const ROOM_ENTER = {
  room1: 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/enter_serverroom.mp3',
  room2: 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/enter_serverroom2.mp3',
  room3: 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/enter_hallway.mp3',
  room4: 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/enter_bathroom.mp3',
  room5: 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/enter_livingroom.mp3',
  room6: 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/enter_kitchen.mp3',
  room7: 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/enter_bedroom.mp3'
};

  const arrowNav = {
    room1: { up: null,    down: 'room4', left: null,    right: 'room2' },
    room2: { up: null,    down: 'room5', left: 'room1', right: 'room6' },
    room3: { up: null,    down: null,    left: 'room6', right: null },
    room4: { up: 'room1', down: null,    left: null,    right: 'room5' },
    room5: { up: 'room2', down: null,    left: 'room4', right: 'room6' },
    room6: { up: 'room2', down: 'room7', left: 'room5', right: 'room3' },
    room7: { up: 'room6', down: null,    left: null,    right: null }
  };

  const roomActions = {
    room1: ['water'],
    room2: ['serverAmbOn','serverAmbOff'],
    room3: ['table','dinner'],
    room4: ['showerOn','showerOff','brush', 'lightOn','lightOff'],
    room5: ['piano','tvOn','tvOff'],
    room6: [],
    room7: ['sleep']
  };

  const positionOffsets = {
    player: {
      room1: { dx: -25, dy: 10 },
      room2: { dx: -12, dy: 5  },
      room3: { dx: -15, dy: 0  },
      room4: { dx: -14, dy: -1  },
      room5: { dx: -12, dy: 0  },
      room6: { dx: -12,  dy: 2  },
      room7: { dx: -11, dy: -2 }
    },
    host: {
      room1: { dx: 8,  dy: -3  },
      room2: { dx: 16, dy: -5  },
      room3: { dx: 2,  dy: 20   },
      room4: { dx: 8,  dy: -5  },
      room5: { dx: 10, dy: -8  },
      room6: { dx: 6,  dy: -2  },
      room7: { dx: 10, dy: 0   }
    }
  };

  const CLICK_SOUND_URL    = 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/touch.mp3';
  const ARRIVAL_SOUND_URL  = 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/enter2.wav';
  // one-shot sounds
const SHOWER_OFF_ONESHOT_URL = 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/showerturnoff.mp3';
const TV_OFF_ONESHOT_URL     = 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/turn_tv_off.mp3';

// bathroom light sounds
const LIGHT_ON_SWITCH_URL  = 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/turn_on_light.mp3';
const LIGHT_OFF_SWITCH_URL = 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/turn_off_light.mp3';
const LIGHT_HUM_LOOP_URL   = 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/bathroomfan.mp3';

const SERVERS_OFF_URL   = 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/turn_off_servers.mp3';
const SERVERS_ON_URL   = 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/turn_on_servers.mp3';




  const soundPools = {
    sleep: [
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/sleeping.mp3'
    ],
    table: [
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/diningtable1.mp3',
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/eatingmoment1.mp3'

    ],
    piano: [
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/satie2.mp3'
    ],
    //gardening
    water: [
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/gardening1.mp3',
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/gardening2.mp3',
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/gardening3.mp3',
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/gardening4.mp3',
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/gardening5.mp3',
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/gardening6.mp3',
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/gardening7.mp3',
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/gardening8.mp3',
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/gardening9.mp3',
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/gardening10.mp3',
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/gardening11.mp3',
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/gardening12.mp3'

    ],
    shower: [
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/showerrunning3.mp3'
    ],
    brush: [
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/washinghands1.mp3',
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/brushteeth1.mp3'
    ],
    dinner: [
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/cookingdinner2.mp3'
    ],
    tvOn: [
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/tvroom.wav'
    ],
    move: [
      ''
    ],
    message: [
      'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/effectmessage.mp3'
    ]
  };

  const actionMessages = {
    lightOn:  'turned the light on',
    lightOff: 'turned the light off',
    sleep:     'is going to sleep',
    table:     'dressing the table…',
    piano:     'is playing piano',
    water:     'gardening',
    serverAmbOff: 'turned off the servers',
    serverAmbOn: 'turned on the servers',
    showerOn:  'is taking a shower',
    showerOff: 'stepped out of the shower',
    brush:     'is brushing her teeth',
    dinner:    'preparing food',
    tvOn:      'turned the TV on',
    tvOff:     'turned TV off'
  };

  function pickRandomFromPool(poolName) {
    const pool = soundPools[poolName];
    if (!pool || !pool.length) return null;
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx];
  }

  function playTypingSound(url) {
  // one-shot sound without killing currentAudio/tv/shower/etc.
  if (!url) return;
  try {
    const a = new Audio(url);
    a.play().catch(() => {});
  } catch (e) {}
}

function stopAmbient() {
  if (!ambientAudio) return;
  try {
    ambientAudio.pause();
    ambientAudio.currentTime = 0;
  } catch (e) {}
  ambientAudio = null;
  ambientRoom = null;
}



let houseNight = false;

function setHouseNight(isNight){
  houseNight = !!isNight;
  if (!mapEl) return;
  mapEl.style.setProperty('--house-dark', houseNight ? '1' : '0');
}


const NIGHT_DURATION_MS = 30000; 
let nightTimer = null;

function startNightPulse(){
  // host only
  if (!isHost || !hostUnlocked) return;

  // restart if pressed again
  if (nightTimer) clearTimeout(nightTimer);
  nightTimer = null;

  // turn night ON locally + for everyone
  setHouseNight(true);
  socket.emit('hostAction', { kind: 'nightOn' });

  // auto back to day after 10s
  nightTimer = setTimeout(() => {
    setHouseNight(false);
    socket.emit('hostAction', { kind: 'nightOff' });
    nightTimer = null;
  }, NIGHT_DURATION_MS);
}

function vibratePulse(pattern = [25, 30, 25]) {
  // mobile only + requires user gesture at least once on iOS (Android usually ok)
  if (!navigator.vibrate) return;
  try { navigator.vibrate(pattern); } catch(e) {}
}




document.querySelectorAll('.off-badge').forEach(badge => {
  badge.addEventListener('click', (e) => {
    e.stopPropagation(); // don’t trigger the main button
    const action = badge.dataset.action;
    if (action) triggerHostAction(action);
  });
});

let didInitialEnterSound = false;

function playEnterForRoom(roomId) {
  if (!didInitialEnterSound) {
    didInitialEnterSound = true;
    return; // skip first time (page load)
  }

  const url = ROOM_ENTER[roomId];
  if (!url) return;

  try {
    const a = new Audio(url);
    a.play().catch(() => {});
  } catch (e) {}
}

function setBathroomDarkness(lightOn){
  const r4 = document.getElementById('room4');
  if (!r4) return;
  r4.classList.toggle('light-on', !!lightOn);
}



const timelineWrapEl = document.getElementById('timelineWrap');
const timelineBarEl  = document.getElementById('timelineBar');
const timelineTextEl = document.getElementById('timelineText');
const creditsOverlayEl = document.getElementById('creditsOverlay');

function setTimelineUI(pct){
  const clamped = Math.max(0, Math.min(100, pct));
  timelineBarEl.style.width = clamped + '%';
  timelineTextEl.textContent = Math.round(clamped) + '%';
}

function showCredits(){
  if (timelineFinished) return;
  timelineFinished = true;
  timelineRunning = false;
  if (timelineRAF) cancelAnimationFrame(timelineRAF);
  timelineRAF = null;

  setTimelineUI(100);

  // credits sound (one-shot)
  playSound(CREDITS_SOUND_URL);

  // fade overlay in
  creditsOverlayEl.classList.add('show');
}

function timelineTick(now){
  if (!timelineRunning) return;

  if (timelineLastTick == null) timelineLastTick = now;
  const dt = now - timelineLastTick;
  timelineLastTick = now;

  timelineElapsed += dt;

  const pct = (timelineElapsed / TIMELINE_TOTAL_MS) * 100;
  setTimelineUI(pct);

  if (timelineElapsed >= TIMELINE_TOTAL_MS){
    showCredits();
    return;
  }

  timelineRAF = requestAnimationFrame(timelineTick);
}

function toggleTimeline(){
  if (!isHost || !hostUnlocked) return;
  if (timelineFinished) return;

  timelineRunning = !timelineRunning;

  if (timelineRunning){
    timelineLastTick = null;
    timelineRAF = requestAnimationFrame(timelineTick);
  } else {
    // pause
    if (timelineRAF) cancelAnimationFrame(timelineRAF);
    timelineRAF = null;
    timelineLastTick = null;
  }
}

function stopLightLoop() {
  if (!lightAudio) return;
  try {
    lightAudio.pause();
    lightAudio.currentTime = 0;
  } catch (e) {}
  lightAudio = null;
}

function startLightLoop() {
  // already playing? don't restart
  if (lightAudio && !lightAudio.paused) return;

  stopLightLoop();
  try {
    lightAudio = new Audio(LIGHT_HUM_LOOP_URL);
    lightAudio.loop = true;
    lightAudio.volume = 0.6;
    lightAudio.play().catch(() => {});
  } catch (e) {
    console.error(e);
  }
}




// bathroom light behaves like ambience: only audible in room4
function syncBathroomLightForRoom(roomId) {
  if (!isHost) return;

  if (roomId !== 'room4') {
    stopLightLoop();
    return;
  }

  if (bathroomLightEnabled) startLightLoop();
  else stopLightLoop();
}
function setAmbientForRoom(roomId) {
  // host only (extra safety)
  if (!isHost) return;

  // If server room (room2) but disabled -> ensure silent and exit
  if (roomId === 'room2' && !serverAmbientEnabled) {
    stopAmbient();          // this also sets ambientRoom = null
    return;
  }

  // don’t restart if already playing for this room
  if (ambientRoom === roomId && ambientAudio) return;

  stopAmbient();

  const url = ROOM_AMBIENT[roomId];
  if (!url) return;

  ambientRoom = roomId;

  try {
    ambientAudio = new Audio(url);
    ambientAudio.loop = true;
    ambientAudio.volume = 0.55;
    ambientAudio.play().catch(() => {});
  } catch (e) {
    console.error(e);
  }
}
function pickRandomDifferent(pool, lastUrl) {
  if (!pool || !pool.length) return null;
  if (pool.length === 1) return pool[0];

  let url = pool[Math.floor(Math.random() * pool.length)];
  // avoid same twice in a row
  if (url === lastUrl) {
    url = pool[(pool.indexOf(url) + 1) % pool.length];
  }
  return url;
}
const room2El = document.getElementById('room2');

// tune these safely (now always defined before use)
const SERVERROOM_OFF_DELAY = 2100;     // ms
const SERVERROOM_STARTUP_DELAY = 1500; // ms
const SERVERROOM_LIT_OPACITY = 0.07;   // 0=lit, 1=dark (your “slightly brighter” look)

let serverLightOn = false;
let serverFlickerArmed = false;
let serverFlickerTimeout = null;

// NEW: keep handles so delayed actions can't fight each other
let serverStartupTimer = null;
let serverOffTimer = null;

function setRoom2Darkness(opacity01){
  if (!room2El) return;
  const v = Math.max(0, Math.min(1, opacity01));
  room2El.style.setProperty('--room2-dark', String(v));
}

function flickerRoom2Once() {
  if (!serverLightOn) return;

  const patterns = [
    [0.55, 70, 0.15, 110, 0.40, 80, 0.00, 0],
    [0.65, 60, 0.20, 120, 0.50, 70, 0.10, 90, 0.00, 0],
    [0.45, 80, 0.18, 130, 0.35, 90, 0.00, 0],
    [0.60, 55, 0.12, 140, 0.42, 85, 0.00, 0],
  ];

  const seq = patterns[Math.floor(Math.random() * patterns.length)];

  let i = 0;
  function step(){
    if (!serverLightOn) return;

    const opacity = seq[i++];
    const dur = seq[i++];

    if (typeof opacity !== 'number') return;

    setRoom2Darkness(opacity);

    if (dur > 0) setTimeout(step, dur);
    else setRoom2Darkness(SERVERROOM_LIT_OPACITY);
  }

  step();
}

function armRoom2RandomFlickers(){
  disarmRoom2RandomFlickers();
  serverFlickerArmed = true;

  const scheduleNext = () => {
    if (!serverFlickerArmed || !serverLightOn) return;

    const wait = 4200 + Math.random() * 10500;
    serverFlickerTimeout = setTimeout(() => {
      if (!serverFlickerArmed || !serverLightOn) return;

      const chance = 0.28;
      if (Math.random() < chance) {
        if (Math.random() < 0.70) {
          setRoom2Darkness(0.12);
          setTimeout(() => {
            if (serverLightOn) setRoom2Darkness(SERVERROOM_LIT_OPACITY);
          }, 140 + Math.random() * 140);
        } else {
          flickerRoom2Once();
        }
      }

      scheduleNext();
    }, wait);
  };

  scheduleNext();
}

function disarmRoom2RandomFlickers(){
  serverFlickerArmed = false;
  if (serverFlickerTimeout) clearTimeout(serverFlickerTimeout);
  serverFlickerTimeout = null;
}

function setServerRoomLight(isOn){
  serverLightOn = !!isOn;

  // cancel pending delayed actions so state can't “fight itself”
  if (serverStartupTimer) { clearTimeout(serverStartupTimer); serverStartupTimer = null; }
  if (serverOffTimer) { clearTimeout(serverOffTimer); serverOffTimer = null; }

  // OFF
  if (!serverLightOn) {
    disarmRoom2RandomFlickers();

    serverOffTimer = setTimeout(() => {
      if (!serverLightOn) setRoom2Darkness(1);
      serverOffTimer = null;
    }, SERVERROOM_OFF_DELAY);

    return;
  }

  // ON
  disarmRoom2RandomFlickers();
  setRoom2Darkness(1);

  serverStartupTimer = setTimeout(() => {
    serverStartupTimer = null;
    if (!serverLightOn) return;

    const hits = 2 + Math.floor(Math.random() * 2); // 2 or 3
    let n = 0;

    const doHit = () => {
      if (!serverLightOn) return;
      flickerRoom2Once();
      n++;
      if (n < hits) setTimeout(doHit, 260 + Math.random() * 220);
      else setTimeout(() => { if (serverLightOn) armRoom2RandomFlickers(); }, 650);
    };

    doHit();
  }, SERVERROOM_STARTUP_DELAY);
}


function pulseIndicator(el, text, duration = 1000, restoreText = null) {
  if (!el) return;

  // remember what was there before
  const prevText = el.textContent;
  const prevDisplay = el.style.display;

  // token so overlapping pulses don't fight
  const token = Date.now() + Math.random();
  el._pulseToken = token;

  el.textContent = text;
  el.style.display = 'block';

  clearTimeout(el._pulseT);
  el._pulseT = setTimeout(() => {
    if (el._pulseToken !== token) return;

    // restore the old text (or an explicit restoreText)
    el.textContent = (restoreText != null) ? restoreText : prevText;

    // restore display state (so typing logic keeps control)
    el.style.display = prevDisplay || 'none';
  }, duration);
}


function startConvoLoop() {
  stopConvoLoop();

  const url = pickRandomDifferent(CONVO_LOOP_POOL, lastConvoLoopUrl);
  if (!url) return;

  lastConvoLoopUrl = url;

  try {
    convoLoopAudio = new Audio(url);
    convoLoopAudio.loop = false; // IMPORTANT: we chain tracks instead of looping one
    convoLoopAudio.play().catch(() => {});

    convoLoopAudio.onended = () => {
      // keep chaining as long as convoLoopAudio still exists
      if (!convoLoopAudio) return;
      startConvoLoop(); // picks a new random one
    };
  } catch (e) {
    console.error(e);
  }
}

function stopConvoLoop() {
  if (!convoLoopAudio) return;
  try {
    convoLoopAudio.onended = null;
    convoLoopAudio.pause();
    convoLoopAudio.currentTime = 0;
  } catch (e) {}
  convoLoopAudio = null;
}

socket.on('playerJoined', () => {
  if (!isHost) return;          // ✅ only host hears it
  if (!hostUnlocked) return;    // ✅ optional: don’t beep before login
  playSound(PLAYER_JOIN_SOUND_URL);
});



  function playSound(url) {
    if (!url) return;
    try {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      currentAudio = new Audio(url);
      currentAudio.play().catch(() => {});
    } catch (e) {
      console.error(e);
    }
  }


  function playClickSound() {
    playSound(CLICK_SOUND_URL);
  }

  function showMessage(text, duration = 4000) {
    if (!popupMsgEl || !text) return;
    popupMsgEl.classList.remove('host-msg','player-msg');
    popupMsgEl.textContent = text;
    popupMsgEl.style.display = 'block';
    vibratePulse();

    clearTimeout(showMessage._timeout);
    showMessage._timeout = setTimeout(() => {
      popupMsgEl.style.display = 'none';
    }, duration);
  }

  function showActorMessage(actor, text, duration = 4000) {
    if (!popupMsgEl || !text) return;
    const iconClass = actor === 'player' ? 'actor-player' : 'actor-host';
    popupMsgEl.classList.remove('host-msg','player-msg');
    if (actor === 'host') {
      popupMsgEl.classList.add('host-msg');
    } else if (actor === 'player') {
      popupMsgEl.classList.add('player-msg');
    }
    popupMsgEl.innerHTML =
      '<span class="actor-icon ' + iconClass + '"></span>' +
      '<span class="actor-text">' + text + '</span>';
    popupMsgEl.style.display = 'flex';
    vibratePulse();

    clearTimeout(showActorMessage._timeout);
    showActorMessage._timeout = setTimeout(() => {
      popupMsgEl.style.display = 'none';
    }, duration);
  }
  function showHostWaitingMessage(duration = null) {
  if (!popupMsgEl) return;

  popupMsgEl.classList.remove('host-msg','player-msg');
  popupMsgEl.classList.add('host-msg');
  popupMsgEl.innerHTML =
    '<span class="actor-text">waiting for </span>' +
    '<span class="actor-icon actor-player"></span>' +
    '<span class="actor-text tight-after-icon">\'s response</span>';
  popupMsgEl.style.display = 'flex';
  vibratePulse([20, 40, 20, 40, 20]); // slightly different “waiting” vibe


  clearTimeout(showHostWaitingMessage._timeout);

  // IMPORTANT: if duration is null, do NOT auto-hide
  if (duration == null) return;

  showHostWaitingMessage._timeout = setTimeout(() => {
    popupMsgEl.style.display = 'none';
  }, duration);
}


  function moveElementToRoom(el, roomId, role) {
    const room = document.getElementById(roomId);
    if (!room || !el) return;

    const x = room.offsetLeft + room.offsetWidth  / 2 - el.offsetWidth  / 2;
    const y = room.offsetTop  + room.offsetHeight / 2 - el.offsetHeight / 2;

    const offsetsByRole = positionOffsets[role] || {};
    const off = offsetsByRole[roomId] || { dx: 0, dy: 0 };

    el.style.transform = 'translate3d(' + (x + off.dx) + 'px, ' + (y + off.dy) + 'px, 0)';
  }

  function updateActiveRoom(roomId) {
    document.querySelectorAll('.room').forEach(r => {
      r.classList.toggle('active', r.id === roomId);
    });

    document.querySelectorAll('.door').forEach(d => d.style.pointerEvents = 'none');
    const room = document.getElementById(roomId);
    if (room) {
      room.querySelectorAll('.door').forEach(d => d.style.pointerEvents = 'auto');
    }

    if (isHost) updateActionBarForRoom(roomId);
  }

  function updateActionBarForRoom(roomId) {
    const allowed = new Set(roomActions[roomId] || []);
    document.querySelectorAll('.action-btn').forEach(btn => {
      const action = btn.dataset.action;
      btn.style.display = allowed.has(action) ? 'flex' : 'none';
    });
  }





  function setTvVisualState(on) {
    if (!tvAreaEl) return;
    if (on) tvAreaEl.classList.add('tv-on');
    else tvAreaEl.classList.remove('tv-on');
  }

  function setShowerVisualState(on) {
    if (!showerAreaEl) return;
    if (on) showerAreaEl.classList.add('shower-on');
    else showerAreaEl.classList.remove('shower-on');
  }

  function showHostSignal(text, duration = 1000) {
  // gebruikt hostIndicator als “signal lampje” voor de host
  pulseIndicator(hostIndicator, text, duration, '?');
}

  function triggerHostArrivalEffect() {
  if (!hostEl) return;
  hostEl.classList.add('arrival-sparkle');
  setTimeout(() => hostEl.classList.remove('arrival-sparkle'), 3000);
}

function goToRoom(targetRoom) {
  if (targetRoom === currentRoom) return;
  if (!roomGraph[currentRoom] || !roomGraph[currentRoom].includes(targetRoom)) return;

  currentRoom = targetRoom;
  window.currentRoom = currentRoom;
  updateActiveRoom(currentRoom);

  // host-only per-room audio stuff
  if (isHost) {
    setAmbientForRoom(currentRoom);
    syncBathroomLightForRoom(currentRoom);
    playEnterForRoom(currentRoom);
  }

  if (isHost) {
    if (!hostUnlocked) return;
    hostRoom = currentRoom;
    moveElementToRoom(hostEl, hostRoom, 'host');
    socket.emit('hostMove', { roomId: hostRoom });
  } else {
    moveElementToRoom(playerEl, currentRoom, 'player');
    socket.emit('playerMove', { roomId: currentRoom });
  }

  // ✅ IMPORTANT:
  // Do NOT call setServerRoomLight() here anymore.
  // The server-room light is now controlled only by C/8 (serverAmbOn/off).
}


  // SOCKET.IO
  socket.on('connect', () => {
    console.log('Connected to server with id', socket.id);
    socket.emit('join', { role: isHost ? 'host' : 'player' });
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  socket.on('hostPosition', (data) => {
  if (!data || !data.roomId) return;
  hostRoom = data.roomId;

  hostEl.style.display = 'block';
  moveElementToRoom(hostEl, hostRoom, 'host');

  // ✅ players: light follows host
});

  socket.on('initialHostPosition', (data) => {
    if (!isHost) return;
    if (data && data.roomId) {
      hostRoom = data.roomId;
      currentRoom = hostRoom;
      window.currentRoom = currentRoom;
      updateActiveRoom(currentRoom);

    }
  });

  function pulsePoke(duration = 1000){
  if (playerTypingIndicator) playerTypingIndicator.style.display = 'none'; // optional failsafe
  if (!playerPokeIndicator) return;

  playerPokeIndicator.style.display = 'block';
  clearTimeout(playerPokeIndicator._t);
  playerPokeIndicator._t = setTimeout(() => {
    playerPokeIndicator.style.display = 'none';
  }, duration);
}

socket.on('pokeHost', (data) => {
  if (!isHost) return;

  // show the poke ABOVE THE PLAYER on the host screen
  // (and optionally move the player ghost to the room that poked)
  const roomId = data && data.roomId ? data.roomId : null;

  if (roomId) {
    playerEl.style.display = 'block';
    playerEl.style.opacity = '0.7'; // keep ghost vibe (optional)
    moveElementToRoom(playerEl, roomId, 'player');
  }

  pulsePoke(1000); // uses #player-poke (the "!" bubble)
  playTypingSound('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/login3.mp3');

});

  socket.on('hostOnline', ({ roomId }) => {
  if (isHost) return;

  hostRoom = roomId || 'room5';
  hostEl.style.display = 'block';
  moveElementToRoom(hostEl, hostRoom, 'host');
  triggerHostArrivalEffect();

  // ✅ players: if host comes online in room2, light should be on
});

socket.on('hostOffline', () => {
  if (!isHost) {
    hostEl.style.display = 'none';
  }
});

  socket.on('ghostPlayerPosition', ({ roomId }) => {
    if (!isHost) return;
    if (!roomId) return;
    playerEl.style.opacity = '0.7';
    playerEl.style.display = 'block';
    moveElementToRoom(playerEl, roomId, 'player');
  });
  socket.on('hostAction', (data) => {
  if (!data || !data.kind) return;
  const kind = data.kind;

// whole-house night overlay (host controlled)
if (kind === 'nightOn')  setHouseNight(true);
if (kind === 'nightOff') setHouseNight(false);

  // ✅ bathroom darkness visual for everyone
  if (kind === 'lightOn')  setBathroomDarkness(true);
  if (kind === 'lightOff') setBathroomDarkness(false);

  // ✅ server room light (room2) follows C/8 for everyone
  if (kind === 'serverAmbOn')  setServerRoomLight(true);   // flicker ON + random flickers
  if (kind === 'serverAmbOff') setServerRoomLight(false);  // snap OFF

  // tv/shower visuals for everyone
  if (kind === 'tvOn') setTvVisualState(true);
  else if (kind === 'tvOff') setTvVisualState(false);

  if (kind === 'showerOn') setShowerVisualState(true);
  else if (kind === 'showerOff') setShowerVisualState(false);

  const msg = actionMessages[kind];
  if (!msg) return;

  // show popup message
  if (isHost) {
    showActorMessage('host', msg);
  } else {
    if (!popupMsgEl) return;
    popupMsgEl.classList.remove('host-msg','player-msg');
    popupMsgEl.classList.add('host-msg');
    popupMsgEl.innerHTML =
      '<span class="actor-icon actor-host"></span>' +
      '<span class="actor-text">' + msg + '</span>';
    popupMsgEl.style.display = 'flex';

    clearTimeout(showActorMessage._timeout);
    showActorMessage._timeout = setTimeout(() => {
      if (currentConversationId && !hasRespondedThisRound) {
        popupMsgEl.classList.remove('host-msg','player-msg');
        popupMsgEl.classList.add('host-msg');
        popupMsgEl.textContent = '..asks for your reaction!';
        popupMsgEl.style.display = 'block';
      } else {
        popupMsgEl.style.display = 'none';
      }
    }, 4000);
  }
});

  socket.on('conversationStart', ({ conversationId }) => {
  currentConversationId = conversationId;
  hasRespondedThisRound = false;

  if (playerChatEl) playerChatEl.style.display = 'grid';
setChatLocked(false);

  if (isHost) {
    convoOpen = true;
    // hostWaiting is shown by key "2"
} else {

  if (chatInputEl) {
    chatInputEl.value = '';
    setTimeout(() => {
      try { chatInputEl.focus({ preventScroll: true }); } catch(e) { chatInputEl.focus(); }
    }, 50);
  }

  if (popupMsgEl) {
    popupMsgEl.classList.remove('host-msg','player-msg');
    popupMsgEl.classList.add('host-msg');
    popupMsgEl.textContent = 'react to the host…';
    popupMsgEl.style.display = 'block';
  }
  }
});




socket.on('conversationResult', ({ message }) => {
  const text = (message && String(message).trim()) ? String(message) : 'no response..';

  resultShowing = true;
  setTimeout(() => { resultShowing = false; }, 6500); // slightly > 6000

  if (isHost) {
    hostWaiting = false;
    if (popupMsgEl) popupMsgEl.style.display = 'none';
    playSound(pickRandomFromPool('message'));
    showActorMessage('player', text, 6000);
    return;
  }

 

  showActorMessage('player', text, 6000);
});

socket.on('conversationEnd', ({ conversationId }) => {
  if (conversationId !== currentConversationId) return;

  currentConversationId = null;
  hasRespondedThisRound = false;

  if (isHost) {
    convoOpen = false;

    if (hostWaiting) {
      hostWaiting = false;
      if (popupMsgEl) popupMsgEl.style.display = 'none';
    }
  }

  // PLAYER: only do something if chat is NOT already locked/visible
  if (!isHost) {
    // If it's already locked, do nothing (prevents blink)
    const alreadyLocked = !!chatInputEl && chatInputEl.disabled;

    if (!alreadyLocked) {
      showPlayerChatLocked(); // this also sets placeholder + disabled
    }
  }

  if (!isHost && popupMsgEl && !resultShowing) popupMsgEl.style.display = 'none';
});

socket.on('playerTyping', ({ conversationId, typing }) => {
  if (!isHost) return;
  if (!currentConversationId || conversationId !== currentConversationId) return;

  // typing belongs to PLAYER, not host
  if (!playerTypingIndicator) return;

  if (typing) {
    playerTypingIndicator.textContent = '...';
    playerTypingIndicator.style.display = 'block';
  } else {
    playerTypingIndicator.style.display = 'none';
  }
});


  hostEl.addEventListener('click', () => {
  if (isHost) return;
  if (currentRoom !== hostRoom) return;

  playClickSound();


  // ✅ show "!" above the PLAYER (poke indicator only)
pulsePoke(1000);

playTypingSound('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/login3.mp3');


// send to server so host can see it too
socket.emit('pokeHost', { roomId: currentRoom });



  // optional little physical feedback
  const originalTransform = hostEl.style.transform || '';
  hostEl.style.transform = originalTransform + ' scale(1.1)';
  setTimeout(() => {
    moveElementToRoom(hostEl, hostRoom, 'host');
  }, 50);
});
  function sendPlayerMessage() {
    if (chatInputEl && chatInputEl.disabled) return;

    if (!playerChatEl || !chatInputEl) return;

    if (!currentConversationId) return;
    if (hasRespondedThisRound) return;

    const text = chatInputEl.value.trim();
    if (!text) return;

    const convId = currentConversationId;

    socket.emit('playerMessage', {
      conversationId: convId,
      text
    });

    // ✅ keep chat visible, but lock it immediately (and clear the input)
if (!isHost) {
  showPlayerChatLocked();
}
playTypingSound('https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/login3.mp3');

    hasRespondedThisRound = true;
    setChatLocked(true);
    playerChatEl.style.display = 'grid'; // keep it visible

    if (popupMsgEl && !isHost) {
      popupMsgEl.style.display = 'none';
    }

    if (playerTypingIndicator) {
  playerTypingIndicator.style.display = 'block';
  playerTypingIndicator.textContent = '...';
}

    socket.emit('playerTyping', {
      conversationId: convId,
      typing: true
    });

    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        if (playerTypingIndicator) {
  playerTypingIndicator.style.display = 'none';
}

      socket.emit('playerTyping', {
        conversationId: convId,
        typing: false
      });
    }, 2200);
  }

  if (chatSendEl) {
    chatSendEl.addEventListener('click', () => {
      if (!isHost) sendPlayerMessage();
    });
  }

  if (chatInputEl) {
    chatInputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!isHost) sendPlayerMessage();
      }
    });

    chatInputEl.addEventListener('input', () => {
        if (!playerTypingIndicator) return;
const hasText = !!chatInputEl.value.trim();
playerTypingIndicator.textContent = '...';
playerTypingIndicator.style.display = hasText ? 'block' : 'none';

      if (!currentConversationId) return;
      socket.emit('playerTyping', {
        conversationId: currentConversationId,
        typing: hasText
      });
    });
  }



  function setChatLocked(isLocked) {
  if (!chatInputEl || !chatSendEl) return;

  if (isLocked) {
    chatInputEl.value = '';
    chatInputEl.placeholder = 'wait for the host..';
    chatInputEl.disabled = true;
    chatSendEl.disabled = true;
  } else {
    chatInputEl.value = '';
    chatInputEl.placeholder = 'type your reaction…';
    chatInputEl.disabled = false;
    chatSendEl.disabled = false;
  }
}

function showPlayerChatLocked() {
  if (!playerChatEl) return;
  playerChatEl.style.display = 'grid';
  setChatLocked(true);

}

function showPlayerChatUnlocked() {
  if (!playerChatEl) return;
  playerChatEl.style.display = 'grid';
  setChatLocked(false);
}


  document.querySelectorAll('.door').forEach(door => {
    const target  = door.dataset.target;
    door.addEventListener('click', (e) => {
      e.stopPropagation();
      if (target) goToRoom(target);
    });
  });

  document.querySelectorAll('.room').forEach(room => {
    room.addEventListener('click', () => {
      goToRoom(room.id);
    });
  });

  function flashButton(actionName, pulses = 2, interval = 140) {
  let btn = document.querySelector('.action-btn[data-action="' + actionName + '"]');

  // if this is an OFF action, flash the parent ON button
  if (!btn) {
    const offBadge = document.querySelector('.off-badge[data-action="' + actionName + '"]');
    if (offBadge) btn = offBadge.closest('.action-btn');
  }
  if (!btn) return;

  // cancel any existing pulse on this button
  if (btn._flashTimer) clearInterval(btn._flashTimer);
  btn.classList.remove('active-flash');

  let count = 0;
  btn._flashTimer = setInterval(() => {
    btn.classList.toggle('active-flash');
    count++;

    // each pulse is ON+OFF => 2 toggles
    if (count >= pulses * 2) {
      clearInterval(btn._flashTimer);
      btn._flashTimer = null;
      btn.classList.remove('active-flash');
    }
  }, interval);
}

  function stopTvLoop() {
    if (tvAudio) {
      try {
        tvAudio.pause();
        tvAudio.currentTime = 0;
      } catch (e) {}
      tvAudio = null;
    }
  }

  function stopShowerLoop() {
    if (showerAudio) {
      try {
        showerAudio.pause();
        showerAudio.currentTime = 0;
      } catch (e) {}
      showerAudio = null;
    }
  }
  function triggerHostAction(kind) {
  if (!isHost || !hostUnlocked) return;

  const allowed = new Set(roomActions[currentRoom] || []);
  if (!allowed.has(kind)) return;

  const msg = actionMessages[kind];
  if (msg) showActorMessage('host', msg);

  // broadcast to players
  socket.emit('hostAction', { kind });

  // --- special OFF actions that stop loops ---
  if (kind === 'tvOff') {
    flashButton('tvOff');
    playSound(TV_OFF_ONESHOT_URL);
    stopTvLoop();
    setTvVisualState(false);
    return;
  }

  // ✅ C/8 now controls BOTH:
  // - server ambience (host-only audio)
  // - server room light (everyone visual via hostAction handler)
  if (kind === 'serverAmbOff') {
    flashButton('serverAmbOff');

    serverAmbientEnabled = false;
    playSound(SERVERS_OFF_URL);

    // host local audio
    if (currentRoom === 'room2') stopAmbient();

    // host local visual (players will also do it via socket.on('hostAction'))
    setServerRoomLight(false);

    return;
  }

  if (kind === 'serverAmbOn') {
    flashButton('serverAmbOn');

    serverAmbientEnabled = true;
    playSound(SERVERS_ON_URL);

    // host local audio (only starts if actually in room2)
    if (currentRoom === 'room2') setAmbientForRoom('room2');

    // host local visual (players will also do it via socket.on('hostAction'))
    setServerRoomLight(true);

    return;
  }

  if (kind === 'showerOff') {
    flashButton('showerOff');
    playSound(SHOWER_OFF_ONESHOT_URL);
    stopShowerLoop();
    setShowerVisualState(false);
    return;
  }

  if (kind === 'lightOff') {
    flashButton('lightOff');
    setBathroomDarkness(false);

    bathroomLightEnabled = false;
    playSound(LIGHT_OFF_SWITCH_URL);
    syncBathroomLightForRoom(currentRoom);
    return;
  }

  // --- normal actions ---
  flashButton(kind);

  switch (kind) {
    case 'sleep':
    startNightPulse(); // ✅ night for 10s, then day again (broadcast)

      playSound(pickRandomFromPool('sleep'));
      break;

    case 'table':
      playSound(pickRandomFromPool('table'));
      break;

    case 'lightOn': {
      bathroomLightEnabled = true;
      setBathroomDarkness(true);
      playSound(LIGHT_ON_SWITCH_URL);
      syncBathroomLightForRoom(currentRoom);
      break;
    }

    case 'piano':
      playSound(pickRandomFromPool('piano'));
      break;

    case 'water':
      playSound(pickRandomFromPool('water'));
      break;

    case 'showerOn': {
      stopShowerLoop();
      setShowerVisualState(true);
      const url = pickRandomFromPool('shower');
      if (!url) break;
      try {
        showerAudio = new Audio(url);
        showerAudio.loop = true;
        showerAudio.play().catch(() => {});
      } catch (e) {
        console.error(e);
      }
      break;
    }

    case 'brush':
      playSound(pickRandomFromPool('brush'));
      break;

    case 'dinner':
      playSound(pickRandomFromPool('dinner'));
      break;

    case 'tvOn': {
      stopTvLoop();
      setTvVisualState(true);
      const url = pickRandomFromPool('tvOn');
      if (!url) return;
      try {
        tvAudio = new Audio(url);
        tvAudio.loop = true;
        tvAudio.play().catch(() => {});
      } catch (e) {
        console.error(e);
      }
      break;
    }
  }
}

  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      triggerHostAction(action);
    });
  });



  document.addEventListener('keydown', (e) => {

    
    if (!isHost || !hostUnlocked) return;

    const dirKeyMap = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right'
    };
    const dir = dirKeyMap[e.key];
    if (dir) {
      e.preventDefault();
      const nav = arrowNav[currentRoom];
      if (nav && nav[dir]) {
        goToRoom(nav[dir]);
      }
    }

    // ENTER toggles the 10-minute timeline (host only)
// (avoid triggering while typing in inputs)
if (e.key === 'Enter') {
  const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
  if (tag !== 'input' && tag !== 'textarea') {
    e.preventDefault();
    toggleTimeline();
    return;
  }
}

    switch (e.key) {
      case 'z':
      case 'Z':
        triggerHostAction('sleep');
        break;
      case 't':
      case 'T':
        triggerHostAction('table');
        break;
      case 'p':
      case 'P':
        triggerHostAction('piano');
        break;
        case 'l':
case 'L':
  triggerHostAction('lightOn');
  break;

  case 'c':
case 'C':
  triggerHostAction('serverAmbOn');

  break;

case '8':
  triggerHostAction('serverAmbOff');
  break;

case '9':
  triggerHostAction('lightOff');
  break;
      case 'w':
      case 'W':
        triggerHostAction('water');
        break;
      case 's':
      case 'S':
        triggerHostAction('showerOn');
        break;
      case 'X':
      case 'x':
        triggerHostAction('showerOff');
        break;
      case 'b':
      case 'B':
        triggerHostAction('brush');
        break;
      case 'd':
      case 'D':
        triggerHostAction('dinner');
        break;
      case '1':
        triggerHostAction('tvOn');
        break;
      case '0':
        triggerHostAction('tvOff');
        break;
        case '2': {
  if (convoOpen) break;

  startConvoLoop(); // <-- no argument now
  socket.emit('startConversation');
  hostWaiting = true;
  showHostWaitingMessage(null);
  break;
}

case '3': {
  if (!convoOpen) break;

  stopConvoLoop();
  socket.emit('endConversation');
  break;
}
    } // <-- closes switch
  }); // <-- closes addEventListener

  function completeHostLogin() {
    const val = (hostPasswordEl.value || '').trim();
    if (val !== 'host') return;

    playSound(HOST_LOGIN_SUCCESS_URL);


    hostUnlocked = true;
    hostLoginEl.style.display = 'none';

    hostEl.style.display = 'block';
    updateActiveRoom(hostRoom);
    moveElementToRoom(hostEl, hostRoom, 'host');
    triggerHostArrivalEffect();
    playSound(ARRIVAL_SOUND_URL);

    if (timelineWrapEl) timelineWrapEl.style.display = 'block';
setTimelineUI(0);

    if (actionBarEl) {
      actionBarEl.style.display = 'grid';
      updateActionBarForRoom(hostRoom);
    }



    socket.emit('hostReady');
  }

  if (hostLoginBtn) {
    hostLoginBtn.addEventListener('click', () => {
      completeHostLogin();
      playSound(LOGIN_MOMENT); // <-- one-shot for "X"

    });
  }

  const LOGIN_TYPE_URL = 'https://pub-e2eda233e65d46ef9ded8e7546600fc3.r2.dev/login.mp3'; // replace later

if (hostPasswordEl) {
  lastLoginLen = (hostPasswordEl.value || '').length;

  hostPasswordEl.addEventListener('input', () => {
    const val = hostPasswordEl.value || '';
    const len = val.length;

    // only play on "added" characters (not backspace/delete)
    if (len > lastLoginLen) {
      playTypingSound(LOGIN_TYPE_URL);
    }
    lastLoginLen = len;
  });

  hostPasswordEl.addEventListener('focus', () => {
    lastLoginLen = (hostPasswordEl.value || '').length;
  });
}





  window.addEventListener('load', () => {
    hostEl.style.display = 'none';
    setHouseNight(false);



    if (hostBannerEl) {
      hostBannerEl.textContent = isHost
        ? 'to join visit room2.net'
        : 'volume ON is allowed';
      hostBannerEl.style.display = 'block';
    }

    if (isHost) {
      if (hostLoginEl)  hostLoginEl.style.display = 'flex';
      playerEl.style.display = 'none';
      if (playerChatEl) playerChatEl.style.display = 'none';

      currentRoom = hostRoom;
      window.currentRoom = currentRoom;
      updateActiveRoom(currentRoom);
      setAmbientForRoom(currentRoom); // host only
      syncBathroomLightForRoom(currentRoom);     // ✅ add this



// start dark if servers are off, lit/flicker if on
setServerRoomLight(!!serverAmbientEnabled);


// don't play enter sound on initial load (only after first actual move)
didInitialEnterSound = true;
    } else {
      if (hostLoginEl) hostLoginEl.style.display = 'none';

      currentRoom = 'room5';
      window.currentRoom = currentRoom;
      updateActiveRoom(currentRoom);
      moveElementToRoom(playerEl, currentRoom, 'player');
      socket.emit('playerMove', { roomId: currentRoom });
      stopAmbient(); // make sure players never run ambient

      if (actionBarEl) actionBarEl.style.display = 'none';
      setServerRoomLight(false); // start dark for players
      showPlayerChatLocked();


    }
    setBathroomDarkness(bathroomLightEnabled);

  });
</script>
</body>
</html>
