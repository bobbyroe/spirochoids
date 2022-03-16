let mid = { x: 0, y: 0 };
let footer;
let bgColor = "#202020";
let masterHue = 0;
let cnv;
let canvasSizeMultiplier = { x: 1.0, y: 1.0 };
let currentGraphs = [];
function getNumLoops(a, b, c, d) {
  if (!c) {
    c = a;
  }
  if (!d) {
    d = b;
  }
  let dividend = Math.max(a, b);
  let divisor = Math.min(a, b);
  let remainder = dividend % divisor;
  let numLoops = 0;
  if (remainder === 0) {
    numLoops = (c * d) / divisor / d;
  } else {
    numLoops = getNumLoops(divisor, remainder, c, d);
  }
  return numLoops;
}

function drawSpirograph(opts) {
  const scaleFactor = 5;
  let {
    ringCircumference,
    wheelCircumference,
    fraction,
    rotation,
    hue,
    saturation, // sendom changes
    brightness, // seldom changes
  } = opts;

  ringCircumference *= scaleFactor;
  wheelCircumference *= scaleFactor;
  let x = mid.x;
  let y = mid.y;
  const radius = ringCircumference - wheelCircumference;

  let ratio = ringCircumference / wheelCircumference - 1;
  let rate = (1 / ratio) * 0.02; // speed of drawing & curve fidelity
  let pen;
  let counter = 0;
  let currentHue = masterHue + hue;
  if (currentHue > 360) {
    currentHue -= 360;
  }
  const numLoops = getNumLoops(ringCircumference, wheelCircumference);
  const counterMax = (Math.PI * 2 * numLoops) / (ratio + 1.0) + 0.2;
  const clampValue = 1;

  push(); // ***
  translate(x, y); // ***
  rotate(radians(rotation)); // ***
  translate(-x, -y); // ***
  noStroke(); // ***
  beginShape(); // ***
  fill(currentHue, saturation, brightness, 0.33); // ***
  
  while (counter < counterMax) {
    pen = {
      x:
        x +
        radius * constrain(cos(counter), -clampValue, clampValue) + // ***
        fraction * wheelCircumference * cos(counter * ratio),
      y:
        y +
        radius * constrain(sin(counter), -clampValue, clampValue) - // ***
        fraction * wheelCircumference * sin(counter * ratio),
    };
  
    counter += rate;    
    vertex(pen.x, pen.y); // ***
  }
  endShape(CLOSE); // ***
  pop(); // ***
}

const ringCircumferences = [96, 105];
const wheelCircumferences = [
  84, 80, 75, 72, 63, 60, 56, 52, 48, 45, 42, 40, 32, 30, 24,
];
let ringIndex = 0;
let wheelIndex = 0;
let options = {
  ringCircumference: 96,
  wheelCircumference: 84,
  fraction: 0.7, // 'fraction' corresponds to the 'hole' on the wheel, between 0.78 - 0.15
  rotation: 0,
  hue: 0,
  saturation: 100,
  brightness: 100,
};

