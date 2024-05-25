import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import model from './demo/sphere';
import sprite from './demo/sprite';
import cube from './demo/cube';
import plane from './demo/plane';
import points from './demo/points';
import PM from './demo/PM';
import birds from './demo/birds-1';
import cylinder from './demo/Cylinder';
import ground from './demo/ground';

const clock = new THREE.Clock();

let camera, scene, renderer, stats, gui, settings = {};

function init() {
  // 场景
  scene = new THREE.Scene();

  // 添加物体
  // scene.add(model);
  // scene.add(sprite);
  // scene.add(cube);
  // scene.add(plane);
  // scene.add(points);
  // scene.add(PM);
  // scene.add(...birds);
  scene.add(cylinder); // 如果 cylinder 是单个对象
  scene.add(ground); // 如果 ground 是单个对象

  // 相机
  camera = new THREE.PerspectiveCamera(
    35, // 视野角度
    window.innerWidth / window.innerHeight, // 长宽比
    0.1, // 近截面（near）
    300 // 远截面（far）
  );
  camera.position.set(100, 100, 100);
  camera.lookAt(0, 0, 0);

  // 光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  // 点光源
  const spotLight = new THREE.SpotLight(0x0000FF, 50); // 颜色
  spotLight.decay = 0.3; // 衰减
  spotLight.angle = Math.PI / 5; // 聚光灯的光束角度
  spotLight.position.set(5, 15, 5); // 位置
  spotLight.penumbra = 0.3; // 半影
  spotLight.castShadow = true; // 光源的阴影投射
  const spotLightHelper = new THREE.SpotLightHelper(spotLight); // 辅助对象，用于可视化光束的位置和方向
  scene.add(spotLightHelper);
  scene.add(spotLight);

  // 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(0x87CEEB, 1);
  document.body.appendChild(renderer.domElement);

  window.onresize = onWindowResize;
  initHelper();
  initGUI(ambientLight);
}

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  birds.forEach(bird => bird.tick(delta));
  stats.update();
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function initHelper() {
  // 辅助线
  const axesHelper = new THREE.AxesHelper(50);
  scene.add(axesHelper);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', () => {
    renderer.render(scene, camera);
  });

  // 创建 stats 对象
  stats = new Stats();
  document.body.appendChild(stats.domElement);
}

function initGUI(ambientLight) {
  gui = new GUI();
  const obj = {
    x: 1,
    intensity: 1
  };

  gui.add(obj, 'x', 0, 10).name('X Position');
  gui.add(obj, 'intensity', 0, 2).name('Intensity').onChange(value => {
    ambientLight.intensity = value;
  });
}

init();
animate();
