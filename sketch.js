let fireworks = [];
let buildings = [];
let stars = [];
let moonX, moonY, moonSize;

function setup() {
  createCanvas(windowWidth, windowHeight); // 全視窗畫布
  initializeBuildings(); // 初始化建築物
  initializeStars(); // 初始化星星
  initializeMoon(); // 初始化月亮
}

function draw() {
  background(0); // 黑色背景

  // 繪製月亮
  drawMoon();

  // 繪製星星
  for (let star of stars) {
    fill(255);
    noStroke();
    ellipse(star.x, star.y, star.size);
  }

  // 繪製建築物
  for (let building of buildings) {
    fill(building.color);
    rect(building.x, building.y, building.width, building.height);
  }

  // 繪製煙火
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    if (fireworks[i].done()) {
      fireworks.splice(i, 1); // 移除已完成的煙火
    }
  }

  // 隨機生成煙火
  if (random(1) < 0.02) {
    fireworks.push(new Firework(random(width), random(height / 2)));
  }
}

function mousePressed() {
  // 在點擊位置生成煙火
  fireworks.push(new Firework(mouseX, mouseY));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 畫布隨視窗大小調整
  initializeBuildings(); // 重新初始化建築物
  initializeStars(); // 重新初始化星星
  initializeMoon(); // 重新初始化月亮
}

// 初始化建築物
function initializeBuildings() {
  buildings = [];
  let buildingWidth = 50;
  for (let x = 0; x < width; x += buildingWidth + 10) {
    let buildingHeight = random(100, 300);
    buildings.push({
      x: x,
      y: height - buildingHeight,
      width: buildingWidth,
      height: buildingHeight,
      color: color(100) // 固定深灰色建築物顏色
    });
  }
}

// 初始化星星
function initializeStars() {
  stars = [];
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: random(width),
      y: random(height / 2), // 星星只出現在畫布上半部分
      size: random(1, 3)
    });
  }
}

// 初始化月亮
function initializeMoon() {
  moonX = random(width * 0.7, width * 0.9); // 月亮在畫布右上方
  moonY = random(height * 0.1, height * 0.3);
  moonSize = 80; // 月亮大小
}

// 繪製月亮
function drawMoon() {
  fill(255, 255, 200); // 淡黃色
  noStroke();
  ellipse(moonX, moonY, moonSize);

  // 模擬月亮陰影
  fill(0, 0, 0, 50); // 半透明黑色
  ellipse(moonX - moonSize * 0.2, moonY - moonSize * 0.2, moonSize * 0.8);
}

// 煙火類別
class Firework {
  constructor(x, y) {
    this.firework = new Particle(x, height, true);
    this.exploded = false;
    this.particles = [];
    this.targetY = y; // 煙火目標高度
  }

  update() {
    if (!this.exploded) {
      this.firework.applyForce(createVector(0, -0.2)); // 向上移動
      this.firework.update();

      // 當煙火到達目標高度時爆炸
      if (this.firework.pos.y <= this.targetY) {
        this.exploded = true;
        this.explode();
      }
    }

    for (let particle of this.particles) {
      particle.applyForce(createVector(0, 0.1)); // 重力
      particle.update();
    }
  }

  explode() {
    for (let i = 0; i < 200; i++) { // 爆炸粒子數量增加
      let p = new Particle(this.firework.pos.x, this.firework.pos.y, false);
      this.particles.push(p);
    }
  }

  done() {
    return this.exploded && this.particles.length === 0;
  }

  show() {
    if (!this.exploded) {
      this.firework.show();
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].show();
      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  }
}

// 粒子類別
class Particle {
  constructor(x, y, firework) {
    this.pos = createVector(x, y);
    this.firework = firework;
    this.lifespan = 255;

    if (firework) {
      this.vel = createVector(0, random(-12, -8)); // 慢慢升上去
    } else {
      this.vel = p5.Vector.random2D().mult(random(4, 15)); // 爆炸擴散更大
    }

    this.acc = createVector(0, 0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    if (!this.firework) {
      this.vel.mult(0.95); // 減速
      this.lifespan -= 4; // 壽命減少
    }

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    colorMode(HSB);
    if (!this.firework) {
      strokeWeight(2);
      stroke(random(255), 255, 255, this.lifespan); // 爆炸粒子顏色
    } else {
      strokeWeight(4);
      stroke(255); // 上升煙火顏色
    }
    point(this.pos.x, this.pos.y);
  }

  done() {
    return this.lifespan < 0;
  }
}
