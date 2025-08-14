import * as THREE from "three";

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  console.log(color);
  return color;
}
function main() {
  const canvas = document.querySelector("#canvas");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / 2 / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  renderer.setSize(window.innerWidth / 2, window.innerHeight);

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
    new THREE.MeshPhongMaterial({ color: getRandomColor() })
  );
  const cube2 = new THREE.Mesh(
    geometry,
    new THREE.MeshPhongMaterial({ color: 0x44aa99 })
  );
  const cube3 = new THREE.Mesh(
    geometry,
    new THREE.MeshPhongMaterial({ color: 0x44aa55 })
  );

  function getRandomPosition(range = 10) {
    return {
      x: (Math.random() - 0.5) * 2 * range,
      y: (Math.random() - 0.5) * 2 * range,
      z: (Math.random() - 0.5) * 2 * range,
    };
  }
  const { x: x1, y: y1, z: z1 } = getRandomPosition(3);
  cube1.position.set(x1, y1, z1);
  const { x: x2, y: y2, z: z2 } = getRandomPosition(3);
  cube2.position.set(x2, y2, z2);
  const { x: x3, y: y3, z: z3 } = getRandomPosition(3);
  cube3.position.set(x3, y3, z3);

  scene.add(cube1, cube2, cube3);

  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

  function createMesh(geometry, material, uuid) {
    // Create a new mesh with the given geometry and a cloned material
    const mesh = new THREE.Mesh(geometry, material.clone());

    // Set a random position
    const { x, y, z } = getRandomPosition(3);
    mesh.position.set(x, y, z);

    mesh.name = uuid;
    return mesh;
  }
  const cubes = new THREE.Group();
  const material1 = new THREE.MeshPhongMaterial({ color: getRandomColor() });
  cubes.add(createMesh(cubeGeometry, material1, x1, y1, z1, "cube A"));
  const material2 = new THREE.MeshPhongMaterial({ color: getRandomColor() });
  cubes.add(createMesh(cubeGeometry, material2, x1, y1, z1, "cube B"));
  scene.add(cubes);

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

  // ===================== END SCENE SETUP ====================

  const raycaster = new THREE.Raycaster();

  document.addEventListener("mousedown", onMouseDown);

  function onMouseDown(event) {
    const coords = new THREE.Vector2(
      (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      -((event.clientY / renderer.domElement.clientHeight) * 2 - 1)
    );
    raycaster.setFromCamera(coords, camera);

    const intersections = raycaster.intersectObjects(scene.children, true);
    if (intersections.length > 0) {
      const foundObj = intersections[0].object;
      const colorHex = intersections[0].object.material.color.getHex();
      const color = `#${colorHex.toString(16).padStart(6, "0")}`;
      const uuid = intersections[0].object.uuid;
      console.log(`Hex color: #${colorHex.toString(16).padStart(6, "0")}`);
      console.log("the uuid of the clicked cube is:", uuid);
      // Sending the data to the React layer
      window.postMessage({ type: "cubeColor", color }, "*");
      window.postMessage({ type: "uuid", uuid }, "*");

      // Testing to see the attributes of the cubes

      // if (intersections[0].object.name) {
      //   const uuid = intersections[0].object.uuid;
      //   console.log("uuid", uuid);
      // }
    }
  }
}

main();
