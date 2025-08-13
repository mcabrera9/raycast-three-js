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
  scene.background = new THREE.Color("white");

  const cameraPole = new THREE.Object3D();
  scene.add(cameraPole);
  cameraPole.add(camera);

  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    camera.add(light);
  }

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
  const material2 = new THREE.MeshPhongMaterial({ color: 0x44aa99 });
  const material3 = new THREE.MeshPhongMaterial({ color: 0x44aa55 });

  const cube = new THREE.Mesh(geometry, material);
  const { x, y, z } = getRandomPosition(3);
  cube.position.set(x, y, z);

  const cube2 = new THREE.Mesh(geometry, material2);
  cube2.position.x = 0;

  const cube3 = new THREE.Mesh(geometry, material3);
  cube3.position.x = 1.5;

  scene.add(cube, cube2, cube3);

  const pickableObjects = [cube, cube2, cube3];

  renderer.setSize(window.innerWidth / 2, window.innerHeight);

  class PickHelper {
    constructor() {
      this.raycaster = new THREE.Raycaster();
      this.pickedObject = null;
      this.pickedObjectSavedColor = 0;
    }
    pick(normalizedPosition, objects, camera, time) {
      if (this.pickedObject) {
        this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
        this.pickedObject = undefined;
      }
      this.raycaster.setFromCamera(normalizedPosition, camera);
      const intersectedObjects = this.raycaster.intersectObjects(objects);
      if (intersectedObjects.length) {
        this.pickedObject = intersectedObjects[0].object;
        this.pickedObjectSavedColor =
          this.pickedObject.material.emissive.getHex();
        this.pickedObject.material.emissive.setHex(
          (time * 8) % 2 > 1 ? 0xffff00 : 0xff0000
        );
      }
    }
  }

  const pickPosition = { x: 0, y: 0 };
  const pickHelper = new PickHelper();
  clearPickPosition();

  function render(time) {
    time *= 0.001; // convert to seconds

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // rotate cubes
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube2.rotation.x += 0.02;
    cube2.rotation.y += 0.02;
    cube3.rotation.x += 0.015;
    cube3.rotation.y += 0.015;

    // rotate camera pole
    cameraPole.rotation.y = time * 0.1;

    // raycast picking
    pickHelper.pick(pickPosition, pickableObjects, camera, time);

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * canvas.width) / rect.width,
      y: ((event.clientY - rect.top) * canvas.height) / rect.height,
    };
  }

  function setPickPosition(event) {
    const pos = getCanvasRelativePosition(event);
    pickPosition.x = (pos.x / canvas.width) * 2 - 1;
    pickPosition.y = (pos.y / canvas.height) * -2 + 1; // flip Y
  }

  function clearPickPosition() {
    pickPosition.x = -100000;
    pickPosition.y = -100000;
  }

  window.addEventListener("mousemove", setPickPosition);
  window.addEventListener("mouseout", clearPickPosition);
  window.addEventListener("mouseleave", clearPickPosition);

  window.addEventListener(
    "touchstart",
    (event) => {
      event.preventDefault();
      setPickPosition(event.touches[0]);
    },
    { passive: false }
  );

  window.addEventListener("touchmove", (event) => {
    setPickPosition(event.touches[0]);
  });

  window.addEventListener("touchend", clearPickPosition);

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
}

main();
