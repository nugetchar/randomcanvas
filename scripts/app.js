const canvas = document.getElementById("draw_canvas");
const ctx = canvas.getContext("2d");

const drawCanvas = document.getElementById("draw_canvas");
const saveBtn = document.getElementById("save_btn");
const downloadBtn = document.getElementById("download_btn");

const MIN_SHAPES = 2;
const MAX_SHAPES = 20;

const resizeCanvas = throttle((ctx) => {
  ctx.canvas.width = window.innerWidth * 0.8;
  ctx.canvas.height = window.innerHeight * 0.5;
}, 70);

const redrawCanvas = debounce((ctx, imageData, width, height) => {
  const newCanvas = document.createElement('canvas');
  newCanvas.width = imageData.width;
  newCanvas.height = imageData.height;

  newCanvas.getContext('2d').putImageData(imageData, 0, 0);
  ctx.scale(ctx.canvas.width / width, ctx.canvas.height / height);
  ctx.drawImage(newCanvas, 0, 0);
}, 1000);

disableSaving();
resizeCanvas(ctx);

window.addEventListener("resize", () => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const {canvas: {width, height}} = ctx;
  
  requestAnimationFrame(() => resizeCanvas(ctx));
  requestAnimationFrame(() => redrawCanvas(ctx, imageData, width, height));
});

drawCanvas.addEventListener("click", () => {
  clearCanvas(ctx);
  generateRandomDrawing(ctx);
  enableSaving();
});

saveBtn.addEventListener("click", () => {
  saveToLocalStorage(canvas);

});

downloadBtn.addEventListener("click", () => saveToComputer(canvas));

function displayToast(msg) {
  
}

function throttle(fn, interval) {
  let lastTime;
  return (...args) => {
    if (!lastTime || Date.now() - lastTime >= interval) {
      fn(...args);
      lastTime = Date.now();
    }
  };
}

function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  }
}

function enableSaving() {
  saveBtn.toggleAttribute("disabled", false);
  downloadBtn.toggleAttribute("disabled", false);
}

function disableSaving() {
  saveBtn.toggleAttribute("disabled", true);
  downloadBtn.toggleAttribute("disabled", true);
}

function saveToComputer(canvas) {
  const dataUrl = canvas.toDataURL("image/png");
  const image = dataUrl.replace("image/png", "image/octet-stream");

  const element = document.createElement("a");
  const filename = "result.png";
  element.setAttribute("href", image);
  element.setAttribute("download", filename);

  element.click();
}

function saveToLocalStorage(canvas) {
  const dataUrl = canvas.toDataURL("image/png");
  const {width, height} = canvas;
  const images = JSON.parse(localStorage.getItem("images")) ?? [];
  images.push({dataUrl, width, height});
  localStorage.setItem("images", JSON.stringify(images));
}

function clearCanvas(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function generateRandomDrawing(ctx) {

  const nbShapes = getRandomNumberBetween(MIN_SHAPES, MAX_SHAPES);
  for (let i = 0; i < nbShapes; i++) {
    const hasStroke = getRandomNumberBetween(0, 1);
    const x0 = getRandomNumberBetween(0, ctx.canvas.width / 3);
    const y0 = getRandomNumberBetween(0, ctx.canvas.height / 3);
    const x = getRandomNumberBetween(x0 + 1, ctx.canvas.width);
    const y = getRandomNumberBetween(y0 + 1, ctx.canvas.height);
    const [r, g, b, a] = [
      getRandomNumberBetween(0, 255),
      getRandomNumberBetween(0, 255),
      getRandomNumberBetween(0, 255),
      getRandomNumberBetween(0.5, 0.8),
    ];

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    ctx.fillRect(x0, y0, x, y);

    if (hasStroke) {
      CSSTransition.strokeStyle = `rgba(0, 0, 0, 1)`;
      ctx.strokeRect(x0, y0, x, y);
    }
  }
}

function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
