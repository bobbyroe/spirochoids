const ringCircumferences = [96, 105];
const wheelCircumferences = [
  84, 80, 75, 72, 63, 60, 56, 52, 48, 45, 42, 40, 32, 30, 24,
];
// patterns from the original
// SPIROGRAPH
// design guide
let options = {
  ringCircumference: 96,
  wheelCircumference: 84,
  fraction: 0.6, // 'fraction' corresponds to the 'hole' on the wheel, between 0.78 - 0.15
  rotation: 0,
  saturation: 100,
  lightness: 50
};

const patterns = [
  function pattern0() {
    const graphs = [];
    const numSteps = 30;
    let n = 0;
    options.fraction = 0.69;
    options.hue = 340;
    options.scaleFactor = 7;
    options.saturation = 0;
    while (n < numSteps) {
      options.fraction -= 0.025;
      options.rotation += 2;
      options.hue += 2.5;
      options.saturation += 7;
      options.index = n;
      graphs.push(Object.assign({}, options));
      n += 1;
    }
    return graphs;
  },

  function pattern1() {
    const graphs = [];
    let numSteps = 12;
    const hues = [0, 200];
    const rotations = [0, 3];
    const len = 2; // hues.length;
    options.hue = 240;
    options.saturation = 100;
    options.lightness = 50;
    let index = 0;
    for (let i = 0; i < len; i += 1) {
      options.fraction = 0.85;
      options.rotation = rotations[i];
      for (let j = 0; j < numSteps; j += 1) {
        options.fraction -= 0.03;
        options.rotation += 2.5;
        options.hue -= 3; // = hues[i];
        options.lightness += 1.5;
        options.saturation -= 1;
        options.index = index;
        graphs.push(Object.assign({}, options));
        index += 1;
      }
    }
    return graphs;
  },

  function pattern2() {
    const graphs = [];
    options.ringCircumference = 105;
    options.wheelCircumference = 56;
    options.fraction = 1.01;
    options.hue = 190;
    options.scaleFactor = 4.5;
    const numSteps = 8;
    for (let i = 0; i < numSteps; i += 1) {
      options.fraction -= 0.07;
      options.rotation += 2.5;
      options.index = i;
      graphs.push(Object.assign({}, options));
    }
    return graphs;
  },

  function pattern3() {
    const graphs = [];
    options.ringCircumference = 105;
    options.wheelCircumference = 63;
    options.fraction = 0.85;
    options.hue = 190;
    options.rotation = 340;
    options.scaleFactor = 5;
    options.saturation = 100;
    const numSteps = 12;
    for (let i = 0; i < numSteps; i += 1) {
      options.rotation += 2;
      options.hue = i <= 3 ? 0 : i >= 8 ? 140 : 195;
      options.fraction -= 0.02;
      options.index = i;
      graphs.push(Object.assign({}, options));
    }
    return graphs;
  },

  function pattern4() {
    const graphs = [];
    options.ringCircumference = 105;
    options.wheelCircumference = 45;
    options.fraction = 1;
    options.rotation = 12;
    options.scaleFactor = 4.5;
    options.saturation = 0;
    const numSteps = 6;
    for (let i = 0; i < numSteps; i += 1) {
      options.fraction -= 0.1;
      options.hue = i <= 2 ? 190 : 140;
      options.index = i;
      options.saturation = 16 * i;
      graphs.push(Object.assign({}, options));
    }
    return graphs;
  },

  function pattern5() {
    const graphs = [];
    options.ringCircumference = 105;
    options.wheelCircumference = 84;
    options.fraction = 0.8;
    options.rotation = 340;
    const numSteps = 22;
    let satMult = 100 / numSteps;
    options.hue =20;
    let n = 0;
    while (n < numSteps) {
      options.fraction -= 0.02;
      options.rotation += 2;
      options.hue -= 2;
      options.index = n;
      options.saturation = n * satMult;
      graphs.push(Object.assign({}, options));
      n += 1;
    }
    return graphs;
  },

  function pattern6() {
    const graphs = [];
    options.ringCircumference = 105;
    options.fraction = 0.65;
    options.rotation = 323;
    const wheelCircs = [30, 45, 60, 75];
    const hues = [195, 15, 140, 15];
    options.hue = 0;
    options.scaleFactor = 5;
    options.saturation = 0;
    const len = wheelCircs.length;
    let index = 0;
    for (let i = 0; i < len; i += 1) {
      for (let j = 0; j < 6; j += 1) {
        options.wheelCircumference = wheelCircs[i];
        options.fraction -= 0.04;
        options.rotation += 4.5;
        options.hue += 3;
        options.saturation += 8;
        options.index = index;
        graphs.push(Object.assign({}, options));
        index += 1;
      }
    }
    return graphs;
  },

  function pattern7() {
    const graphs = [];
    options.ringCircumference = 96;
    options.wheelCircumference = 48;
    options.fraction = 0.9;
    options.rotation = 90;
    options.scaleFactor = 4.5;
    const numSteps = 13;
    const hues = [15, 195, 15, 195];
    const len = hues.length;
    let index = 0;
    for (let i = 0; i < len; i += 1) {
      for (let j = 0; j < numSteps; j += 1) {
        options.rotation += 3.5;
        options.hue = hues[i];
        options.index = index;
        graphs.push(Object.assign({}, options));
        index += 1;
      }
    }
    return graphs;
  },

  function pattern8() {
    const graphs = [];
    options.ringCircumference = 96;
    options.wheelCircumference = 80;
    options.fraction = 0.85;
    options.rotation = 323;
    const hues = [195, 350, 195, 350];
    const len = hues.length;
    let index = 0;
    for (let i = 0; i < len; i += 1) {
      for (let j = 0; j < 7; j += 1) {
        options.rotation += i <= 1 ? 4 : 3;
        options.fraction = i <= 1 ? 0.85 : 0.45;
        options.hue = hues[i];
        options.index = index;
        graphs.push(Object.assign({}, options));
        index += 1;
      }
    }
    return graphs;
  },

  function pattern9() {
    const graphs = [];
    options.ringCircumference = 96;
    options.wheelCircumference = 42;
    const hues = [305, 45];
    const counts = [3, 8];
    const wheelCircs = [42, 60];
    const fractions = [0.78, 0.84];
    const len = hues.length;
    let index = 0;
    for (let i = 0; i < len; i += 1) {
      for (let j = 0; j < counts[i]; j += 1) {
        options.rotation += 3;
        options.hue = hues[i];
        options.wheelCircumference = wheelCircs[i];
        options.fraction = fractions[i];
        options.index = index;
        graphs.push(Object.assign({}, options));
        index += 1;
      }
    }
    return graphs;
  },

  function pattern10(extend = false) {
    const graphs = [];
    options.ringCircumference = 105;
    options.wheelCircumference = 42;
    options.rotation = 13;
    options.strokeWeight = 3;
    options.scaleFactor = 5;
    const hues = [0, 15, 40, 160];
    const wheelCircs = [15, 30, 45, 60];
    const len = hues.length;
    const startIndex = extend ? 0 : 1;
    for (let i = startIndex; i < len; i += 1) {
      options.hue = hues[i];
      options.fraction = 0.78;
      options.wheelCircumference = wheelCircs[i];
      for (let j = 0; j < 6; j += 1) {
        options.fraction -= 0.05;
        options.rotation += 2;
        options.index = i * j;
        graphs.push(Object.assign({}, options));
      }
    }
    return graphs;
  },
  function pattern11() {
    const graphs = [];
    options.ringCircumference = 105;
    options.wheelCircumference = 80;
    const fractions = [0.87, 0.72, 0.57, 0.42, 0.17];
    const hues = [15, 195, 15, 195, 140, 140];
    options.hue = hues[0];
    options.fraction = 0.92;
    options.hue = 190;
    options.scaleFactor = 4.75;
    const len = fractions.length;
    for (let i = 0; i < len; i += 1) {
      options.fraction = fractions[i];
      options.hue += 40; // hues[i];
      options.index = i;
      graphs.push(Object.assign({}, options));
    }
    return graphs;
  },
  function randoPattern0() {
    const graphs = [];
    let numSteps = 12;
    const hues = [
      Math.floor(Math.random() * 360),
      Math.floor(Math.random() * 360),
    ];
    const rotations = [0, 3];
    function getWheelCirc() {
      const wheelIndex = Math.floor(Math.random() * wheelCircumferences.length);
      return wheelCircumferences[wheelIndex];
    }
    const wheelCircs = [
      getWheelCirc(),
      getWheelCirc(),
      getWheelCirc(),
      getWheelCirc(),
    ];
    function getRingCirc() {
      const ringIndex = Math.floor(Math.random() * ringCircumferences.length);
      return ringCircumferences[ringIndex];
    }
    const ringCircs = [
      getRingCirc(),
      getRingCirc(),
    ];
    options.ringCircumference = ringCircs[Math.floor(Math.random() * ringCircs.length)];
    const len = hues.length;
    for (let i = 0; i < len; i += 1) {
      options.fraction = 0.85;
      options.rotation = rotations[i];
      for (let j = 0; j < numSteps; j += 1) {
        options.wheelCircumference = wheelCircs[Math.floor(j / wheelCircs.length)];
        options.fraction -= 0.03;
        options.rotation += 2.5;
        options.hue = hues[i];
        options.index = i * j;
        graphs.push(Object.assign({}, options));
      }
    }
    return graphs;
  },
  function randoPattern1() {
    const graphs = [];
    let numSteps = 12;
    const hues = [
      Math.floor(Math.random() * 360),
      Math.floor(Math.random() * 360),
    ];
    const rotations = [0, 3];
    const ringIndex = Math.floor(Math.random() * ringCircumferences.length);
    const wheelIndex = Math.floor(Math.random() * wheelCircumferences.length);
    options.ringCircumference = ringCircumferences[ringIndex];
    options.wheelCircumference = wheelCircumferences[wheelIndex];
    const len = hues.length;
    for (let i = 0; i < len; i += 1) {
      options.fraction = 0.85;
      options.rotation = rotations[i];
      for (let j = 0; j < numSteps; j += 1) {
        options.fraction -= 0.03;
        options.rotation += 2.5;
        options.hue = hues[i];
        options.index = i * j;
        graphs.push(Object.assign({}, options));
      }
    }
    return graphs;
  },
];

export default patterns;
