// import patterns from "./patterns.js";

let paused = false; // hide spiro-cursor
let mid = { x: 0, y: 0 };
let paper;
let guidePaper;
let footer;
let guideScribble;
function getNumLoops(a, b, c, d) {
  if (!c) {
    c = a;
  }
  if (!d) {
    d = b;
  }
  let dividend = Math.max(a, b);
  let divisor = Math.min(a, b);
  // let quotient = Math.floor(dividend / divisor);
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
  guidePaper.clear();
  const scaleFactor = 5;
  let {
    ringCircumference,
    wheelCircumference,
    fraction,
    rotation,
    hue,
    saturation,
    brightness,
    strokeWeight,
    useScribble,
  } = opts;
  ringCircumference *= scaleFactor;
  wheelCircumference *= scaleFactor;
  let x = mid.x;
  let y = mid.y;
  const radius = ringCircumference - wheelCircumference;

  let ratio = ringCircumference / wheelCircumference - 1;
  let rate = (1 / ratio) * 0.02; // speed of drawing & curve fidelity
  let pen;
  let prevPen;
  let counter = 0;
  const numLoops = getNumLoops(ringCircumference, wheelCircumference);
  const counterMax = (Math.PI * 2 * numLoops) / (ratio + 1.0) + 0.2;
  const clampValue = 1;

  guidePaper.push();
  guidePaper.translate(x, y);
  guidePaper.rotate(radians(rotation));
  guidePaper.translate(-x, -y);
  while (counter < counterMax) {
    pen = {
      x:
        x +
        radius * constrain(cos(counter), -clampValue, clampValue) +
        fraction * wheelCircumference * cos(counter * ratio),
      y:
        y +
        radius * constrain(sin(counter), -clampValue, clampValue) -
        fraction * wheelCircumference * sin(counter * ratio),
    };
    if (prevPen === undefined) {
      prevPen = {
        x: pen.x,
        y: pen.y,
      };
    }
    counter += rate;

    if (useScribble) {
      alpha = random() > 0.95 ? random(0.7) + 0.3 : 1.0;
      guidePaper.strokeWeight(strokeWeight * random(0.5, 1));
      guideScribble.bowing = random() > 0.9 ? random(2) : 0.0;
      guideScribble.roughness = random() > 0.9 ? random(2) : 0.0;
    } else {
      alpha = 1.0;
      guidePaper.strokeWeight(strokeWeight);
      guideScribble.bowing = 0.0;
      guideScribble.roughness = 0.0;
    }
    guidePaper.stroke(hue, saturation, brightness, alpha);
    guideScribble.scribbleLine(prevPen.x, prevPen.y, pen.x, pen.y);
    prevPen = {
      x: pen.x,
      y: pen.y,
    };
  }
  guidePaper.pop();
}
2;
function saveToPaper() {
  paper.image(guidePaper, 0, 0);
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
  fraction: 0.78, // 'fraction' corresponds to the 'hole' on the wheel, between 0.78 - 0.15
  rotation: 0,
  hue: 0,
  saturation: 100,
  brightness: 100,
  strokeWeight: 0.5,
  useScribble: false,
};

// https://developer.mozilla.org/en-US/docs/Learn/Forms/HTML5_input_types#color_picker_control
function setupSliderControl(props) {
  const { id, outId, attr } = props;
  const slider = document.querySelector(id);
  const output = document.querySelector(outId);
  slider.addEventListener("input", (evt) => {
    const { target } = evt;
    const { value } = target;
    output.textContent = value;
    options[attr] = +value;
    drawSpirograph(options);
  });
}

function setupRadioControls() {
  footer.addEventListener("change", (evt) => {
    const { target } = evt;
    const { name, id, value } = target;
    if (name === "ring-circ") {
      options.ringCircumference = +value;
      drawSpirograph(options);
    }
    if (name === "wheel-circ") {
      options.wheelCircumference = +value;
      drawSpirograph(options);
    }
  });
}
/*
 *
 * SETUP
 *
 */
function setup() {
  createCanvas(windowWidth - 20, windowHeight - 20);
  mid = {
    x: windowWidth * 0.5,
    y: windowHeight * 0.5,
  };
  footer = document.querySelector("footer");
  // "2nd canvas"
  paper = createGraphics(windowWidth - 20, windowHeight - 20);
  // paper.blendMode(BLEND); // https://p5js.org/reference/#/p5/blendMode
  // "3rd" canvas"
  guidePaper = createGraphics(windowWidth - 20, windowHeight - 20);

  // scribble lib
  guideScribble = new Scribble(guidePaper);
  guideScribble.bowing = 0;
  guideScribble.maxOffset = 2;
  guideScribble.roughness = 0;

  guidePaper.colorMode(HSB);
  guidePaper.noFill();
  guidePaper.stroke(0, 0, 100);
  guidePaper.strokeWeight(0.5);

  setupSliderControl({
    id: "#fraction",
    outId: "#fraction-output",
    attr: "fraction",
  });
  setupSliderControl({
    id: "#rotation",
    outId: "#rotation-output",
    attr: "rotation",
  });
  setupSliderControl({ id: "#hue", outId: "#hue-output", attr: "hue" });
  setupSliderControl({
    id: "#saturation",
    outId: "#saturation-output",
    attr: "saturation",
  });
  setupSliderControl({
    id: "#brightness",
    outId: "#brightness-output",
    attr: "brightness",
  });
  setupRadioControls();

  drawSpirograph(options);
}

