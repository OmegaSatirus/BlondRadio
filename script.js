// ============================
// CONFIG
// ============================
const STREAM_URL = "https://abusedly-crustless-beaulah.ngrok-free.dev/radio?nocache=1";
const STATUS_URL = "https://abusedly-crustless-beaulah.ngrok-free.dev/status-json.xsl";

// ============================
// ELEMENTOS
// ============================
const audio     = document.getElementById("radioPlayer");
const playBtn   = document.getElementById("playBtn");
const artistEl  = document.getElementById("trackArtist");
const titleEl   = document.getElementById("trackTitle");
const coverEl   = document.getElementById("coverArt");
const liveEl    = document.getElementById("liveStatus");

// ============================
// ESTADO
// ============================
let ultimaMusica = "";

// ============================
// PLAYER (compatível com mobile)
// ============================
audio.src = STREAM_URL;
audio.preload = "none";
audio.playsInline = true;

playBtn.addEventListener("click", async () => {
  try {
    await audio.play();
    playBtn.style.display = "none";
  } catch (err) {
    alert("Toque novamente para iniciar o áudio");
  }
});

// reconecta se o Icecast travar
audio.addEventListener("error", () => {
  audio.load();
});

// ============================
// ATUALIZAR STATUS / MÚSICA
// ============================
async function atualizarMusica() {
  try {
    const res = await fetch(STATUS_URL, { cache: "no-store" });
    const data = await res.json();

    let source = data.icestats.source;

    // múltiplos mounts
    if (Array.isArray(source)) {
      source = source.find(s => s.listenurl?.includes("/radio"));
    }

    if (!source) {
      liveEl.textContent = "⚫ OFFLINE";
      return;
    }

    liveEl.textContent = "🔴 AO VIVO";

    const icy = source?.metadata?.x_icy_title;
    if (!icy || icy === ultimaMusica) return;

    ultimaMusica = icy;

    let artista = "Desconhecido";
    let musica  = icy;

    if (icy.includes(" - ")) {
      [artista, musica] = icy.split(" - ", 2);
    }

    // animação simples
    artistEl.style.opacity = 0;
    titleEl.style.opacity  = 0;
    coverEl.style.opacity  = 0;

    setTimeout(() => {
      artistEl.textContent = artista.trim();
      titleEl.textContent  = musica.trim();

      // capa padrão (Icecast não fornece capa)
      coverEl.src = "cover-default.jpg";

      artistEl.style.opacity = 1;
      titleEl.style.opacity  = 1;
      coverEl.style.opacity  = 1;
    }, 300);

  } catch (err) {
    liveEl.textContent = "🟡 CONECTANDO...";
  }
}

// ============================
// INIT
// ============================
atualizarMusica();
setInterval(atualizarMusica, 5000);
