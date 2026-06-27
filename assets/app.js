const tracks = [
  ["Feels (Moment of Solitary)", "Lee Gaon", "flash/media/01 Feels (Moment of Solitary).mp3", 279],
  ["Nothing You Can Do", "Avigail Roz", "flash/media/02 Nothing You Can Do.mp3", 220],
  ["I Know I", "Ofri Ben David", "flash/media/03 I Know I.mp3", 270],
  ["Without The Hope", "Daniel Brecher", "flash/media/04 Without The Hope.mp3", 206],
  ["Rain", "Ido Sternberg", "flash/media/05 Rain.mp3", 223],
  ["Painless", "Lee Gaon", "flash/media/06 Painless.mp3", 306],
  ["Leave Me Alone", "Riff Cohen", "flash/media/07 Leave Me Alone.mp3", 260],
  ["Theme Of Hope", "Hope’s Strings Orchestra", "flash/media/08 Theme of Hope.mp3", 104],
  ["Black & White", "Tamar Capsouto", "flash/media/09 Black & White.mp3", 258]
].map(([title, vocalist, file, duration]) => ({ title, vocalist, file, duration }));

const root = document.documentElement;
const cityPanorama = document.querySelector(".city-panorama");
const stage = document.querySelector(".stage");
const panels = [...document.querySelectorAll(".panel")];
const panelControls = [...document.querySelectorAll("[data-panel-target]")];
const sectionControls = [...document.querySelectorAll(".section-nav [data-panel-target]")];
const panelStepControls = [...document.querySelectorAll("[data-panel-step]")];

const lyricControls = [...document.querySelectorAll("[data-lyrics-target]")];
const lyricStepControls = [...document.querySelectorAll("[data-lyrics-step]")];
const lyrics = [...document.querySelectorAll("[data-lyric]")];
const cityPositions = {
  about: 15,
  lyrics: 36,
  credits: 52,
  contact: 67,
  links: 82,
  download: 92
};

const audio = document.querySelector("#audio");
const player = document.querySelector(".player");
const playPause = document.querySelector("#play-pause");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const progress = document.querySelector("#progress");
const volume = document.querySelector("#volume");
const mute = document.querySelector("#mute");
const elapsed = document.querySelector("#elapsed");
const duration = document.querySelector("#duration");
const playerTitle = document.querySelector("#player-title");
const playerArtist = document.querySelector("#player-artist");
const playerIndex = document.querySelector(".player-index");
const playerStatus = document.querySelector("#player-status");
const playlistToggle = document.querySelector("#playlist-toggle");
const playlist = document.querySelector("#playlist");
const queueButtons = [...document.querySelectorAll("[data-queue-track]")];
const isSafari =
  /Safari/.test(navigator.userAgent) &&
  !/Chrome|Chromium|CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);

if (isSafari) {
  root.classList.add("is-safari");
}

let currentPanel = 0;
let currentTrack = 0;
let currentLyric = "moment";
let previousVolume = 0.8;
let pointerStart = null;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

function panelIndexFor(name) {
  return panels.findIndex((panel) => panel.dataset.panel === name);
}

function showPanel(index, updateHistory = true) {
  const boundedIndex = Math.max(0, Math.min(panels.length - 1, index));
  currentPanel = boundedIndex;
  const activeName = panels[currentPanel].dataset.panel;
  const panelStep = 100 / panels.length;
  const cityPosition = cityPositions[activeName] ?? cityPositions.about;

  root.style.setProperty("--panel-offset", `${currentPanel * -panelStep}%`);
  root.style.setProperty("--city-position", `${cityPosition}%`);

  panels.forEach((panel, panelIndex) => {
    const active = panelIndex === currentPanel;
    panel.classList.toggle("is-active", active);
    panel.setAttribute("aria-hidden", String(!active));
    panel.inert = !active;
    if (active) {
      panel.querySelector(".content-card").scrollTop = 0;
    }
  });

  sectionControls.forEach((control) => {
    const active = control.dataset.panelTarget === activeName;
    control.classList.toggle("is-active", active);
    if (active) {
      control.setAttribute("aria-current", "page");
      control.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    } else {
      control.removeAttribute("aria-current");
    }
  });

  if (updateHistory && location.hash !== `#${activeName}`) {
    history.pushState({ panel: activeName }, "", `#${activeName}`);
  }
}

function showPanelFromHash() {
  const index = panelIndexFor(location.hash.slice(1));
  showPanel(index >= 0 ? index : 0, false);
}

panelControls.forEach((control) => {
  control.addEventListener("click", () => {
    showPanel(panelIndexFor(control.dataset.panelTarget));
  });
});

panelStepControls.forEach((control) => {
  control.addEventListener("click", () => {
    showPanel(currentPanel + Number(control.dataset.panelStep));
  });
});

window.addEventListener("popstate", showPanelFromHash);
window.addEventListener("hashchange", showPanelFromHash);

stage.addEventListener("pointerdown", (event) => {
  if (event.target.closest("input, textarea, button, a")) return;
  pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
});

stage.addEventListener("pointerup", (event) => {
  if (!pointerStart || pointerStart.id !== event.pointerId) return;
  const deltaX = event.clientX - pointerStart.x;
  const deltaY = event.clientY - pointerStart.y;
  pointerStart = null;

  if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.35) {
    showPanel(currentPanel + (deltaX < 0 ? 1 : -1));
  }
});

stage.addEventListener("pointercancel", () => {
  pointerStart = null;
});

function showLyrics(name) {
  currentLyric = name;
  lyrics.forEach((lyric) => {
    const active = lyric.dataset.lyric === name;
    lyric.classList.toggle("is-active", active);
    lyric.hidden = !active;
  });

  lyricControls.forEach((control) => {
    control.classList.toggle("is-active", control.dataset.lyricsTarget === name);
  });

  document.querySelector(".lyrics-scroll").scrollTop = 0;
}