/*
 *
 * DRAW
 *
 */
function draw() {
  clear();
  if (paused === false) {
    options.rotation += 0.1;
    drawSpirograph(options);
    image(guidePaper, 0, 0);
  }

  image(paper, 0, 0);
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
  // mid.y = showControls ? windowHeight * 0.38 : windowHeight * 0.5;
  // drawSpirograph(options);
}
function randomizeMe() {
  options = {
    ringCircumference: random(ringCircumferences),
    wheelCircumference: random(wheelCircumferences),
    fraction: random(0.15, 0.78),
    rotation: random(360),
    hue: random(360),
    saturation: random(100),
    brightness: random(100),
  };
  drawSpirograph(options);
  // also update controls
}

function patternBG() {
  const numSteps = 50;
  options.saturation = Math.floor(Math.random() * 50);
  options.fraction = 1.6;
  options.strokeWeight = 10;
  let n = 0;
  let fractionInc = 0.02;
  let strokeWeightInc = 0.2;
  while (n < numSteps) {
    paper.background("rgba(0, 0, 0, 0.025)");
    options.fraction -= fractionInc;
    options.rotation += 2;
    options.strokeWeight -= strokeWeightInc;
    drawSpirograph(options);
    saveToPaper();
    n += 1;
  }
  options.hue = 0;
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
    strokeWeight: 2,
    useScribble: true,
  };
  mid = {
    x: windowWidth * 0.5,
    y: windowHeight * 0.5,
  };
  paused = false;
}

function doPattern (n) {
  const { numSteps, hueInc, fractionInc, rotationInc, needsReset, hues } = patterns[n];
  if (needsReset) {
    resetOptions();
  }
  let hueThresh;
  if (hues) {
    hueThresh = Math.floor(numSteps / hues.length);
  }
  
  for (let i = 0; i < numSteps; i += 1) {
    options.fraction += fractionInc;
    options.rotation += rotationInc;
    if (hueInc) {
      options.hue += hueInc;
    }
    if (hues) {
      options.hue = i <= hueThresh ? hues[0] : hues[1];
    }
      drawSpirograph(options);
    saveToPaper();
  }
}

function keyPressed() {
  const S = 83;
  const SPACE = 32;
  const tilde = 192;
  const R = 82;
  const key1 = 49;
  const key2 = 50;
  const key3 = 51;
  const key4 = 52;
  const key5 = 53;
  const key6 = 54;
  const key7 = 55;
  const key8 = 56;
  const key9 = 57;
  const key0 = 48;
  const dash = 189;
  const slash = 191;
  const equals = 187;
  // console.log(keyCode, key);
  if (keyCode === ESCAPE) {
    paper.clear();
    resetOptions();
  }
  if (keyCode === S) {
    saveToPaper();
  }
  if (keyCode === SPACE) {
    saveCanvas("Spirography-xxxx", "png");
  }
  if (keyCode === tilde) {
    toggleControls();
  }
  if (keyCode === R) {
    randomizeMe();
  }
  if (keyCode === key1) {
    patterns[1]();
  }
  if (keyCode === key2) {
    patterns[2]();
  }
  if (keyCode === key3) {
    patterns[3]();
  }
  if (keyCode === key4) {
    patterns[4]();
  }
  if (keyCode === key5) {
    patterns[5]();
  }
  if (keyCode === key6) {
    doPattern(6);
  }
  if (keyCode === key7) {
    patterns[7]();
  }
  if (keyCode === key8) {
    patterns[8]();
  }
  if (keyCode === key9) {
    patterns[9]();
  }
  if (keyCode === key0) {
    patterns[10]();
  }
  if (keyCode === dash) {
    patterns[11]();
  }
  if (keyCode === equals) {
    doPattern(0);
  }
  if (keyCode === slash) {
    // show/hide spiro-cursor
    paused = !paused;
  }
}

function mouseClicked(evt) {
  const { target } = evt;
  const { classList } = target;
  const isCanvas = classList.contains("p5Canvas");
  if (isCanvas) {
    mid = {
      x: mouseX,
      y: mouseY,
    };
  }
  ``;
}

function windowResized() {
  resizeCanvas(windowWidth - 20, windowHeight - 20);
  // how to resize the guidePaper & paper canvases?
  //https://stackoverflow.com/questions/47363844/how-do-i-resize-a-p5-graphic-object
}

/*
// TODO: make responsive
// TODO: improve UI
// TODO: Animate transitions
// TODO: improved controls (randomize, save, autodraw, etc ...)
 */

// 3 layers: muted background
//  filler / detail middle
// and hero top
//
//
// each iteration rotates separately
// play with line thickness / line quality
