let paused = false; // hide spiro-cursor
let mid = { x: 0, y: 0 };
let paper;
let guidePaper;
let footer;
let guideScribble;
let bgColor = "#202020";
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
  guidePaper.clear();
  const scaleFactor = 5;
  let {
    ringCircumference,
    wheelCircumference,
    fraction,
    rotation,
    hue,
    saturation, // sendom changes
    brightness, // seldom changes
    strokeWeight, // sendom changes
    useScribble, // sendom changes
    useSolidColors, // doesn't change?
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

  if (useSolidColors) {
    guidePaper.fill(0, 0, 100);
    guidePaper.noStroke();
    guidePaper.beginShape();
    guidePaper.fill(hue, saturation, brightness, 0.33);
  }
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
    if (useSolidColors) {
      guidePaper.vertex(pen.x, pen.y);
    } else {
      guidePaper.stroke(hue, saturation, brightness, alpha);
      guideScribble.scribbleLine(prevPen.x, prevPen.y, pen.x, pen.y);
    }
    prevPen = {
      x: pen.x,
      y: pen.y,
    };
  }
  if (useSolidColors) {
    guidePaper.endShape(CLOSE);
  }
  guidePaper.pop();
}

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
  fraction: 0.7, // 'fraction' corresponds to the 'hole' on the wheel, between 0.78 - 0.15
  rotation: 0,
  hue: 0,
  saturation: 100,
  brightness: 100,
  strokeWeight: 0.5,
  useScribble: false,
  useSolidColors: true,
};
/*
 *
 * SETUP
 *
 */
function setup() {
  const padding = 150;
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
  footer = document.querySelector("footer");
  // "2nd canvas"
  paper = createGraphics(windowWidth, windowHeight);
  paper.blendMode(MULTIPLY); // https://p5js.org/reference/#/p5/blendMode
  // "3rd" canvas"
  guidePaper = createGraphics(windowWidth, windowHeight);

  // scribble lib
  guideScribble = new Scribble(guidePaper);
  guideScribble.bowing = 0;
  guideScribble.maxOffset = 2;
  guideScribble.roughness = 0;

  guidePaper.colorMode(HSB);
  guidePaper.noFill();
  guidePaper.stroke(0, 0, 100);
  guidePaper.strokeWeight(0.5);

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
  const zSlider = document.querySelector("#craziness");
  const zOutput = document.querySelector("#craziness-output");
  zSlider.addEventListener("input", (evt) => {
    const { target } = evt;
    const { value } = target;
    zOutput.textContent = value;
  });

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
  });
  // drawSpirograph(options);
}

/*
 *
 * DRAW
 *
 */
let rotationMult = 1.0;
function draw() {
  background(bgColor);
  rotationMult = 1.0 * ~~paused;
  currentGraphs.forEach((g) => {
    g.rotation += (1 - g.fraction) * rotationMult;
    drawSpirograph(g);
    image(guidePaper, 0, 0);
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
function randomizeMe() {
  options = {
    ringCircumference: random(ringCircumferences),
    wheelCircumference: random(wheelCircumferences),
    fraction: random(0.15, 0.78),
    rotation: random(360),
    hue: random(360),
    saturation: random(100),
    brightness: random(100),
    strokeWeight: 0.5,
    useScribble: false,
    useSolidColors: true,
  };
  drawSpirograph(options);
  // also update controls
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
    useSolidColors: true,
  };
  mid = {
    x: cnv.width * 0.5,
    y: cnv.height * 0.5,
  };
  paused = false;
}

function keyPressed() {
  const S = 83;
  const SPACE = 32;
  const tilde = 192;
  const R = 82;
  //
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
  //
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
  if (keyCode === slash) {
    // show/hide spiro-cursor
    paused = !paused;
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
    patterns[6]();
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
  
}

function mouseDragged(evt) {
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
//
//
// each iteration rotates separately
// play with line thickness / line quality
