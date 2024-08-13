const video = document.querySelector("video");
// 音量相關
const btnSound = document.querySelector(".sound");
const btnMute = document.querySelector(".mute");
const inputVolume = document.querySelector("#tuneVolume");

const isNetflix = document.querySelector(".player-timedtext") ? true : false;
let currentVolume = video.volume;

inputVolume.value = currentVolume;

function updateSoundUI() {
  if (video.volume > 0 && inputVolume.value > 0) {
    document.querySelector(".sound").classList.add("visible");
    document.querySelector(".mute").classList.remove("visible");
  } else if (video.volume == 0 && inputVolume.value == 0) {
    document.querySelector(".sound").classList.remove("visible");
    document.querySelector(".mute").classList.add("visible");
  } else {
    console.log("音量相關錯誤");
    if (video.volume != inputVolume.value)
      console.log("音量不一樣", video.volume, inputVolume.value);
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
const btnPlay = document.querySelector("#btnPlay");

function updataPlay() {
  if (!video.paused) {
    document.querySelector(".play").classList.remove("visible");
    document.querySelector(".pause").classList.add("visible");
  } else {
    document.querySelector(".play").classList.add("visible");
    document.querySelector(".pause").classList.remove("visible");
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
const btnForward = document.querySelector("#btnForward");
const btnBackward = document.querySelector("#btnBackward");

// check youtube streaming
function checkIsStreaming() {
  const liveBadge = document.querySelector(".ytp-live-badge");
  return liveBadge && !liveBadge.getAttribute("disabled");
}

btnForward.addEventListener("click", () => {
  let skipTime = +document.querySelector("#skiptime").value || 10;

  if (isNetflix) return;

  if (checkIsStreaming()) {
    const streamOffset = video.duration - video.currentTime;
    video.currentTime = Math.min(
      video.currentTime + skipTime + streamOffset,
      video.duration
    );
  }

  video.currentTime = Math.min(video.currentTime + skipTime, video.duration);
});

btnBackward.addEventListener("click", () => {
  let skipTime = +document.querySelector("#skiptime").value || 10;

  if (isNetflix) return;

  video.currentTime = Math.max(video.currentTime - skipTime, 0);
});

// 設定相關
const btnDone = document.querySelector(".setting div");
const openSetting = document.querySelector("#btnSetting svg");
const btnSetting = document.querySelector("#btnSetting");
const inputPlaybackRate = document.querySelector("#playback");
const inputSkiptime = document.querySelector("#skiptime");

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

// 時間、進度條相關
const currentTime = document.querySelector("span.currentTime");
const duration = document.querySelector("span.duration");

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
const progressBar = document.querySelector("#pipProgressBar");
const progress = document.querySelector("#watched-progress");
const progressDot = document.querySelector("#watched-now");

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
    document.querySelector("svg.play").classList.remove("visible");
    document.querySelector("svg.pause").classList.add("visible");
  } else {
    document.querySelector("svg.play").classList.add("visible");
    document.querySelector("svg.pause").classList.remove("visible");
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
