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

function htmlBody() {
  return `
  <div id="pipVideoContainer">
    <h2 id="videoTitle">VIDEO TITLE</h2>
  </div>

  <div id="pipControls">

    <div id="pipProgressBar">
      <div id="progressTime">00:00</div>
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
        <svg class="play" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
          <path d="M320-202v-560l440 280-440 280Zm66.67-280Zm0 158.67L636-482 386.67-640.67v317.34Z" />
        </svg>
        <svg class="pause hidden" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
          <path d="M523.33-200v-560H760v560H523.33ZM200-200v-560h236.67v560H200Zm390-66.67h103.33v-426.66H590v426.66Zm-323.33 0H370v-426.66H266.67v426.66Zm0-426.66v426.66-426.66Zm323.33 0v426.66-426.66Z" />
        </svg>
      </div>
      <div id="btnForward" title="Forward">
        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
          <path d="M102.67-240v-480l350.66 240-350.66 240Zm404.66 0v-480L858-480 507.33-240Zm-338-240ZM574-480ZM169.33-366.67l166-113.33-166-113.33v226.66Zm404.67 0L740-480 574-593.33v226.66Z" />
        </svg>
      </div>
      <div id="btnVolume" title="Volume">
        <svg class="sound" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
          <path d="M560-131v-68.67q94.67-27.33 154-105 59.33-77.66 59.33-176.33 0-98.67-59-176.67-59-78-154.33-104.66V-831q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm426.67 45.33v-332Q599-628 629.5-582T660-480q0 55-30.83 100.83-30.84 45.84-82.5 64.5ZM413.33-634l-104 100.67H186.67v106.66h122.66l104 101.34V-634Zm-96 154Z" />
        </svg>
        <svg class="mute hidden" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
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
        <div class="setting hidden">
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

  <button disabled id="clickToNext">VIDEO IS NOT READY YET</button>`;
}

function htmlStyle() {
  return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  line-height: normal;
  font-weight: bolder;
  color: #fff;
  font-family: sans-serif;
}

body {
  overflow: hidden;
}
body #pipVideoContainer {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #111;
  overflow: hidden;
}
body #pipVideoContainer #videoTitle {
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
  width: 100%;
  padding: 10px;
  z-index: 2;
  background-color: rgba(85, 85, 85, 0.4823529412);
  color: #fff;
  opacity: 0;
  transform: translateY(-50%);
  transition: all 0.5s ease;
  font-weight: normal;
}
body #pipVideoContainer #videoTitle:hover {
  opacity: 1;
  transform: translateY(0%);
}
@media screen and (max-width: 600px) {
  body #pipVideoContainer #videoTitle {
    font-size: 20px;
  }
}
@media screen and (max-width: 450px) {
  body #pipVideoContainer #videoTitle {
    font-size: 16px;
  }
}
body #pipVideoContainer video {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  width: 100% !important;
  height: 100lvh !important;
  transform: translate(-50%, -50%) !important;
  pointer-events: none;
}
body #pipControls {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  opacity: 0;
  background-color: transparent;
  transform: translateY(50%);
  transition: all 0.3s ease;
}
body #pipControls:hover {
  opacity: 1;
  transform: translateY(0%);
}
body #pipControls #pipProgressBar {
  position: relative;
  width: 95%;
  height: 5px;
  background-color: #999;
  cursor: pointer;
}
body #pipControls #pipProgressBar #progressTime {
  position: absolute;
  top: -40px;
  left: 0;
  background-color: rgba(85, 85, 85, 0.6352941176);
  color: #fff;
  width: 60px;
  padding: 5px;
  font-size: 16px;
  border-radius: 5px;
  text-align: center;
  display: none;
}
@media screen and (max-width: 470px) {
  body #pipControls #pipProgressBar #progressTime {
    width: 50px;
    padding: 3px;
    font-size: 12px;
  }
}
body #pipControls #pipProgressBar #watched-progress {
  width: 0%;
  height: 5px;
  background-color: rgb(0, 123, 255);
}
body #pipControls #pipProgressBar #watched-progress:hover {
  transform: scaleY(1.5);
}
body #pipControls #pipProgressBar #watched-now {
  position: absolute;
  top: 50%;
  left: 0;
  width: 15px;
  height: 15px;
  background-color: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
