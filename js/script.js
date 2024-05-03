import {
  getRandomColor,
  findSmallestAreaDiffValues,
  toggleCursorStyle,
  removeCursorStyle,
} from "../helpers/utils.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

class Rectangle {
  constructor(x, y, width, height, color, isPreview = false) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.rotation = 0;
    this.isPreview = isPreview;
  }
  draw(index) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate((this.rotation * Math.PI) / 180);
    if (this.isPreview) {
      ctx.globalAlpha = 0.5;
    }
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fillStyle = "#000000";
    ctx.font = "20px Arial";
    ctx.fillText(`${index}`, -5, 5);
    ctx.restore();
  }
  rotateFn(angle) {
    this.rotation = angle;
  }
  calculArea() {
    return this.width * this.height;
  }
  paint(color) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    this.color = color;
    ctx.fillStyle = color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }
}

const data = {
  start: {
    x: null,
    y: null,
  },
  end: {
    x: null,
    y: null,
  },
  dblClickPos: {
    x: null,
    y: null,
  },
  rect: {
    width: 0,
    height: 0,
  },
  isDrawing: false,
};

let rectangles = [];
let rectangleAreas = [];
let newRectangle;
let rectanglesToDelete = {};


canvas.addEventListener("mousedown", (e) => {
  toggleCursorStyle();

  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  data.start.x = e.clientX - rect.left;
  data.start.y = e.clientY - rect.top;

  data.isDrawing = true;

  const randomColor = getRandomColor();

  newRectangle = new Rectangle(null, null, 0, 0, randomColor, true);
});

canvas.addEventListener("mousemove", (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  data.end.x = e.clientX - rect.left;
  data.end.y = e.clientY - rect.top;

  data.rect.width = data.end.x - data.start.x;
  data.rect.height = data.end.y - data.start.y;

  if (data.isDrawing) {
    newRectangle.x = data.start.x;
    newRectangle.y = data.start.y;
    newRectangle.width = data.rect.width;
    newRectangle.height = data.rect.height;
  }
});

canvas.addEventListener("mouseup", (e) => {
  removeCursorStyle();
  e.preventDefault();
  newRectangle.isPreview = false;

  const isNewRectangle =
    newRectangle.x !== null &&
    newRectangle.y !== null &&
    newRectangle.width !== 0 &&
    newRectangle.height !== 0;

  if (isNewRectangle) {
    rectangles.push(newRectangle);
  }

  newRectangle.draw("new");

  data.start.x = null;
  data.start.y = null;
  data.end.x = null;
  data.end.y = null;
  data.end.width = 0;
  data.end.height = 0;
  data.isDrawing = false;
});

canvas.addEventListener("dblclick", async (e) => {
  removeCursorStyle();
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  data.dblClickPos.x = e.clientX - rect.left;
  data.dblClickPos.y = e.clientY - rect.top;

  for (let index = rectangles.length - 1; index >= 0; index--) {
    const rectangle = rectangles[index];
    const isRectangleDblClicked =
      data.dblClickPos.x >= rectangle.x &&
      data.dblClickPos.x <= rectangle.x + rectangle.width &&
      data.dblClickPos.y >= rectangle.y &&
      data.dblClickPos.y <= rectangle.y + rectangle.height;

    if (isRectangleDblClicked) {
      rotateAndDeleteRectangle(rectangle, index);
      break;
    }
  }
});

document.getElementById("paint").addEventListener("click", (e) => {
  e.preventDefault();
  repaint();
});

document.getElementById("clear").addEventListener("click", (e) => {
  e.preventDefault();
  rectangles = [];
});

function repaint() {
  if (rectangles.length > 1) {
    rectangleAreas = rectangles.map((rectangle) => rectangle.calculArea());
    let [firstMinDiffAreaIdx, secondMinDiffAreaIdx] =
      findSmallestAreaDiffValues(rectangleAreas);

    let randomColor = getRandomColor();

    rectangles[firstMinDiffAreaIdx].paint(randomColor);
    rectangles[secondMinDiffAreaIdx].paint(randomColor);
  } else {
    alert(
      "Il faut au minimum 2 rectangles pour effectuer cette opération. Créez en un autre!"
    );
  }
}

function drawRectangles() {
  requestAnimationFrame(drawRectangles);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  rectangles.forEach((rectangle, index) => {
    rectangle.draw(index);
  });

  if (data.isDrawing) {
    newRectangle.draw("");
  }
}

function rotateAndDeleteRectangle(rectangle, index) {
  const interval = setInterval(() => {
    if (rectangle.rotation < 360) {
      rectangle.rotateFn(rectangle.rotation + 10);
      rectanglesToDelete[index] = false;
    } else {
      clearInterval(interval);
      rectanglesToDelete[index] = true;

      const rectangleToDelIndexes = Object.keys(rectanglesToDelete).map(
        (key) => +key
      );

      const isAllRotationCompleted = rectangleToDelIndexes.every(
        (key) => rectanglesToDelete[key] === true
      );

      if (isAllRotationCompleted) {
        rectangles = rectangles.filter(
          (el, idx) => !rectangleToDelIndexes.includes(idx)
        );
        rectanglesToDelete = {};
      }
    }
  }, 100);
}

drawRectangles();
