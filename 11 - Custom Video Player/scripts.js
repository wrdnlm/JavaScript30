const videoHook = document.querySelector('.player__video');
const btnVideoToggle = document.querySelector('.player__button.toggle');
const rngVideoVol = document.querySelector('.player__slider[name="volume"]');
const rngVideoPbRate = document.querySelector('.player__slider[name="playbackRate"]');
const progressBar = document.querySelector('.progress');
const progressBarRect = progressBar.getBoundingClientRect();
const progressFilled = document.querySelector('.progress__filled');
const arrBtnSkip = document.querySelectorAll('button[data-skip]');

function handleVideoToggle(e) {
  if (videoHook.paused) {
    videoHook.play();
  } else {
    videoHook.pause();
  }
}
btnVideoToggle.addEventListener('click', handleVideoToggle);
rngVideoVol.addEventListener('change', e => {
  videoHook.volume = e.currentTarget.value;
});
rngVideoPbRate.addEventListener('change', e => {
  videoHook.playbackRate = e.currentTarget.value;
});

function handleProgressChange(e) {
  let currentTime = e.currentTarget.currentTime;
  let duration = e.currentTarget.duration;
  let progressPercentage = `${(Math.floor(currentTime) / Math.floor(duration)) * 100}%`;
  progressFilled.style.flexBasis = progressPercentage;
}
videoHook.addEventListener('timeupdate', handleProgressChange);

progressBar.addEventListener('click', function(e) {
  videoHook.currentTime = (e.offsetX / parseFloat(window.getComputedStyle(progressBar).width)) * videoHook.duration;
});

arrBtnSkip.forEach(skip => {
  skip.addEventListener('click', e => {
    let val = +e.currentTarget.getAttribute('data-skip')
    videoHook.currentTime = val + videoHook.currentTime;
  });
})