body #pipControls #pipControl {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
  gap: 20px;
  transition: all 0.5s ease;
  background-color: rgba(85, 85, 85, 0.6352941176);
}
@media screen and (max-width: 660px) {
  body #pipControls #pipControl {
    gap: 10px;
  }
}
@media screen and (max-width: 600px) {
  body #pipControls #pipControl {
    gap: 0px;
  }
}
body #pipControls #pipControl div {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease;
}
body #pipControls #pipControl div:hover {
  background-color: #555;
}
@media screen and (max-width: 540px) {
  body #pipControls #pipControl div svg {
    width: 32px;
    height: 32px;
  }
}
@media screen and (max-width: 500px) {
  body #pipControls #pipControl div svg {
    width: 28px;
    height: 28px;
  }
}
@media screen and (max-width: 440px) {
  body #pipControls #pipControl div svg {
    width: 24px;
    height: 24px;
  }
}
@media screen and (max-width: 400px) {
  body #pipControls #pipControl div svg {
    width: 20px;
    height: 20px;
  }
}

#btnSetting {
  position: relative;
}
#btnSetting .setting {
  position: absolute;
  top: -200px;
  left: 50%;
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 10px;
  padding: 10px;
  background-color: #555;
  color: #fff;
  border-radius: 5px;
  transform: translateX(-50%);
  opacity: 1;
  transition: all 0.3s ease;
}
#btnSetting .setting label {
  width: 150px;
}
#btnSetting .setting input {
  width: 100%;
  line-height: 2;
  text-align: center;
  color: rgb(0, 123, 255);
}
#btnSetting .setting div {
  background-color: #555;
  border: 3px solid #999;
  border-radius: 5px;
}
#btnSetting .setting div:hover {
  background-color: #333;
}
#btnSetting .setting div:active {
  background-color: #111;
}

#time {
  color: #fff;
  text-align: center;
}
@media screen and (max-width: 470px) {
  #time {
    font-size: 12px;
  }
}

@media screen and (max-width: 440px) {
  #tuneVolume {
    flex: 0 1 100%;
    width: 100%;
    min-width: 30px;
  }
}
@media screen and (max-width: 400px) {
  #tuneVolume {
    height: 5px;
  }
}

#clickToNext {
  position: absolute;
  top: 0;
  display: none;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: large;
  z-index: 9999;
  background-color: #000;
  color: #fff;
}

.hidden {
  display: none !important;
  opacity: 0 !important;
}

.slide-in {
  opacity: 1 !important;
  transform: translateY(0%) !important;
}

.top-slide-in {
  opacity: 1 !important;
  transform: translateY(0%) !important;
}/*# sourceMappingURL=pip.css.map */`;
}

function htmlScript() {
  return `
