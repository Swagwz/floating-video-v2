function $doc(selector) {
  return document.querySelector(selector);
}
const video = $doc("video");
// 音量相關
const btnSound = $doc(".sound");
const btnMute = $doc(".mute");
const inputVolume = $doc("#tuneVolume");

let currentVolume = video.volume;
inputVolume.value = currentVolume;

function updateSoundUI() {
  if (video.volume > 0 && inputVolume.value > 0) {
    $doc(".sound").classList.add("visible");
    $doc(".mute").classList.remove("visible");
  } else {
    $doc(".sound").classList.remove("visible");
    $doc(".mute").classList.add("visible");
  }
}

btnSound.addEventListener("click", () => {
  video.muted = true;
  video.volume = 0;
  inputVolume.value = 0;
  updateSoundUI();
});

btnMute.addEventListener("click", () => {
  video.muted = false;
  video.volume = currentVolume;
  inputVolume.value = currentVolume;
  updateSoundUI();
});

inputVolume.addEventListener("mouseup", (e) => {
  if (inputVolume.value != 0) {
    currentVolume = inputVolume.value;
    video.muted = false;
  }
  video.volume = inputVolume.value;
  updateSoundUI();
});

// 播放相關
const btnPlay = $doc("#btnPlay");

function updataPlay() {
  if (!video.paused) {
    $doc(".play").classList.remove("visible");
    $doc(".pause").classList.add("visible");
  } else {
    $doc(".play").classList.add("visible");
    $doc(".pause").classList.remove("visible");
  }
}

btnPlay.addEventListener("click", () => {
  if (!video.paused) {
    video.pause();
  } else {
    video.play();
  }
  updataPlay(video);
});

// 設定相關
const btnDone = $doc(".setting div");
const openSetting = $doc("#btnSetting svg");
const btnSetting = $doc("#btnSetting");

const inputPlaybackRate = $doc("#playback");
const inputSkiptime = $doc("#skiptime");

inputPlaybackRate.value =
  video.playbackRate || localStorage.getItem("playbackRate") || 1;
inputSkiptime.value = localStorage.getItem("skipTime") || 10;

openSetting.addEventListener("click", () => {
  btnSetting.classList.toggle("visible");
  validatePlayback.bind(inputPlaybackRate)();
  validateSkiptime.bind(inputSkiptime)();
});

btnDone.addEventListener("click", function () {
  btnSetting.classList.remove("visible");
  validatePlayback.bind(inputPlaybackRate)();
  validateSkiptime.bind(inputSkiptime)();
});

function validatePlayback() {
  if (this.value < 0.25) this.value = 0.25;
  else if (this.value > 16) this.value = 16;
  video.playbackRate = this.value;
  localStorage.setItem("playbackRate", this.value);
}

function validateSkiptime() {
  if (this.value < 0) this.value = 0;
  localStorage.setItem("skipTime", this.value);
}
