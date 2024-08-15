function $doc(selector) {
  return document.querySelector(selector);
}
const video = $doc("video");
// 音量相關
const btnSound = $doc(".sound");
const btnMute = $doc(".mute");
const inputVolume = $doc("#tuneVolume");

const isNetflix = $doc(".player-timedtext") ? true : false;
let currentVolume = video.volume;

inputVolume.value = currentVolume;

function updateSoundUI() {
  if (video.volume > 0 && inputVolume.value > 0) {
    $doc(".sound").classList.remove("hidden");
    $doc(".mute").classList.add("hidden");
  } else {
    $doc(".sound").classList.add("hidden");
    $doc(".mute").classList.remove("hidden");
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
    $doc(".play").classList.add("hidden");
    $doc(".pause").classList.remove("hidden");
  } else {
    $doc(".play").classList.remove("hidden");
    $doc(".pause").classList.add("hidden");
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

// 快轉、後退相關
const btnForward = $doc("#btnForward");
const btnBackward = $doc("#btnBackward");

btnForward.addEventListener("click", () => {
  let skipTime = +$doc("#skiptime").value || 10;

  if (isNetflix) return;

  video.currentTime = Math.min(video.currentTime + skipTime, video.duration);
});

btnBackward.addEventListener("click", () => {
  let skipTime = +$doc("#skiptime").value || 10;

  if (isNetflix) return;

  video.currentTime = Math.max(video.currentTime - skipTime, 0);
});

// 設定相關
const btnDone = $doc(".setting div");
const openSetting = $doc("#btnSetting svg");
const settingModal = $doc(".setting");

const inputPlaybackRate = $doc("#playback");
const inputSkiptime = $doc("#skiptime");

inputPlaybackRate.value =
  video.playbackRate || localStorage.getItem("playbackRate") || 1;
inputSkiptime.value = localStorage.getItem("skipTime") || 10;

openSetting.addEventListener("click", () => {
  settingModal.classList.toggle("hidden");
  validatePlayback.bind(inputPlaybackRate)();
  validateSkiptime.bind(inputSkiptime)();
});

btnDone.addEventListener("click", function () {
  settingModal.classList.add("hidden");
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

// 時間、進度條相關
const currentTime = $doc("span.currentTime");
const duration = $doc("span.duration");

function secToDate(time) {
  let result = "";
  let restTime = time;
  const hour = Math.floor(restTime / 3600);
  if (hour > 0) {
    result = hour + ":";
  }
  restTime -= hour * 3600;
  const min = Math.floor(restTime / 60);
  result = result + min.toString().padStart(2, 0) + ":";

  restTime -= min * 60;
  const sec = restTime.toFixed(0);
  result = result + sec.toString().padStart(2, 0);

  return result;
}

//  拉動進度條
const progressBar = $doc("#pipProgressBar");
const progress = $doc("#watched-progress");
const progressDot = $doc("#watched-now");

function setProgress(percentage) {
  progress.style.width = percentage + "%";
  progressDot.style.left = percentage + "%";
}

progressDot.addEventListener("dragstart", function (e) {
  if (isNetflix) return;
  clearInterval(updateTimerInterval);
});

progressDot.addEventListener("drag", function (e) {
  if (isNetflix) return;
  if (e.clientX === 0 && e.clientY === 0) return; // 防止意外触发
  const rect = progressBar.getBoundingClientRect();
  let offsetX = e.clientX - rect.left;
  if (offsetX < 0) offsetX = 0;
  if (offsetX > rect.width) offsetX = rect.width;

  const percentage = (offsetX / rect.width) * 100;
  currentTime.textContent = secToDate((video.duration * percentage) / 100);
  setProgress(percentage);
});

progressDot.addEventListener("dragend", function (e) {
  if (isNetflix) return;
  const rect = progressBar.getBoundingClientRect();
  let offsetX = e.clientX - rect.left;

  if (offsetX < 0) offsetX = 0;
  if (offsetX > rect.width) offsetX = rect.width;

  const percentage = (offsetX / rect.width) * 100;
  setProgress(percentage);
  if (isNetflix) {
    const videoPlayer =
      window.netflix.appContext.state.playerApp.getAPI().videoPlayer;
    const player = videoPlayer.getVideoPlayerBySessionId(
      videoPlayer.getAllPlayerSessionIds()[0]
    );

    player.seek((video.duration * percentage) / 100); //seek to roughly 18mins
    return;
  } else {
    video.currentTime = (video.duration * percentage) / 100;
  }
  updateTimer();
  updateTimerInterval = setInterval(() => {
    updateTimer();
    updatePlayBtn();
    updateControlBar();
  }, 250);
});

progressBar.addEventListener("mousedown", function (e) {
  if (isNetflix) return;
  clearInterval(updateTimerInterval);

  const rect = progressBar.getBoundingClientRect();
  let offsetX = e.clientX - rect.left;

  if (offsetX < 0) offsetX = 0;
  if (offsetX > rect.width) offsetX = rect.width;

  const percentage = (offsetX / rect.width) * 100;
  currentTime.textContent = secToDate((video.duration * percentage) / 100);
  setProgress(percentage);
});

progressBar.addEventListener("mouseup", function (e) {
  if (isNetflix) return;
  const rect = progressBar.getBoundingClientRect();
  let offsetX = e.clientX - rect.left;

  if (offsetX < 0) offsetX = 0;
  if (offsetX > rect.width) offsetX = rect.width;

  const percentage = (offsetX / rect.width) * 100;
  setProgress(percentage);
  if (isNetflix) {
    const videoPlayer =
      window.netflix.appContext.state.playerApp.getAPI().videoPlayer;
    const player = videoPlayer.getVideoPlayerBySessionId(
      videoPlayer.getAllPlayerSessionIds()[0]
    );

    player.seek((video.duration * percentage) / 100); //seek to roughly 18mins
    return;
  } else {
    video.currentTime = (video.duration * percentage) / 100;
  }
  updateTimer();
  updateTimerInterval = setInterval(() => {
    updateTimer();
    updatePlayBtn();
    updateControlBar();
  }, 250);
});

function updateTimer() {
  currentTime.textContent = secToDate(video.currentTime);
  duration.textContent = secToDate(video.duration);
}

function updatePlayBtn() {
  if (video.currentTime < video.duration && !video.paused) {
    $doc("svg.play").classList.add("hidden");
    $doc("svg.pause").classList.remove("hidden");
  } else {
    $doc("svg.play").classList.remove("hidden");
    $doc("svg.pause").classList.add("hidden");
  }
}

function updateControlBar() {
  let percent = video.currentTime / video.duration;
  setProgress(percent * 100);
}

let updateTimerInterval = setInterval(() => {
  updateTimer();
  updatePlayBtn();
  updateControlBar();
}, 250);
