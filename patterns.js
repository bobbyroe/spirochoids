const patterns = [
  {
    numSteps: 12,
    fractionInc: -0.02,
    rotationInc: 2.0,
    hueInc: 3.0,
    needsReset: false,   
  },
  // more iterations ...
  // more hues & transitions
  function pattern1() {
    resetOptions();
    let numSteps = 8;
    const hues = [0, 200];
    const rotations = [0, 3];
    const len = hues.length;
    for (let i = 0; i < len; i += 1) {
      options.fraction = 0.85;
      options.rotation = rotations[i];
      for (let j = 0; j < numSteps; j += 1) {
        options.fraction -= 0.02;
        options.rotation += 2;
        options.hue = hues[i];
        drawSpirograph(options);
        saveToPaper();
      }
    }
  },

  function pattern2() {
    resetOptions();
    options.ringCircumference = 105;
    options.wheelCircumference = 56;
    options.fraction = 0.92;
    options.hue = 190;
    const numSteps = 4;
    for (let i = 0; i < numSteps; i += 1) {
      options.fraction -= 0.07;
      drawSpirograph(options);
      saveToPaper();
    }
  },

  function pattern3() {
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
      drawSpirograph(options);
      saveToPaper();
    }
  },

  function pattern4() {
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
      drawSpirograph(options);
      saveToPaper();
    }
  },

  function pattern5() {
    resetOptions();
    options.ringCircumference = 105;
    options.wheelCircumference = 45;
    options.fraction = 0.85;
    options.rotation = 12;
    const numSteps = 6;
    for (let i = 0; i < numSteps; i += 1) {
      options.fraction -= 0.1;
      options.hue = i <= 2 ? 190 : 140;
      drawSpirograph(options);
      saveToPaper();
    }
  },

  {
    setup: {
      ringCircumference: 105,
      wheelCircumference: 84,
      fraction: 0.8,
      rotation: 340
    },
    numSteps: 22,
    fractionInc: -0.02,
    rotationInc: 6,
    hues: [190, 140],
    needsReset: true, 
  },

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
  },

  function pattern8() {
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
        drawSpirograph(options);
        saveToPaper();
      }
    }
  },

  function pattern9() {
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
        drawSpirograph(options);
        saveToPaper();
      }
    }
  },

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
  },

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
  },
];