function $doc(selector) {
  return document.querySelector(selector);
}
const video = $doc("video");

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
`;
}

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

async function enterPiP() {
  const video = findPlayingVideo();
  const videoContainer = video.parentNode;
  let pipSession, subtitleContainer, subtitle;

  function $doc(selector) {
    return document.querySelector(selector);
  }

  function $pip(selector) {
    return pipSession.document.querySelector(selector);
  }

  // 確認目前網站
  const isNetflix = window.location.href.includes("netflix") ? true : false;
  const isAnigamer = window.location.href.includes("ani.gamer") ? true : false;

  // 開啟pip window
  pipSession = await documentPictureInPicture.requestWindow();

  // 插入html
  const bodyElement = document.createElement("main");
  bodyElement.innerHTML = htmlBody();
  $pip("body").appendChild(bodyElement);

  $pip("#pipVideoContainer").append(video);
  // 插入netflix字幕
  if (isNetflix) {
    subtitle = document.querySelector(".player-timedtext");
    subtitleContainer = subtitle.parentNode;
    $pip("#pipVideoContainer").append(subtitle);
  }

  // 插入css;
  const styleElement = document.createElement("style");
  styleElement.textContent = htmlStyle();
  $pip("head").appendChild(styleElement);

  // 插入js
  const scriptElement = document.createElement("script");
  scriptElement.textContent = htmlScript();
  $pip("head").appendChild(scriptElement);

  // 設定pip的初始UI
  // 音量UI
  let currentVolume = video.volume;
  if (video.volume > 0 && !video.muted) {
    $pip(".sound").classList.remove("hidden");
    $pip(".mute").classList.add("hidden");
    $pip("#tuneVolume").value = video.volume;
  } else {
    $pip(".sound").classList.add("hidden");
    $pip(".mute").classList.remove("hidden");
    $pip("#tuneVolume").value = 0;
  }

  // 影片標題
  let videoTitle, getVideoTitle;
  if (isNetflix) {
    videoTitle = $doc('div[data-uia="video-title"]')?.textContent;
    if (videoTitle) {
      $pip("#videoTitle").textContent = videoTitle;
    } else {
      getVideoTitle = setInterval(() => {
        videoTitle = $doc('div[data-uia="video-title"]')?.textContent;
        if (videoTitle) {
          $pip("#videoTitle").textContent = videoTitle;
          clearInterval(getVideoTitle);
        }
      }, 500);
    }
  }
  if (isAnigamer) {
    videoTitle = $doc(".anime_name>h1").textContent;
    $pip("#videoTitle").textContent = videoTitle;
  }

  // netflix 調用快進後退需要
  let videoPlayer, player, checkVideo;
  if (isNetflix) {
    videoPlayer =
      window.netflix.appContext.state.playerApp.getAPI().videoPlayer;
    player = videoPlayer.getVideoPlayerBySessionId(
      videoPlayer.getAllPlayerSessionIds()[0]
    );
  }

  const currentTime = $pip("span.currentTime");
  const duration = $pip("span.duration");

  const progressBar = $pip("#pipProgressBar");
  const progress = $pip("#watched-progress");
  const progressDot = $pip("#watched-now");

  // 設置pip畫面更新interval
  let updateTimerInterval = setInterval(() => {
    updateTimer();
    updatePlayBtn();
    updateControlBar();
  }, 250);

  // 快進
  $pip("#btnForward").addEventListener("click", () => {
    const skipTime = +$pip("#skiptime").value;
    if (isNetflix) {
      player.seek(
        Math.min(video.currentTime + skipTime, video.duration) * 1000
      );
    } else {
      video.currentTime = Math.min(
        video.currentTime + skipTime,
        video.duration
      );
    }
  });

  // 後退
  $pip("#btnBackward").addEventListener("click", () => {
    const skipTime = +$pip("#skiptime").value;
    if (isNetflix) {
      player.seek(Math.max(video.currentTime - skipTime, 0) * 1000);
    } else {
      video.currentTime = Math.max(video.currentTime - skipTime, 0);
    }
  });

  // 時間、進度條相關
  //  拉動進度條
  const progressTime = $pip("#progressTime");

  function setProgress(percentage) {
    progress.style.width = percentage + "%";
    progressDot.style.left = percentage + "%";
  }

  function showProgressTime(e) {
    const rect = progressBar.getBoundingClientRect();
    let offsetX = e.clientX - rect.left;
    const percentage = calcPercent(e);
    const width = progressTime.offsetWidth;
    if (offsetX < width / 2) {
      progressTime.style.left = 0;
    } else if (offsetX > width / 2 && offsetX < rect.width - width / 2) {
      progressTime.style.left = (percentage * rect.width) / 100 - width / 2;
    } else if (offsetX > rect.width - width / 2) {
      progressTime.style.left = rect.width - width;
    }
    progressTime.textContent = secToDate((percentage * video.duration) / 100);
  }

  function updateTimer() {
    currentTime.textContent = secToDate(video.currentTime);
    duration.textContent = secToDate(video.duration);
  }

  function updatePlayBtn() {
    if (video.currentTime < video.duration && !video.paused) {
      $pip("svg.play").classList.add("hidden");
      $pip("svg.pause").classList.remove("hidden");
    } else {
      $pip("svg.play").classList.remove("hidden");
      $pip("svg.pause").classList.add("hidden");
    }
  }

  function updateControlBar() {
    let percent = video.currentTime / video.duration;
    setProgress(percent * 100);
  }

  function calcPercent(e) {
    const rect = progressBar.getBoundingClientRect();
    let offsetX = e.clientX - rect.left;

    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;
    const percentage = (offsetX / rect.width) * 100;
    return percentage;
  }

  progressDot.addEventListener("dragstart", function (e) {
    clearInterval(updateTimerInterval);
  });

  progressDot.addEventListener("drag", function (e) {
    if (e.clientX === 0 && e.clientY === 0) return; // 防止拉到進度條外，導致bug
    const percentage = calcPercent(e);

    setProgress(percentage);

    currentTime.textContent = secToDate(
      (progressDot.style.left.replace("%", "") * video.duration) / 100
    );
    showProgressTime(e);
  });

  progressDot.addEventListener("dragend", function (e) {
    const percentage = calcPercent(e);
    setProgress(percentage);
    if (isNetflix) {
      player.seek(((video.duration * percentage) / 100) * 1000);
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
    clearInterval(updateTimerInterval);

    const percentage = calcPercent(e);
    setProgress(percentage);
    updateTimer();
  });

  progressBar.addEventListener("mouseup", function (e) {
    const percentage = calcPercent(e);
    setProgress(percentage);
    if (isNetflix) {
      player.seek(((video.duration * percentage) / 100) * 1000);
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

  progressBar.addEventListener("mouseenter", function (e) {
    progressTime.style.display = "block";
  });

  progressBar.addEventListener("mousemove", (e) => {
    showProgressTime(e);
  });

  progressBar.addEventListener("mouseleave", function (e) {
    progressTime.style.display = "none";
  });

  function showNextEp() {
    $pip("#clickToNext").style.display = "flex";
  }

  // 下一集
  if (isAnigamer) {
    $pip("#nextEpisode").addEventListener("click", () => {
      $doc("#nextEpisode").click();
    });
  }

  if (isNetflix) {
    checkVideo = setInterval(() => {
      if (video !== $doc("video") && $doc("video")) {
        $pip("#clickToNext").disabled = false;
        $pip("#clickToNext").textContent = "CLICK TO NEXT EPISODE";
        $pip("#clickToNext").style.color = "#000";
        $pip("#clickToNext").style.backgroundColor = "#fff";
        $pip("#clickToNext").style.display = "flex";
        clearInterval(checkVideo);
      }
    }, 500);

    navigation.addEventListener("navigate", showNextEp);

    $pip("#nextEpisode").addEventListener("click", () => {
      if (!$doc('button[data-uia="control-next"]')) {
        videoContainer.append(video);
        $doc("video").click();

        setTimeout(() => {
          $doc('button[data-uia="control-next"]')?.click();
          $doc('button[data-uia="next-episode-seamless-button"]')?.click();
        }, 500);
      } else {
        videoContainer.append(video);
        $doc('button[data-uia="control-next"]').click();
      }
      $pip("#clickToNext").style.display = "flex";
    });

    $pip("#clickToNext").addEventListener("click", () => {
      pipSession.close();
      enterPiP();
    });
  }

  // 音量相關
  const btnSound = $pip(".sound");
  const btnMute = $pip(".mute");
  const inputVolume = $pip("#tuneVolume");

  function updateSoundUI() {
    if (video.volume > 0 && !video.muted) {
      btnSound.classList.remove("hidden");
      btnMute.classList.add("hidden");
    } else {
      btnSound.classList.add("hidden");
      btnMute.classList.remove("hidden");
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

  // pip window event
  pipSession.document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        video.volume = Math.min(1, video.volume + 0.1);
        inputVolume.value = video.volume;
        currentVolume = inputVolume.value;
        updateSoundUI();
        break;
      case "ArrowDown":
        video.volume = Math.max(0, video.volume - 0.1);
        inputVolume.value = video.volume;
        if (inputVolume.value !== 0) {
          currentVolume = inputVolume.value;
        }
        updateSoundUI();
        break;
      case "ArrowLeft":
        $pip("#btnBackward").click();
        break;
      case "ArrowRight":
        $pip("#btnForward").click();
        break;
      case "Escape":
        pipSession.close();
        break;
      case " ":
        $pip("#btnPlay").click();
        break;
      case "Enter":
        $pip("#btnPlay").click();
        break;
      case "m":
        if (video.volume > 0 && !video.muted) {
          video.muted = true;
          video.volume = 0;
          inputVolume.value = 0;
        } else {
          video.muted = false;
          video.volume = currentVolume;
          inputVolume.value = currentVolume;
        }
        updateSoundUI();
        break;
    }
  });

  $pip("#pipVideoContainer").addEventListener("click", () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });

  function removeInfo() {
    $pip("#pipControls").classList.remove("slide-in");
    $pip("#videoTitle").classList.remove("top-slide-in");
  }

  let mouseStopped, mouseTimer;
  ["mousemove", "click"].forEach((ev) => {
    pipSession.document.addEventListener(ev, () => {
      $pip("main").style.cursor = "auto";
      $pip("#pipControls").classList.add("slide-in");
      $pip("#videoTitle").classList.add("top-slide-in");
      clearTimeout(mouseTimer);

      mouseStopped = false;
      mouseTimer = setTimeout(() => {
        mouseStopped = true;
        if (mouseStopped) {
          $pip("main").style.cursor = "none";
          removeInfo();
        }
      }, 3000);
    });
  });

  pipSession.addEventListener("mouseout", removeInfo);

  // 關閉pip時觸發
  function onLeavePiP() {
    if (this !== pipSession) return;
    videoContainer.prepend(video);
    if (isNetflix) subtitleContainer.append(subtitle);
    clearInterval(updateTimerInterval);
    clearInterval(checkVideo);
    clearInterval(getVideoTitle);
    clearTimeout(mouseTimer);
    navigation.removeEventListener("navigate", showNextEp);
    pipSession.removeEventListener("mouseout", removeInfo);
    pipSession = null;
  }
  pipSession.addEventListener("unload", onLeavePiP.bind(pipSession), {
    once: true,
  });
}
enterPiP();
