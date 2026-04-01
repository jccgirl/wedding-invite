function openInvite() {
  document.getElementById("hero").style.display = "none";
  document.getElementById("content").classList.remove("hidden");

  for (let i = 0; i < 20; i++) {
    setTimeout(createRose, i * 120);
  }
}

function updateCountdown() {
  const target = new Date('2026-05-02T00:00:00');
  const now = new Date();
  const diff = target - now;

  if (diff <= 0) {
    document.getElementById('countdown').innerHTML = '<strong>Es ist soweit! 💍</strong>';
    clearInterval(window.weddingCountdownInterval);
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Start countdown immediately and update every second
window.weddingCountdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

function createRose() {
  const rose = document.createElement("div");
  rose.innerHTML = "✨"; // subtil statt knall-rose
  rose.classList.add("rose-fall");

  rose.style.left = Math.random() * 100 + "vw";
  rose.style.animationDuration = (4 + Math.random() * 3) + "s";

  document.getElementById("roseContainer").appendChild(rose);

  setTimeout(() => rose.remove(), 7000);
}

// FORM
const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbxj4JVLEuOJ9Rc8u5cr-FVkvJe6F79uq2Fd7SvCM1Q3QEq6uHQUQDoHJSdDcze60rU/exec"; // <-- hier anpassen

document.getElementById("rsvpForm").addEventListener("submit", async function(e){
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const anzahl = document.getElementById("anzahl").value.trim();
  const nachricht = document.getElementById("nachricht").value.trim();
  const submitButton = this.querySelector("button[type='submit']");
  const successMessage = document.getElementById("successMessage");

  submitButton.disabled = true;
  submitButton.textContent = "Senden...";
  successMessage.style.display = "block";
  successMessage.textContent = "Deine Antwort wird versendet...";

  const payload = new Blob([JSON.stringify({ name, anzahl, nachricht })], { type: "application/json" });

  if (navigator.sendBeacon) {
    const beaconResult = navigator.sendBeacon(SHEET_ENDPOINT, payload);
    console.log("sendBeacon status:", beaconResult);

    successMessage.textContent = "Danke! Deine Antwort wurde gesendet 🤍";
    this.reset();
    submitButton.disabled = false;
    submitButton.textContent = "Antwort senden";
    return;
  }

  try {
    await fetch(SHEET_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, anzahl, nachricht })
    });

    successMessage.textContent = "Danke! Deine Antwort wurde gesendet 🤍";
    this.reset();
  } catch (error) {
    console.error("RSVP Sheet Fehler:", error);
    successMessage.textContent = "Fehler beim Senden, bitte später erneut versuchen.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Antwort senden";
  }
});

// OPEN ENVELOPE + MUSIC
const opening = document.getElementById("opening");
const openBtn = document.getElementById("openBtn");
const mainContent = document.getElementById("mainContent");
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

let musicPlaying = false;
let wasPlayingBeforeHidden = false;
function tryPlayMusic() {
  if (!bgMusic) return;
  bgMusic.muted = false;
  bgMusic.play().then(() => {
    musicPlaying = true;
    if (musicBtn) musicBtn.innerText = "🔊";
  }).catch(() => {
    // Browser may block autoplay, but we keep the state as unmuted intent
    musicPlaying = false;
    if (musicBtn) musicBtn.innerText = "🔊";
  });
}

window.addEventListener('DOMContentLoaded', () => {
  if (bgMusic) {
    bgMusic.muted = false;
  }
  if (musicBtn) {
    musicBtn.innerText = "🔊";
  }
  tryPlayMusic();
});

if (openBtn) openBtn.addEventListener("click", () => {
  if (opening) opening.style.display = "none";
  if (mainContent) mainContent.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  tryPlayMusic();
});

function openInvite() {
  document.getElementById("hero").style.display = "none";
  document.getElementById("content").classList.remove("hidden");

  if (musicBtn) {
    musicBtn.style.display = "block";
  }

  for (let i = 0; i < 20; i++) {
    setTimeout(createRose, i * 120);
  }

  tryPlayMusic();
}

if (musicBtn) musicBtn.addEventListener("click", () => {
  if (!musicPlaying) tryPlayMusic();
  else {
    if (bgMusic) bgMusic.pause();
    musicPlaying = false;
    musicBtn.innerText = "🔇";
  }
});

// Pause music when the page becomes hidden or is unloaded.
document.addEventListener('visibilitychange', () => {
  if (!bgMusic) return;
  if (document.hidden) {
    wasPlayingBeforeHidden = !bgMusic.paused;
    if (!bgMusic.paused) bgMusic.pause();
    musicPlaying = false;
    if (musicBtn) musicBtn.innerText = "🔇";
  } else {
    if (wasPlayingBeforeHidden) {
      // Try to resume when user returns.
      tryPlayMusic();
      wasPlayingBeforeHidden = false;
    }
  }
});

window.addEventListener('pagehide', () => {
  if (bgMusic && !bgMusic.paused) bgMusic.pause();
  musicPlaying = false;
  if (musicBtn) musicBtn.innerText = "🔇";
});

window.addEventListener('beforeunload', () => {
  if (bgMusic && !bgMusic.paused) bgMusic.pause();
});