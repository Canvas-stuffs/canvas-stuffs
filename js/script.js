import {
  getRandomColor,
  findSmallestAreaDiffValues,
} from "../helpers/utils.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const repaintBtn = document.getElementById("repaintBtn");

class Rectangle {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.rotation = 0;
  }
  draw() {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
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

canvas.addEventListener("mousedown", (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  data.start.x = e.clientX - rect.left;
  data.start.y = e.clientY - rect.top;
  data.isDrawing = true;

  newRectangle = new Rectangle(null, null, null, null, null);

  const randomColor = getRandomColor();
  newRectangle.color = randomColor;
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

canvas.addEventListener("dblclick", async (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  data.dblClickPos.x = e.clientX - rect.left;
  data.dblClickPos.y = e.clientY - rect.top;

  for (let index = rectangles.length - 1; index >= 0; index--) {
    const rectangle = rectangles[index];
    console.log("============== rectangle:", index);
    const isRectangleDblClicked =
      data.dblClickPos.x >= rectangle.x &&
      data.dblClickPos.x <= rectangle.x + rectangle.width &&
      data.dblClickPos.y >= rectangle.y &&
      data.dblClickPos.y <= rectangle.y + rectangle.height;

    if (isRectangleDblClicked) {
      console.log("rectangle cllickeddd", rectangle.x, rectangle.y);

      rotateAndDeleteRectangle(index);
      break;
    }
  }
});

canvas.addEventListener("mouseup", (e) => {
  e.preventDefault();
  if (newRectangle.x !== null && newRectangle.y !== null)
    rectangles.push(newRectangle);

  rectangles.forEach((rectangle) => {
    rectangle.draw();
  });

  console.log("===================");
  console.log("ensemble des rectangles", rectangles);
  data.start.x = null;
  data.start.y = null;
  data.end.x = null;
  data.end.y = null;
  data.end.width = null;
  data.end.height = null;
  data.isDrawing = false;
});

repaintBtn.addEventListener("click", (e) => {
  e.preventDefault();
  repaint();
});

function repaint() {
  if (rectangles.length > 1) {
    rectangleAreas = rectangles.map((el) => el.calculArea());
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
  console.log("SAY HELLO");
  requestAnimationFrame(drawRectangles);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  rectangles.forEach((rectangle) => {
    rectangle.draw();
  });
}

function rotateAndDeleteRectangle(index) {
  rectangles[index].rotateFn(45);

  setTimeout(() => {
    rectangles.splice(index, 1);
  }, 500);
}

drawRectangles();
