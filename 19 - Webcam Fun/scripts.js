const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const arrRGBInput = document.querySelectorAll('input[type="range"]');

async function handleVideo() {
  try {
    video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true, audio: false});
    video.play();
  } catch (error) {
    console.log(error);
  }
}
handleVideo();

function canvasPaint() {
  const { videoWidth: width, videoHeight: height } = video;
  
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height)
    let pixels = ctx.getImageData(0, 0, width, height);

    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.5;

    pixels = greenScreen(pixels);
    ctx.putImageData(pixels, 0, 0);
  }, 20);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i] = pixels.data[i] + 100;
    pixels.data[i + 1] = pixels.data[i + 1] - 40;
    pixels.data[i + 2] = pixels.data[i + 2] * 0.3;
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 250] = pixels.data[i];
    pixels.data[i + 200] = pixels.data[i + 1];
    pixels.data[i - 250] = pixels.data[i + 2];
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  arrRGBInput.forEach(input => levels[input.name] = input.value);
  
  for (let i = 0; i < pixels.data.length; i+=4) {
    let r = pixels.data[i + 0];
    let g = pixels.data[i + 1];
    let b = pixels.data[i + 2];
    let a = pixels.data[i + 3];

    if (r >= levels.rmin
      && g >= levels.gmin
      && b >= levels.bmin
      && r <= levels.rmax
      && g <= levels.gmax
      && b <= levels.bmax) {
        pixels.data[i + 3] = 0;
    }
  }
  
  return pixels;
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  const imageData = canvas.toDataURL('image/jpeg');
  let imageTemplate = `
  <a href="${imageData}" download="handsome">
    <img src="${imageData}" alt="Handsome man" />
  </a>
  `;
  let imageTemplateFragment = document.createRange().createContextualFragment(imageTemplate);
  strip.appendChild(imageTemplateFragment);
}

video.addEventListener('canplay', canvasPaint);