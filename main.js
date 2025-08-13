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

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / 2 / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("white");

  const cameraPole = new THREE.Object3D();
  scene.add(cameraPole);
  cameraPole.add(camera);

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(-1, 2, 4);
  camera.add(light);

  // Create cubes
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const cube1 = new THREE.Mesh(
    geometry,
    new THREE.MeshPhongMaterial({ color: 0x44aa88 })
  );
  const cube2 = new THREE.Mesh(
    geometry,
    new THREE.MeshPhongMaterial({ color: 0x44aa99 })
  );
  const cube3 = new THREE.Mesh(
    geometry,
    new THREE.MeshPhongMaterial({ color: 0x44aa55 })
  );

  cube1.position.x = -1.5;
  cube2.position.x = 0;
  cube3.position.x = 1.5;

  scene.add(cube1, cube2, cube3);

  const pickableObjects = [cube1, cube2, cube3];

  renderer.setSize(window.innerWidth / 2, window.innerHeight);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Handle clicks on cubes
  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(pickableObjects);
    if (intersects.length > 0) {
      const colorHex = intersects[0].object.material.color.getHexString();
      console.log("Clicked cube color:", `#${colorHex}`);
      // Optional: dispatch event to React if needed
      window.dispatchEvent(
        new CustomEvent("cubeClick", { detail: `#${colorHex}` })
      );
    }
  });

  function animate(time) {
    time *= 0.001;

    // Rotates cubes
    cube1.rotation.x += 0.01;
    cube1.rotation.y += 0.01;
    cube2.rotation.x += 0.02;
    cube2.rotation.y += 0.02;
    cube3.rotation.x += 0.015;
    cube3.rotation.y += 0.015;

    // Rotates camera pole
    cameraPole.rotation.y = time * 0.1;

    if (resizeRendererToDisplaySize(renderer)) {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) renderer.setSize(width, height, false);
    return needResize;
  }
}

main();
