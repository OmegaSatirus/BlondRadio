const STREAM_URL = "https://abusedly-crustless-beaulah.ngrok-free.dev/radio";

const playBtn = document.getElementById("playBtn");
const liveEl  = document.getElementById("liveStatus");

const artistEl = document.getElementById("trackArtist");
const titleEl  = document.getElementById("trackTitle");

let player = null;
let tocando = false;

/* ===============================
   PLAY ANDROID-SAFE
================================ */
playBtn.addEventListener("click", () => {
  if (tocando) return;

  playBtn.textContent = "⏳ Conectando...";
  playBtn.disabled = true;

  // 🔥 CRIA O AUDIO NO CLIQUE (ESSENCIAL)
  player = document.createElement("audio");
  player.src = STREAM_URL;
  player.preload = "none";
  player.playsInline = true;
  player.autoplay = false;
  player.controls = false;

  document.body.appendChild(player);

  const tentativa = player.play();

  if (tentativa !== undefined) {
    tentativa.then(() => {
      tocando = true;
      liveEl.textContent = "🔴 AO VIVO";
      playBtn.textContent = "🔊 Tocando";
    }).catch(err => {
      console.error("Android bloqueou:", err);
      resetarPlayer();
    });
  }
});

function resetarPlayer() {
  tocando = false;
  playBtn.disabled = false;
  playBtn.textContent = "▶️ Tentar novamente";
  liveEl.textContent = "⚠️ Toque para ouvir";

  if (player) {
    player.pause();
    player.remove();
    player = null;
  }
}
