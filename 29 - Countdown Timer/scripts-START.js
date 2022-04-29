const arrBtnTimer = document.querySelectorAll('.timer__button');
const timeLeftHook = document.querySelector('.display__time-left');
const endTimeHook = document.querySelector('.display__end-time');
const customTimeForm = document.querySelector('form[name="customForm"]');
let timerId;

function handleDisplayEnd(seconds) {
  let now = new Date();
  now.setSeconds(now.getSeconds() + seconds);
  let endMinutes = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
  let endHour = now.getHours() > 12 ? now.getHours() - 12 : now.getHours();
  endTimeHook.textContent = `Be back at ${endHour}:${endMinutes}`;
}

function handleTimer(isCustom = false, e) {
  let el = isCustom ? null : e.currentTarget;
  let toTime = isCustom ? e : +el.getAttribute('data-time');
  let timeRemaining = toTime;
  let minRemaining = Math.floor(timeRemaining / 60);
  let secRemaining = timeRemaining % 60 < 10 ? `0${timeRemaining % 60}` : timeRemaining % 60;

  handleDisplayEnd(toTime);
  clearInterval(timerId);
  minRemaining = minRemaining < 10 ? `0${minRemaining}` : minRemaining;
  timeLeftHook.textContent = `${minRemaining}:${secRemaining}`;

  timerId = setInterval(function() {
    timeRemaining = timeRemaining - 1;
    minRemaining = Math.floor(timeRemaining / 60);
    secRemaining = timeRemaining % 60;

    minRemaining = minRemaining < 10 ? `0${minRemaining}` : minRemaining; //prepend zero
    secRemaining = secRemaining < 10 ? `0${secRemaining}` : secRemaining; //prepend zero
    timeLeftHook.textContent = `${minRemaining}:${secRemaining}`;
    if (parseInt(minRemaining) <= 0 && parseInt(secRemaining) <= 0) {
      clearInterval(timerId)
    }
  }, 1000);
}
arrBtnTimer.forEach(btn => btn.addEventListener('click', (e) => handleTimer(false, e)));

function handleSubmit(e) {
  e.preventDefault();
  let customMinutes = +e.currentTarget.elements.minutes.value;
  handleTimer(true, customMinutes * 60);
  e.currentTarget.reset();
}
customTimeForm.addEventListener('submit', handleSubmit);