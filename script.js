const STREAM_URL = "https://abusedly-crustless-beaulah.ngrok-free.dev/radio";
const STATUS_URL = "https://abusedly-crustless-beaulah.ngrok-free.dev/status-json.xsl";

const player = document.getElementById("radioPlayer");
const playBtn = document.getElementById("playBtn");
const liveEl = document.getElementById("liveStatus");

const artistEl = document.getElementById("trackArtist");
const titleEl  = document.getElementById("trackTitle");
const coverEl  = document.getElementById("coverArt");

let isPlaying = false;
let ultimaMusica = "";

/* ===============================
   PLAY (mobile safe)
================================ */
playBtn.addEventListener("click", async () => {
  if (isPlaying) return;

  playBtn.textContent = "⏳ Conectando...";
  playBtn.disabled = true;

  // define o src SOMENTE no clique
  player.src = STREAM_URL;
  player.load();

  try {
    await player.play();
    isPlaying = true;

    playBtn.textContent = "🔊 Ao vivo";
    liveEl.textContent = "🔴 AO VIVO";
  } catch (err) {
    console.error("Falha ao tocar:", err);
    playBtn.textContent = "▶️ Tentar novamente";
    playBtn.disabled = false;
  }
});

/* ===============================
   STATUS / METADADOS
================================ */
async function atualizarMusica() {
  try {
    const res = await fetch(STATUS_URL, { cache: "no-store" });
    const data = await res.json();

    let source = data.icestats.source;
    if (Array.isArray(source)) {
      source = source.find(s => s.listenurl?.includes("/radio"));
    }

    if (!source) {
      liveEl.textContent = "⚫ OFFLINE";
      return;
    }

    const icy = source?.metadata?.x_icy_title;
    if (!icy || icy === ultimaMusica) return;

    ultimaMusica = icy;

    let artista = "Desconhecido";
    let musica = icy;

    if (icy.includes(" - ")) {
      [artista, musica] = icy.split(" - ", 2);
    }

    artistEl.textContent = artista.trim();
    titleEl.textContent  = musica.trim();

  } catch (err) {
    liveEl.textContent = "🟡 CONECTANDO...";
  }
}

setInterval(atualizarMusica, 5000);