function setup() {
  const padding = 250;
  const size = min(windowWidth, windowHeight) - padding;

  cnv = createCanvas(
    size * canvasSizeMultiplier.x,
    size * canvasSizeMultiplier.y
  );
  cnv.style("display", "block");
  mid = {
    x: cnv.width * 0.5,
    y: cnv.height * 0.5,
  };
  
  colorMode(HSB);
  // blendMode(MULTIPLY); // https://p5js.org/reference/#/p5/blendMode 
  // draw initial pattern
  patterns[2]();

  const cSlider = document.querySelector("#canvasSize");
  const cOutput = document.querySelector("#canvasSize-output");
  const canvasSizeRatios = [
    { label: "2:1", mult: { x: 1.0, y: 0.5 } },
    { label: "4:3", mult: { x: 1.0, y: 0.75 } },
    { label: "1:1", mult: { x: 1.0, y: 1.0 } },
    { label: "3:4", mult: { x: 0.75, y: 1.0 } },
    { label: "1:2", mult: { x: 0.5, y: 1.0 } },
  ];
  cSlider.addEventListener("input", (evt) => {
    const { target } = evt;
    const { value } = target;
    const ratio = canvasSizeRatios[value];
    canvasSizeMultiplier = ratio.mult;
    cOutput.textContent = ratio.label;
    resizeWindow();
  });
  const pSlider = document.querySelector("#pattern");
  const pOutput = document.querySelector("#pattern-output");
  pSlider.addEventListener("input", (evt) => {
    const { target } = evt;
    const { value } = target;
    pOutput.textContent = value;
    patterns[value]();
  });
  const hSlider = document.querySelector("#hue");
  const hOutput = document.querySelector("#hue-output");
  hSlider.addEventListener("input", (evt) => {
    const { target } = evt;
    const { value } = target;
    hOutput.textContent = value;
    masterHue = +value;
  });

  footer = document.querySelector("footer");
  footer.addEventListener("change", (evt) => {
    const { target } = evt;
    const { name, id, value } = target;
    if (name === "light-dark") {
      if (id === "light") {
        bgColor = "#F0F0F0";
      }
      if (id === "dark") {
        bgColor = "#202020";
      }
    }
  });

  footer.addEventListener("click", (evt) => {
    const { target } = evt;
    const { id } = target;
    if (id === "random") {
      console.log("randomize, canvas size, *craziness* and dark / light");
      randomizeMe();
    }
    if (id === "print") {
      console.log("PRINT");
      saveCanvas("Spirography-xxxx", "png");
    }
  });
}

/*
 *
 * DRAW
 *
 */
let rotationMult = 1.0;
let patternRotation = 90;
let rotationInc = 0;
function draw() {
  background(bgColor);
  rotationMult = 1.01;
  rotationInc += 0.1;
  currentGraphs.forEach((g) => {
    g.rotation = ((1 - g.fraction) * patternRotation)  * rotationMult;
    drawSpirograph(g);
  });
}
/*
 *
 * /DRAW
 *
 */

let showControls = false;
function toggleControls() {
  showControls = !showControls;
  footer.classList.toggle("hidden");
}

function resetOptions() {
  options = {
    ringCircumference: 96,
    wheelCircumference: 84,
    fraction: 0.78, // 'fraction' corresponds to the 'hole' on the wheel, between 0.78 - 0.15
    rotation: 0,
    hue: 0,
    saturation: 100,
    brightness: 100,
  };
  mid = {
    x: cnv.width * 0.5,
    y: cnv.height * 0.5,
  };
}

function keyPressed() {
  const SPACE = 32;
  const tilde = 192;
  if (keyCode === ESCAPE) {
    currentGraphs = [];
  }
  if (keyCode === SPACE) {
    saveCanvas("Spirography-xxxx", "png");
  }
  if (keyCode === tilde) {
    toggleControls();
  }
}

const deg = 180 / Math.PI;
let goalRotation = 0;
function mouseDragged(evt) {
  const { classList } = evt.target;
  const isCanvas = classList.contains("p5Canvas");
  let x = mouseX - mid.x;
  let y = mouseY - mid.y;
  
  const theta = Math.atan2(y,x);
  if (isCanvas) {
    goalRotation = theta * deg;
    patternRotation -= (patternRotation - goalRotation) * 0.1;
  }
}

function resizeWindow() {
  const padding = 150;
  const newSize = min(windowWidth, windowHeight) - padding;
  resizeCanvas(
    newSize * canvasSizeMultiplier.x,
    newSize * canvasSizeMultiplier.y
  );
  mid = {
    x: cnv.width * 0.5,
    y: cnv.height * 0.5,
  };
  // how to resize the guidePaper & paper canvases?
  //https://stackoverflow.com/questions/47363844/how-do-i-resize-a-p5-graphic-object
}

function windowResized() {
  resizeWindow();
}

// 3 layers: muted background
//  filler / detail middle
// and hero top

// play with line thickness / line quality

// play with different color combinations / blending
// try color pairings like the ones in my morning pages

// combine lines & fills
// scribble fills
// shaders? (watercolor)
