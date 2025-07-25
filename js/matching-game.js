const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const rows = 4;
const cols = 4;
const total = rows * cols;
const size = 100;
const padding = 10;

let tiles = [];
let selected = [];
let matched = [];

let colors = [
  "red", "green", "blue", "yellow",
  "orange", "purple", "cyan", "pink"
];

colors = [...colors, ...colors]; // مضاعفة الألوان للمطابقة
colors.sort(() => Math.random() - 0.5); // خلط

class Tile {
  constructor(x, y, color, index) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.index = index;
    this.revealed = false;
  }

  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, size, size);
    ctx.fillStyle = this.revealed || matched.includes(this.index) ? this.color : "#ccc";
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.stroke();
  }

  isClicked(mx, my) {
    return mx > this.x && mx < this.x + size && my > this.y && my < this.y + size;
  }
}

function init() {
  tiles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const x = c * (size + padding) + padding;
      const y = r * (size + padding) + padding;
      tiles.push(new Tile(x, y, colors[i], i));
    }
  }
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  tiles.forEach(tile => tile.draw());
}

canvas.addEventListener("click", (e) => {
  if (selected.length === 2) return;

  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  tiles.forEach(tile => {
    if (tile.isClicked(mx, my) && !tile.revealed && !matched.includes(tile.index)) {
      tile.revealed = true;
      selected.push(tile);
      draw();

      if (selected.length === 2) {
        setTimeout(checkMatch, 800);
      }
    }
  });
});

function checkMatch() {
  if (selected[0].color === selected[1].color) {
    matched.push(selected[0].index, selected[1].index);
  } else {
    selected[0].revealed = false;
    selected[1].revealed = false;
  }
  selected = [];
  draw();

  if (matched.length === total) {
    setTimeout(() => alert("🎉 مبروك! أنهيت اللعبة!"), 300);
  }
}

init();
