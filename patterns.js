// patterns from the original
// SPIROGRAPH
// design guide
const patterns = [
  function patternFirst() {
    const numSteps = 12;
    let n = 0;
    while (n < numSteps) {
      options.fraction -= 0.02;
      options.rotation += 2;
      options.hue += 3;
      currentGraphs.push(Object.assign({}, options));
      n += 1;
    }
    options.hue = 0;
  },

  function pattern1() {
    resetOptions();
    currentGraphs = [];
    let numSteps = 8;
    const hues = [0, 200];
    const rotations = [0, 3];
    const len = hues.length;
    for (let i = 0; i < len; i += 1) {
      options.fraction = 0.85;
      options.rotation = rotations[i];
      for (let j = 0; j < numSteps; j += 1) {
        options.fraction -= 0.03;
        options.rotation += 2.5;
        options.hue = hues[i];
        currentGraphs.push(Object.assign({}, options));
      }
    }
  },

  function pattern2() {
    resetOptions();
    currentGraphs = [];
    options.ringCircumference = 105;
    options.wheelCircumference = 56;
    options.fraction = 0.92;
    options.hue = 190;
    const numSteps = 4;
    for (let i = 0; i < numSteps; i += 1) {
      options.fraction -= 0.07;
      currentGraphs.push(Object.assign({}, options));
    }
  },

  function pattern3() {
    currentGraphs = [];
    options.ringCircumference = 105;
    options.wheelCircumference = 63;
    options.fraction = 0.85;
    options.hue = 190;
    options.rotation = 340;
    const numSteps = 9;
    for (let i = 0; i < numSteps; i += 1) {
      options.rotation += 2;
      options.hue = i <= 2 ? 0 : i >= 6 ? 140 : 195;
      options.fraction -= 0.03;
      currentGraphs.push(Object.assign({}, options));
    }
  },

  function pattern4() {
    currentGraphs = [];
    resetOptions();
    options.ringCircumference = 105;
    options.wheelCircumference = 45;
    options.fraction = 0.85;
    options.rotation = 12;
    const numSteps = 6;
    for (let i = 0; i < numSteps; i += 1) {
      options.fraction -= 0.1;
      options.hue = i <= 2 ? 190 : 140;
      currentGraphs.push(Object.assign({}, options));
    }
  },

  function pattern5() {
    currentGraphs = [];
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
      currentGraphs.push(Object.assign({}, options));
      n += 1;
    }
  },

  function pattern6() {
    currentGraphs = [];
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
        currentGraphs.push(Object.assign({}, options));
      }
    }
  },

  function pattern7() {
    currentGraphs = [];
    resetOptions();
    options.ringCircumference = 96;
    options.wheelCircumference = 48;
    options.fraction = 0.9;
    options.rotation = 90;
    const numSteps = 13;
    const hues = [15, 195, 15, 195];
    const len = hues.length;
    for (let i = 0; i < len; i += 1) {
      for (let j = 0; j < numSteps; j += 1) {
        options.rotation += 3.5;
        options.hue = hues[i];
        currentGraphs.push(Object.assign({}, options));
      }
    }
  },

  function pattern8() {
    currentGraphs = [];
    resetOptions();
    options.ringCircumference = 96;
    options.wheelCircumference = 80;
    options.fraction = 0.85;
    options.rotation = 323;
    const hues = [195, 140, 195, 140];
    const len = hues.length;
    for (let i = 0; i < len; i += 1) {
      for (let j = 0; j < 6; j += 1) {
        options.rotation += i <= 1 ? 4 : 3;
        options.fraction = i <= 1 ? 0.85 : 0.4;
        options.hue = hues[i];
        currentGraphs.push(Object.assign({}, options));
      }
    }
  },

  function pattern9() {
    currentGraphs = [];
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
        currentGraphs.push(Object.assign({}, options));
      }
    }
  },

  function pattern10(extend = false) {
    currentGraphs = [];
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
        currentGraphs.push(Object.assign({}, options));
      }
    }
  },
  function pattern11 () {
    currentGraphs = [];
    resetOptions();
    options.ringCircumference = 105;
    options.wheelCircumference = 80;
    const fractions = [0.87, 0.72, 0.57, 0.42, 0.27];
    const hues = [15, 195, 15, 195, 140, 140];
    options.fraction = 0.92;
    options.hue = 190;
    const len = fractions.length;
    for (let i = 0; i < len; i += 1) {
      options.fraction = fractions[i];
      options.hue = hues[i];
      currentGraphs.push(Object.assign({}, options));
    }
  },
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
      currentGraphs.push(Object.assign({}, options));
      n += 1;
    }
    options.hue = 0;
  },
];
