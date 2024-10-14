let letters = []; // Store letters along with their positions and velocities
let lastTypedTime = 0;
let cursorPos = { x: 0, y: 50 };
let spreading = false;
let customFont;

function preload() {
  customFont = loadFont('stretchtypewritter-variableVF.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(customFont);
  textSize(1.8 * width / 100);
  textAlign(LEFT, TOP);
  cursorPos.x = width / 4;
  cursorPos.y = width/100*3;
  frameRate(30);
}

function draw() {
  background(248, 245, 240);

  // Draw existing letters
  letters.forEach((letter, index) => {
    push();
    translate(letter.x, letter.y);
    rotate(letter.rotation);
    text(letter.char, 0, 0);
    pop();

    if (spreading && millis() - letter.startSpreadTime > index * 1000) {
      letter.x += letter.vx;
      letter.y += letter.vy;
      letter.rotation += letter.vr;

      // Check for bouncing on edges
      if (letter.x < 10 || letter.x > width - 40) {
        letter.vx *= -1;
      }
      if (letter.y < 10 || letter.y > height-width/10) {
        letter.vy *= -1;
      }
    }
  });

  // Draw cursor
  drawCursor();

  // Check if we should start spreading
  if (millis() - lastTypedTime > 1000) {
    startSpreading();
  }
}

function drawCursor() {
  if (frameCount % 30 < 15) { // Blinking effect
    line(cursorPos.x, cursorPos.y + 5, cursorPos.x, cursorPos.y + 25);
  }
}

function keyTyped() {
  if (key !== 'Enter') {
    // Add typed character to letters array
    letters.push({
      char: key,
      x: cursorPos.x,
      y: cursorPos.y,
      vx: random(-1, 1),
      vy: random(-1, 1),
      vr: random(-0.05, 0.05),
      rotation: 0,
      startSpreadTime: millis()
    });
    lastTypedTime = millis();
    spreading = false;

    // Update cursor position
    cursorPos.x += textWidth(key);

    // Auto line break if cursor position exceeds 3/4 width
    if (cursorPos.x > (3 * width) / 4) {
      cursorPos.x = width / 4;
      cursorPos.y += textSize() * 1.5;
    }
  }
}

function keyPressed() {
  if (keyCode === BACKSPACE && letters.length > 0) {
    // Remove last character from letters array
    letters.pop();
    lastTypedTime = millis();
    spreading = false;

    // Update cursor position
    if (letters.length > 0) {
      let lastLetter = letters[letters.length - 1];
      cursorPos.x = lastLetter.x + textWidth(lastLetter.char);
      cursorPos.y = lastLetter.y;
    } else {
      cursorPos.x = width / 4;
      cursorPos.y = 50;
    }
  } else if (keyCode === ENTER) {
    // Add line break
    cursorPos.x = width / 4;
    cursorPos.y += textSize() * 1.5;
    lastTypedTime = millis();
    spreading = false;
  }
}

function startSpreading() {
  spreading = true;
  letters.forEach((letter, index) => {
    if (!letter.startSpreadTime || !spreading) {
      letter.startSpreadTime = millis();
    }
  });
}