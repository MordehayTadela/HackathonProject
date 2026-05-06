let stepsData;
let currentStep = 0;
let lastUpdateTime = 0;
let delayTime = 1000; // 1 second

function preload() {
  stepsData = loadJSON("steps.json");
}

function setup() {
  let canvas = createCanvas(900, 500);
  canvas.parent("canvas-container");
  textFont("Arial");
}

function draw() {
  background(245);

  drawTitle();

  if (millis() - lastUpdateTime > delayTime) {
    currentStep++;

    if (currentStep >= Object.keys(stepsData).length) {
      currentStep = Object.keys(stepsData).length - 1;
    }

    lastUpdateTime = millis();
  }

  drawVariables();
  drawErrorBox();
}

function drawTitle() {
  fill(0);
  textSize(32);
  textAlign(CENTER);

  text("משתנים", width / 2, 50);

  textSize(20);
  text("מציג את שינויי המשתנים בכל שלב של הקוד", width / 2, 90);
}

function drawVariables() {
  let allVariables = stepsData[currentStep].all_variables;

  let startX = 150;
  let startY = 150;

  let boxWidth = 200;
  let boxHeight = 120;

  let gapX = 50;
  let gapY = 50;

  let boxesPerRow = 3;

  let index = 0;

  for (let variableName in allVariables) {

    let value = allVariables[variableName];

    let col = index % boxesPerRow;
    let row = Math.floor(index / boxesPerRow);

    let x = startX + col * (boxWidth + gapX);
    let y = startY + row * (boxHeight + gapY);

    let changedVariable = stepsData[currentStep].variable;

// זמן קצר אחרי מעבר שלב
let recentlyChanged = millis() - lastUpdateTime < 350;

if (variableName === changedVariable && recentlyChanged) {

  fill(255, 255, 120);

  stroke(255, 180, 0);
  strokeWeight(5);

} else {

  fill(255);

  stroke(50);
  strokeWeight(2);
}

rect(x, y, boxWidth, boxHeight, 15);
    rect(x, y, boxWidth, boxHeight, 15);

    fill(0);
    noStroke();

    textAlign(CENTER);

    textSize(28);
    text(variableName, x + boxWidth / 2, y + 40);

    textSize(36);
    text(value, x + boxWidth / 2, y + 90);

    index++;
  }
}

function drawErrorBox() {

  let step = stepsData[currentStep];

  if (!step.error) {
    return;
  }

  let boxX = 150;
  let boxY = 360;

  let boxW = 600;
  let boxH = 100;

  fill(255, 230, 230);

  stroke(200, 0, 0);
  strokeWeight(2);

  rect(boxX, boxY, boxW, boxH, 15);

  fill(150, 0, 0);
  noStroke();

  textAlign(RIGHT);

  textSize(22);

  text(
    "שגיאה: שימוש במשתנה שלא הוגדר",
    boxX + boxW - 20,
    boxY + 35
  );

  textSize(18);

  text(
    step.error.message,
    boxX + boxW - 20,
    boxY + 65
  );

  text(
    step.error.hint,
    boxX + boxW - 20,
    boxY + 90
  );
}