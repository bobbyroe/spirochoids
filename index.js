import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import createSpiro from "./createSpiro.js";
import patterns from "./patterns.js";
import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/RenderPass.js";
import { HalftonePass } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/HalftonePass.js";

console.log(`THREE REVISION: %c${THREE.REVISION}`, "color: #FFFF00");

const w = window.innerWidth;
const h = window.innerHeight;
const padding = 250;
const size = Math.min(w, h) - padding;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, size / size, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ alpha: false });
let bgColor = 0xF0F0F0;
let patternIndex = 1;
let masterHue = 0;
renderer.setClearColor(bgColor);
renderer.setSize(size, size);
renderer.domElement.id = "three-canvas";
document.body.appendChild(renderer.domElement);

// composer
const renderScene = new RenderPass(scene, camera);
const htParams = {
  shape: 1,
  radius: 3,
  blending: 0.25,
  scatter: 1.0,
  blendingMode: 1, // Multiply = 2
};
const halftonePass = new HalftonePass(w, h, htParams);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(halftonePass);

// canvas texture
function getTexture({ path, hue }) {
  const size = 1024;
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.canvas.width = size;
  ctx.canvas.height = size;
  ctx.fillStyle = `hsl(${hue}, 100%, 50%, 1)`;
  ctx.fill(path);
  const texture = new THREE.CanvasTexture(ctx.canvas);
  return texture;
}

function getPlane({ map, index, rotation }) {
  const size = 6.5;
  const geometry = new THREE.PlaneGeometry(size, size, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    map,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.2,
    // blending: THREE.AdditiveBlending
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = 0.01 * index;
  mesh.rotation.z = (rotation * Math.PI) / 180;
  const rate = 0.1 * index;
  function update(t) {
    mesh.rotation.z = Math.cos(t + rate) * 0.5;
  }
  return { mesh, update };
}

function getTexturedPlane(options) {
  const { hue, index, rotation } = options;
  const spiro = createSpiro(options);
  const tex = getTexture({ path: spiro, hue });
  const plane = getPlane({ map: tex, index, rotation });
  return plane;
}

const sceneGroup = new THREE.Object3D();

const planes = [];
function setupSpiros({index = patternIndex, hue = masterHue}) {
  sceneGroup.remove.apply(sceneGroup, sceneGroup.children);
  const recipes = patterns[index]();
  let plane;
  recipes.forEach((r) => {
    r.hue += hue;
    plane = getTexturedPlane(r);
    planes.push(plane);
    sceneGroup.add(plane.mesh);
  });
  scene.add(sceneGroup);
}

const timeMult = 0.001;
function animate(t) {
  requestAnimationFrame(animate);
  planes.forEach((p) => p.update(t * timeMult));
  // halftonePass.uniforms.rotateR.value = t * 0.00001;
  // halftonePass.uniforms.rotateG.value = t * -0.00000;
  // halftonePass.uniforms.rotateB.value = Math.sin(t * 0.0001) * 0.1;
  composer.render(scene, camera);
}
setupSpiros({index: patternIndex});
setupControls();
animate(0);

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);

function setupControls() {
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
    console.log("resizeWindow();");
  });
  const pSlider = document.querySelector("#pattern");
  const pOutput = document.querySelector("#pattern-output");
  pSlider.addEventListener("input", (evt) => {
    const { target } = evt;
    const { value } = target;
    pOutput.textContent = value;
    patternIndex = +value;
    setupSpiros({index: patternIndex});
  });
  const hSlider = document.querySelector("#hue");
  const hOutput = document.querySelector("#hue-output");
  hSlider.addEventListener("input", (evt) => {
    const { target } = evt;
    const { value } = target;
    hOutput.textContent = value;
    masterHue = +value;
    setupSpiros({hue: masterHue});
  });

  const footer = document.querySelector("footer");
  footer.addEventListener("change", (evt) => {
    const { name, id } = evt.target;
    if (name === "light-dark") {
      if (id === "light") {
        bgColor = "#F0F0F0";
      }
      if (id === "dark") {
        bgColor = "#202020";
      }
      renderer.setClearColor(bgColor);
    }
  });

  footer.addEventListener("click", (evt) => {
    const { target } = evt;
    const { id } = target;
    if (id === "random") {
      console.log(halftonePass, "randomize, canvas size, *craziness* and dark / light");
    }
    if (id === "print") {
      console.log("PRINT");
    }
  });
}