lyricControls.forEach((control) => {
  control.addEventListener("click", () => showLyrics(control.dataset.lyricsTarget));
});

lyricStepControls.forEach((control) => {
  control.addEventListener("click", () => {
    const currentIndex = lyrics.findIndex((lyric) => lyric.dataset.lyric === currentLyric);
    const step = Number(control.dataset.lyricsStep) || 0;
    const nextIndex = (currentIndex + step + lyrics.length) % lyrics.length;
    showLyrics(lyrics[nextIndex].dataset.lyric);
  });
});

function setTrack(index, shouldPlay = false) {
  currentTrack = (index + tracks.length) % tracks.length;
  const track = tracks[currentTrack];

  audio.src = track.file;
  playerTitle.textContent = track.title;
  playerArtist.textContent = `Tal Aviram · ${track.vocalist}`;
  playerIndex.textContent = String(currentTrack + 1).padStart(2, "0");
  elapsed.textContent = "0:00";
  duration.textContent = formatTime(track.duration);
  progress.value = 0;

  queueButtons.forEach((button, indexOfButton) => {
    button.classList.toggle("is-active", indexOfButton === currentTrack);
  });

  if ("mediaSession" in navigator && "MediaMetadata" in window) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: `Tal Aviram · ${track.vocalist}`,
      album: "Without The Hope"
    });
  }

  if (shouldPlay) {
    play();
  } else {
    setPlayerState(false);
  }
}

function setPlayerState(isPlaying) {
  player.dataset.state = isPlaying ? "playing" : "paused";
  playPause.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
}

async function play() {
  try {
    await audio.play();
    setPlayerState(true);
    playerStatus.textContent = `Playing ${tracks[currentTrack].title}`;
  } catch {
    setPlayerState(false);
    playerStatus.textContent = "Playback could not start.";
  }
}

function pause() {
  audio.pause();
  setPlayerState(false);
  playerStatus.textContent = `Paused ${tracks[currentTrack].title}`;
}

function togglePlayback() {
  if (audio.paused) {
    play();
  } else {
    pause();
  }
}

function togglePlaylist(force) {
  const shouldOpen = typeof force === "boolean" ? force : playlist.hidden;
  playlist.hidden = !shouldOpen;
  playlistToggle.setAttribute("aria-expanded", String(shouldOpen));
}

playlistToggle.addEventListener("click", () => togglePlaylist());
playPause.addEventListener("click", togglePlayback);
previous.addEventListener("click", () => setTrack(currentTrack - 1, true));
next.addEventListener("click", () => setTrack(currentTrack + 1, true));

queueButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setTrack(Number(button.dataset.queueTrack), true);
    togglePlaylist(false);
  });
});

document.addEventListener("click", (event) => {
  if (!playlist.hidden && !event.target.closest("#playlist, #playlist-toggle")) {
    togglePlaylist(false);
  }
});

audio.addEventListener("play", () => setPlayerState(true));
audio.addEventListener("pause", () => setPlayerState(false));
audio.addEventListener("ended", () => setTrack(currentTrack + 1, true));

audio.addEventListener("timeupdate", () => {
  elapsed.textContent = formatTime(audio.currentTime);
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    progress.value = Math.round((audio.currentTime / audio.duration) * 1000);
  }
});

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("error", () => {
  playerStatus.textContent = `Unable to load ${tracks[currentTrack].title}.`;
  setPlayerState(false);
});

progress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration)) {
    audio.currentTime = (Number(progress.value) / 1000) * audio.duration;
  }
});

volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
  audio.muted = audio.volume === 0;
  if (audio.volume > 0) previousVolume = audio.volume;
  mute.setAttribute("aria-label", audio.muted ? "Unmute" : "Mute");
});

mute.addEventListener("click", () => {
  if (audio.muted || audio.volume === 0) {
    audio.muted = false;
    audio.volume = previousVolume || 0.8;
    volume.value = audio.volume;
  } else {
    previousVolume = audio.volume;
    audio.muted = true;
    volume.value = 0;
  }
  mute.setAttribute("aria-label", audio.muted ? "Unmute" : "Mute");
});

document.addEventListener("keydown", (event) => {
  const tagName = document.activeElement?.tagName;
  const interactive = ["INPUT", "TEXTAREA", "BUTTON", "A"].includes(tagName);

  if (event.key === "Escape" && !playlist.hidden) {
    togglePlaylist(false);
    playlistToggle.focus();
  } else if (!interactive && event.key === "ArrowRight") {
    event.preventDefault();
    showPanel(currentPanel + 1);
  } else if (!interactive && event.key === "ArrowLeft") {
    event.preventDefault();
    showPanel(currentPanel - 1);
  } else if (!interactive && event.code === "Space") {
    event.preventDefault();
    togglePlayback();
  }
});

if ("mediaSession" in navigator) {
  const actions = {
    play,
    pause,
    previoustrack: () => setTrack(currentTrack - 1, true),
    nexttrack: () => setTrack(currentTrack + 1, true)
  };

  Object.entries(actions).forEach(([action, handler]) => {
    try {
      navigator.mediaSession.setActionHandler(action, handler);
    } catch {
      // Individual Media Session actions vary by browser.
    }
  });
}

function syncInitialState() {
  audio.volume = 0.8;
  setTrack(0);
  showLyrics("moment");
  showPanelFromHash();
}

syncInitialState();
requestAnimationFrame(() => root.classList.add("is-ready"));

window.addEventListener("load", () => {
  requestAnimationFrame(syncInitialState);
}, { once: true });
