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
  guidePaper.beginShape(); // // // // // //
  guidePaper.fill(hue, saturation, brightness); // // // // // //
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
    // guidePaper.stroke(hue, saturation, brightness, alpha);
    // guideScribble.scribbleLine(prevPen.x, prevPen.y, pen.x, pen.y);
    guidePaper.vertex(pen.x, pen.y);
    // guidePaper.line(prevPen.x, prevPen.y, pen.x, pen.y);
    prevPen = {
      x: pen.x,
      y: pen.y,
    };
  }
  guidePaper.endShape(CLOSE); // // // // // //
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
  // guidePaper.noFill();
  // guidePaper.stroke(0, 0, 100);
  // guidePaper.strokeWeight(2);
  guidePaper.fill(0, 0, 100);
  guidePaper.noStroke();

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

function patternFirst() {
  const numSteps = 12;
  let n = 0;
  while (n < numSteps) {
    options.fraction -= 0.02;
    options.rotation += 2;
    options.hue += 3;
    drawSpirograph(options);
    saveToPaper();
    n += 1;
  }
  options.hue = 0;
}

function pattern1() {
  let numSteps = 8;
  function loop({ rotation, hue }) {
    resetOptions();
    options.fraction = 0.85;
    let n = 0;
    options.rotation = rotation;
    while (n < numSteps) {
      options.fraction -= 0.02;
      options.rotation += 2;
      options.hue = hue;
      drawSpirograph(options);
      saveToPaper();
      n += 1;
    }
  }
  loop({ rotation: 0, hue: 0 });
  loop({ rotation: 3, hue: 200 });
}

function pattern2() {
  resetOptions();
  options.ringCircumference = 105;
  options.wheelCircumference = 56;
  options.fraction = 0.92;
  options.hue = 190;
  const numSteps = 4;
  let n = 0;
  while (n < numSteps) {
    options.fraction -= 0.07;
    drawSpirograph(options);
    saveToPaper();
    n += 1;
  }
}

function pattern3() {
  resetOptions();
  options.ringCircumference = 105;
  options.wheelCircumference = 80;
  const fractions = [0.87, 0.72, 0.57, 0.42, 0.27];
  const hues = [15, 195, 15, 195, 140, 140];
  options.fraction = 0.92;
  options.hue = 190;
  let n = 0;
  const len = fractions.length;
  for (let i = 0; i < len; i += 1) {
    options.fraction = fractions[i];
    options.hue = hues[i];
    drawSpirograph(options);
    saveToPaper();
    n += 1;
  }
}

function pattern4() {
  options.ringCircumference = 105;
  options.wheelCircumference = 63;
  options.fraction = 0.85;
  options.hue = 190;
  options.rotation = 340;
  const numSteps = 9;
  let n = 0;
  while (n < numSteps) {
    options.rotation += 2;
    options.hue = n <= 2 ? 0 : n >= 6 ? 140 : 195;
    options.fraction -= 0.03;
    drawSpirograph(options);
    saveToPaper();
    n += 1;
  }
}

function pattern5() {
  resetOptions();
  options.ringCircumference = 105;
  options.wheelCircumference = 45;
  options.fraction = 0.85;
  options.rotation = 12;
  const numSteps = 6;
  let n = 0;
  while (n < numSteps) {
    options.fraction -= 0.1;
    options.hue = n <= 2 ? 190 : 140;
    drawSpirograph(options);
    saveToPaper();
    n += 1;
  }
}

function pattern6() {
  resetOptions();
  options.ringCircumference = 105;
  options.wheelCircumference = 84;
  options.fraction = 0.8;
  options.rotation = 340;
  const numSteps = 22;
  let n = 0;
  while (n < numSteps) {
    options.fraction -= 0.02;
    options.rotation += 6;
    options.hue = n <= 11 ? 190 : 140;
    drawSpirograph(options);
    saveToPaper();
    n += 1;
  }
}

function pattern7() {
  resetOptions();
  options.ringCircumference = 105;
  options.fraction = 0.65;
  options.rotation = 323;
  const wheelCircs = [30, 45, 60, 75];
  const hues = [195, 15, 140, 15];
  const len = wheelCircs.length;
  for (let i = 0; i < len; i += 1) {
    for (let n = 0; n < 3; n += 1) {
      options.wheelCircumference = wheelCircs[i];
      options.fraction -= 0.03;
      options.hue = hues[i];
      drawSpirograph(options);
      saveToPaper();
    }
  }
}

function pattern8() {
  resetOptions();
  options.ringCircumference = 96;
  options.wheelCircumference = 48;
  options.fraction = 0.9;
  options.rotation = 90;
  const numLoops = 13;
  const hues = [15, 195, 15, 195];
  const len = hues.length;
  for (let i = 0; i < len; i += 1) {
    let n = 0;
    while (n < numLoops) {
      options.rotation += 3.5;
      options.hue = hues[i];
      drawSpirograph(options);
      saveToPaper();
      n += 1;
    }
  }
}

function pattern9() {
  resetOptions();
  options.ringCircumference = 96;
  options.wheelCircumference = 80;
  options.fraction = 0.85;
  options.rotation = 323;
  const hues = [195, 140, 195, 140];
  const len = hues.length;
  for (let i = 0; i < len; i += 1) {
    for (let n = 0; n < 6; n += 1) {
      options.rotation += i <= 1 ? 4 : 3;
      options.fraction = i <= 1 ? 0.85 : 0.4;
      options.hue = hues[i];
      drawSpirograph(options);
      saveToPaper();
    }
  }
}

function pattern10() {
  resetOptions();
  options.ringCircumference = 96;
  options.wheelCircumference = 42;
  const hues = [15, 195];
  const counts = [3, 2];
  const wheelCircs = [42, 60];
  const fractions = [0.78, 0.84];
  const len = hues.length;
  for (let i = 0; i < len; i += 1) {
    for (let j = 0; j < counts[i]; j += 1) {
      options.rotation += 3;
      options.hue = hues[i];
      options.wheelCircumference = wheelCircs[i];
      options.fraction = fractions[i];
      drawSpirograph(options);
      saveToPaper();
      
    }
  }
}

// * use fills instead of lines
// * add more large fraction iterations

function pattern11(extend = false) {
  resetOptions();
  options.ringCircumference = 105;
  options.wheelCircumference = 42;
  options.rotation = 13;
  options.strokeWeight = 3;
  const hues = [280, 195, 150, 15];
  const wheelCircs = [15, 30, 45, 60];
  const len = hues.length;
  const startIndex = extend ? 0 : 1;
  for (let i = startIndex; i < len; i += 1) {
    options.hue = hues[i];
    options.fraction = 0.78;
    options.wheelCircumference = wheelCircs[i];
    for (let j = 0; j < 3; j += 1) {
      options.fraction -= 0.05;
      drawSpirograph(options);
      saveToPaper();
    }
  }
  paused = true;
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
  console.log(keyCode, key);
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
    pattern1();
  }
  if (keyCode === key2) {
    pattern2();
  }
  if (keyCode === key3) {
    pattern3();
  }
  if (keyCode === key4) {
    pattern4();
  }
  if (keyCode === key5) {
    pattern5();
  }
  if (keyCode === key6) {
    pattern6();
  }
  if (keyCode === key7) {
    pattern7();
  }
  if (keyCode === key8) {
    pattern8();
  }
  if (keyCode === key9) {
    pattern9();
  }
  if (keyCode === key0) {
    pattern10();
  }
  if (keyCode === dash) {
    pattern11();
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
    // mid = {
    //   x: mouseX,
    //   y: mouseY,
    // };
  }
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
