import * as THREE from "three";
function getRandomPosition(range = 10) {
  return {
    x: (Math.random() - 0.5) * 2 * range,
    y: (Math.random() - 0.5) * 2 * range,
    z: (Math.random() - 0.5) * 2 * range,
  };
}

function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  const fov = 75;
  const aspect = window.innerWidth / 2 / window.innerHeight;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 5;

  const scene = new THREE.Scene();

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });

  const material2 = new THREE.MeshBasicMaterial({ color: 0x44aa99 });

  const material3 = new THREE.MeshBasicMaterial({ color: 0x44aa55 });

  const cube = new THREE.Mesh(geometry, material);
  const { x, y, z } = getRandomPosition(3);
  cube.position.set(x, y, z);
  const cube2 = new THREE.Mesh(geometry, material2);
  cube2.position.x = 0;
  const cube3 = new THREE.Mesh(geometry, material3);
  cube3.position.x = 1.5;
  scene.add(cube);
  scene.add(cube2);
  scene.add(cube3);

  renderer.setSize(window.innerWidth / 2, window.innerHeight);
  function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    cube2.rotation.x += 0.02;
    cube2.rotation.y += 0.02;

    cube3.rotation.x += 0.015;
    cube3.rotation.y += 0.015;

    renderer.render(scene, camera);
  }
  animate();
}

main();
