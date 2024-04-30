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
  }
  delete() {
    ctx.clearRect(this.x, this.y, this.width, this.height);

    return new Promise(() => {
      setTimeout(() => {
        // ctx.save();

        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        // ctx.fillRect(0, 0, this.width, this.height);
        ctx.fillRect(
          -this.width / 2,
          -this.height / 2,
          this.width,
          this.height
        );

        // ctx.restore();
        ctx.clearRect(
          -this.width / 2 - 2,
          -this.height / 2 - 2,
          this.width + 3,
          this.height + 3
        );
      }, 1000);
    });

    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    // rectangles.splice(idx, 1);
  }
  rotateFn(angle) {
    this.rotation = angle;
    this.draw();
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

canvas.addEventListener("dblclick", (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  data.dblClickPos.x = e.clientX - rect.left;
  data.dblClickPos.y = e.clientY - rect.top;

  for (const rectangle of rectangles) {
    const isRectangleDblClicked =
      data.dblClickPos.x >= rectangle.x &&
      data.dblClickPos.x <= rectangle.x + rectangle.width &&
      data.dblClickPos.y >= rectangle.y &&
      data.dblClickPos.y <= rectangle.y + rectangle.height;

    if (isRectangleDblClicked) {
      console.log("rectangle cllickeddd", rectangle.x, rectangle.y);

      rectangle.delete();
      rectangle.rotateFn(45);

      console.log("AFTER OPERATIONS", rectangles);
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
  rectangleAreas = rectangles.map((el) => el.calculArea());
  let [minIdx1, minIdx2] = findSmallestAreaDiffValues(rectangleAreas);

  let randomColor = getRandomColor();

  rectangles[minIdx1].paint(randomColor);
  rectangles[minIdx2].paint(randomColor);
}
