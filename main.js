function findPlayingVideo() {
  const videos = Array.from(document.querySelectorAll("video"))
    .filter((video) => video.readyState != 0)
    .filter((video) => video.disablePictureInPicture == false)
    .sort((v1, v2) => {
      const v1Rect = v1.getClientRects()[0] || { width: 0, height: 0 };
      const v2Rect = v2.getClientRects()[0] || { width: 0, height: 0 };
      return v2Rect.width * v2Rect.height - v1Rect.width * v1Rect.height;
    });

  if (videos.length === 0) {
    return;
  }

  return videos[0];
}

async function enterPiP() {
  const video = findPlayingVideo();
  const videoContainer = video.parentNode;
  const htmlBody = ` <div id="pipVideoContainer">
    
  <div id="pipControls">
    <div id="pipProgressBar">
      <div id="watched-progress"></div>
      <div id="watched-now" draggable="true"></div>
    </div>

    <div id="pipControl">
      <div id="btnBackward" title="Backward">
        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
          <path d="M856-240 505.33-480 856-720v480Zm-401.33 0L104-480l350.67-240v480ZM388-480Zm401.33 0ZM388-366.67v-226.66L222-480l166 113.33Zm401.33 0v-226.66L623.33-480l166 113.33Z" />
        </svg>
      </div>
      <div id="btnPlay" title="Play/Pause">
        <svg class="play visible" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
          <path d="M320-202v-560l440 280-440 280Zm66.67-280Zm0 158.67L636-482 386.67-640.67v317.34Z" />
        </svg>
        <svg class="pause" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
          <path d="M523.33-200v-560H760v560H523.33ZM200-200v-560h236.67v560H200Zm390-66.67h103.33v-426.66H590v426.66Zm-323.33 0H370v-426.66H266.67v426.66Zm0-426.66v426.66-426.66Zm323.33 0v426.66-426.66Z" />
        </svg>
      </div>
      <div id="btnForward" title="Forward">
        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
          <path d="M102.67-240v-480l350.66 240-350.66 240Zm404.66 0v-480L858-480 507.33-240Zm-338-240ZM574-480ZM169.33-366.67l166-113.33-166-113.33v226.66Zm404.67 0L740-480 574-593.33v226.66Z" />
        </svg>
      </div>
      <div id="btnVolume" title="Volume">
        <svg class="sound visible" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
          <path d="M560-131v-68.67q94.67-27.33 154-105 59.33-77.66 59.33-176.33 0-98.67-59-176.67-59-78-154.33-104.66V-831q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm426.67 45.33v-332Q599-628 629.5-582T660-480q0 55-30.83 100.83-30.84 45.84-82.5 64.5ZM413.33-634l-104 100.67H186.67v106.66h122.66l104 101.34V-634Zm-96 154Z" />
        </svg>
        <svg class="mute" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
          <path d="M806-56 677.67-184.33q-27 18.66-58 32.16-31 13.5-64.34 21.17v-68.67q20-6.33 38.84-13.66 18.83-7.34 35.5-19l-154.34-155V-160l-200-200h-160v-240H262L51.33-810.67 98.67-858l754.66 754L806-56Zm-26.67-232-48-48q19-33 28.17-69.62 9.17-36.61 9.17-75.38 0-100.22-58.34-179.11Q652-739 555.33-762.33V-831q124 28 202 125.5t78 224.5q0 51.67-14.16 100.67-14.17 49-41.84 92.33Zm-134-134-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5t-7.5 28.5Zm-170-170-104-104 104-104v208Zm-66.66 270v-131.33l-80-80H182v106.66h122L408.67-322Zm-40-171.33Z" />
        </svg>
        <input type="range" id="tuneVolume" max="1" min="0" step="0.01" value="0.3">
      </div>
      <p id="time">
        <span class="currentTime">00:00</span>
        <span>/</span>
        <span class="duration">00:00</span>
      </p>
      <div id="btnSetting" title="Setting">
        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
          <path d="M431.33-120v-230H498v82h342v66.67H498V-120h-66.67ZM120-201.33V-268h244.67v66.67H120Zm178-164v-81.34H120v-66.66h178V-596h66.67v230.67H298Zm133.33-81.34v-66.66H840v66.66H431.33Zm164-163.33v-230H662v81.33h178V-692H662v82h-66.67ZM120-692v-66.67h408.67V-692H120Z" />
        </svg>
        <div class="setting">
          <label for="playback">playback speed
            <input type="number" id="playback" step="0.25" placeholder="0.25x-16x" value="1"></label>
          <label for="skiptime">skip time
            <input type="number" id="skiptime" step="5" value="10"></label>
          <div>DONE</div>
        </div>
      </div>
      <div id="nextEpisode" title="Next Episode">
        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
          <path d="M673.33-240v-480H740v480h-66.67ZM220-240v-480l350.67 240L220-240Zm66.67-240Zm0 113.33 166-113.33-166-113.33v226.66Z" />
        </svg>
      </div>
    </div>
  </div>

</div>`;

  const htmlStyle = `* {
margin: 0;
padding: 0;
box-sizing: border-box;
line-height: normal;
font-weight: bolder;
color: #fff;
font-family: sans-serif;
}

body {
margin: 0;
padding: 0;
}

#pipVideoContainer {
background-color: #111;
width: 100%;
height: 100vh;
position: relative;
display: flex;
justify-content: center;
align-items: center;
overflow: hidden
}

video {
position: absolute !important;
width: 100% !important;
height: 100% !important;
top: 50% !important;
left: 50% !important;
transform: translate(-50%, -50%);
}

#pipControls {
position: absolute;
bottom: 0;
left: 0;
width: 100%;
opacity: 0;
transition: opacity 0.3s ease-in;
background-color: transparent;
display: flex;
flex-direction: column;
align-items: center;
padding: 100% 0 0;
z-index: 99;
transition: all 0.3s ease;
}

#pipControls:hover {
opacity: 1;
}

#pipProgressBar {
width: 95%;
height: 5px;
cursor: pointer;
background-color: #999;
position: relative;
}

#watched-progress {
width: 0%;
height: 5px;
background-color: rgb(0, 123, 255);
}

#watched-now {
width: 15px;
height: 15px;
background-color: #fff;
border-radius: 50%;
position: absolute;
left: 0;
top: 50%;
transform: translate(-50%, -50%);
}

#watched-progress:hover {
transform: scaleY(1.5);
}

#pipControl {
width: 100%;
height: 60px;
display: flex;
gap: 20px;
justify-content: center;
align-items: center;
transition: all 0.3s ease;
}

#pipControl:hover {
background-color: #555555a2;
backdrop-filter: blur(10px);
border-radius: 5px;
}

#pipControl > div {
cursor: pointer;
display: flex;
justify-content: center;
align-items: center;
transition: all 0.3s ease;
padding: 5px;
border-radius: 5px;
}

#pipControl > div:hover {
background-color: #555;
transition: all 0.3s ease;
}

#btnVolume svg:not(.visible) {
display: none;
}

#btnPlay svg:not(.visible) {
display: none;
}

#btnSetting {
position: relative;
}

#btnSetting.visible .setting {
opacity: 1;
pointer-events: auto;
background-color: #555;
}

.setting {
opacity: 0;
pointer-events: none;
color: #fff;
display: flex;
flex-direction: column;
text-align: center;
gap: 10px;
padding: 10px;
border-radius: 5px;
position: absolute;
top: -200px;
left: 50%;
transform: translateX(-50%);

transition: all 0.3s ease;
}

.setting label {
width: 150px;
}

.setting input {
width: 100%;
text-align: center;
line-height: 2;
color: rgb(0, 123, 255);
}

.setting div {
background-color: #555;
border: 3px solid #999;
border-radius: 5px;
}

.setting div:hover {
background-color: #333;
}

.setting div:active {
background-color: #111;
}

#time {
color: #fff;
text-align: center;
}
@media screen and (max-width: 660px) {
#pipControl {
  gap: 10px;
}
}
@media screen and (max-width: 600px) {
#pipControl {
  gap: 0px;
}
}
@media screen and (max-width: 540px) {
svg {
  width: 32px;
  height: 32px;
}
}
@media screen and (max-width: 500px) {
svg {
  width: 28px;
  height: 28px;
}
}

@media screen and (max-width: 470px) {
#time {
  font-size: small;
}
}
@media screen and (max-width: 440px) {
svg {
  width: 24px;
  height: 24px;
}
#tuneVolume {
  flex: 0 1 100%;
  width: 100%;
  min-width: 30px;
}
}
@media screen and (max-width: 400px) {
svg {
  width: 20px;
  height: 20px;
}
#tuneVolume {
  height: 5px;
}
}
@media screen and (max-width: 300px) {
svg {
  width: 20px;
  height: 20px;
}
}

`;

  const htmlScript = `const video = document.querySelector("video");
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
  video.muted = true
  video.volume = 0;
  inputVolume.value = 0;
  updateSoundUI();
});

btnMute.addEventListener("click", () => {
  video.muted = false
  video.volume = currentVolume;
  inputVolume.value = currentVolume;
  updateSoundUI();
});

inputVolume.addEventListener("mouseup", (e) => {
if (inputVolume.value != 0) {
  currentVolume = inputVolume.value;
  video.muted = false
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
`;

  let pipSession;
  // netflix字幕
  const subtitle = document?.querySelector(".player-timedtext");
  let subtitleContainer;
  if (subtitle) {
    subtitleContainer = subtitle.parentNode;
  }

  // 確認目前網站
  let isNetflix = subtitle ? true : false;
  let isAnigamer = document?.querySelector(".vjs-danmu") ? true : false;

  // pip window大小
  const pipOptions = {
    width: video.clientWidth,
    height: video.clientHeight,
  };

  // 開啟pip window
  pipSession = await documentPictureInPicture.requestWindow(pipOptions);

  const pipBody = pipSession.document.querySelector("body");
  const pipHead = pipSession.document.querySelector("head");

  // 插入html
  const bodyElement = document.createElement("main");
  bodyElement.innerHTML = htmlBody;
  pipBody.appendChild(bodyElement);

  pipSession.document.querySelector("#pipVideoContainer").append(video);
  if (subtitle) {
    pipSession.document.querySelector("#pipVideoContainer").append(subtitle);
  }
  // 插入css;
  const styleElement = document.createElement("style");
  styleElement.textContent = htmlStyle;
  pipHead.appendChild(styleElement);

  // 插入js
  const scriptElement = document.createElement("script");
  scriptElement.textContent = htmlScript;
  pipHead.appendChild(scriptElement);

  // 設定pip的初始UI
  if (video.muted) {
    pipSession.document.querySelector(".sound").classList.remove("visible");
    pipSession.document.querySelector(".mute").classList.add("visible");
    pipSession.document.querySelector("#tuneVolume").value = 0;
  } else {
    pipSession.document.querySelector(".sound").classList.add("visible");
    pipSession.document.querySelector(".mute").classList.remove("visible");
    pipSession.document.querySelector("#tuneVolume").value = video.volume;
  }

  // 巴哈 下一集
  if (isAnigamer) {
    pipSession.document
      .getElementById("nextEpisode")
      .addEventListener("click", () => {
        document.getElementById("nextEpisode").click();
      });
  }

  // netflix 快進、後退、進度條
  if (isNetflix) {
    // netflix 調用快進後退需要
    const videoPlayer =
      window.netflix.appContext.state.playerApp.getAPI().videoPlayer;
    const player = videoPlayer.getVideoPlayerBySessionId(
      videoPlayer.getAllPlayerSessionIds()[0]
    );
    player.getTextTrackList();
    // pip內部元素
    const btnPlay = pipSession.document.getElementById("btnPlay");

    const currentTime = pipSession.document.querySelector("span.currentTime");
    const duration = pipSession.document.querySelector("span.duration");

    const progressBar = pipSession.document.querySelector("#pipProgressBar");
    const progress = pipSession.document.querySelector("#watched-progress");
    const progressDot = pipSession.document.querySelector("#watched-now");

    // 設置pip畫面更新interval
    let updateTimerInterval = setInterval(() => {
      updateTimer();
      updatePlayBtn();
      updateControlBar();
    }, 250);

    // 快進
    pipSession.document
      .getElementById("btnForward")
      .addEventListener("click", () => {
        const skipTime = +pipSession.document.getElementById("skiptime").value;
        player.seek(
          Math.min(video.currentTime + skipTime, video.duration) * 1000
        );
      });

    // 後退
    pipSession.document
      .getElementById("btnBackward")
      .addEventListener("click", () => {
        const skipTime = +pipSession.document.getElementById("skiptime").value;
        player.seek(Math.max(video.currentTime - skipTime, 0) * 1000);
      });

    // 時間、進度條相關
    // 把時間(s)轉成 hh:mm:ss
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
    function setProgress(percentage) {
      progress.style.width = percentage + "%";
      progressDot.style.left = percentage + "%";
    }

    progressDot.addEventListener("dragstart", function (e) {
      clearInterval(updateTimerInterval);
    });

    progressDot.addEventListener("drag", function (e) {
      if (e.clientX === 0 && e.clientY === 0) return; // 防止拉到進度條外，導致bug
      const rect = progressBar.getBoundingClientRect();
      let offsetX = e.clientX - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      currentTime.textContent = secToDate((video.duration * percentage) / 100);
      setProgress(percentage);
    });

    progressDot.addEventListener("dragend", function (e) {
      const rect = progressBar.getBoundingClientRect();
      let offsetX = e.clientX - rect.left;

      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      setProgress(percentage);

      player.seek(((video.duration * percentage) / 100) * 1000);

      updateTimer();
      updateTimerInterval = setInterval(() => {
        updateTimer();
        updatePlayBtn();
        updateControlBar();
      }, 250);
    });

    progressBar.addEventListener("mousedown", function (e) {
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
      const rect = progressBar.getBoundingClientRect();
      let offsetX = e.clientX - rect.left;

      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      setProgress(percentage);

      player.seek(((video.duration * percentage) / 100) * 1000);

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
        pipSession.document
          .querySelector("svg.play")
          .classList.remove("visible");
        pipSession.document.querySelector("svg.pause").classList.add("visible");
      } else {
        pipSession.document.querySelector("svg.play").classList.add("visible");
        pipSession.document
          .querySelector("svg.pause")
          .classList.remove("visible");
      }
    }

    function updateControlBar() {
      let percent = video.currentTime / video.duration;
      setProgress(percent * 100);
    }

    // 下一集
    const netflixNext = document.querySelector(
      'button[data-uia="control-next"]'
    );

    pipSession.document
      .getElementById("nextEpisode")
      .addEventListener("click", () => {
        if (!document.querySelector('button[data-uia="control-next"]')) {
          videoContainer.append(video); // 把影片貼回去原本的頁面
          document.querySelector("video").click();
          setTimeout(() => {
            document.querySelector('button[data-uia="control-next"]').click();
          }, 1000);
        } else {
          document.querySelector('button[data-uia="control-next"]').click();
          //   videoContainer.append(video); // 把影片貼回去原本的頁面
        }

        subtitleContainer.append(subtitle);
        pipSession.window.close();
      });

    function onLeavePiP() {
      if (this !== pipSession) {
        return;
      }

      videoContainer.append(video); // 把影片貼回去原本的頁面
      if (subtitle) subtitleContainer.append(subtitle);
      clearInterval(updateTimerInterval);
      pipSession = null;
    }
    pipSession.window.addEventListener("unload", onLeavePiP.bind(pipSession), {
      once: true,
    });
  }

  // 關閉pip時觸發
  function onLeavePiP() {
    if (this !== pipSession) {
      return;
    }
    videoContainer.append(video); // 把影片貼回去原本的頁面
    pipSession = null;
  }

  // Listen for the PiP closing event to put the video back.
  pipSession.window.addEventListener("unload", onLeavePiP.bind(pipSession), {
    once: true,
  });
}
enterPiP();
