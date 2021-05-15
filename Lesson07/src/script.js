import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//Cursor
const cursos = {
    x: 0,
    y: 0
};

window.addEventListener('mousemove', (event) => {
    cursos.x = event.clientX / sizes.width - 0.5;
    cursos.y = event.clientY / sizes.height - 0.5;
});

//Scene
const scene = new THREE.Scene();


//Objects
const group = new THREE.Group();

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'green' })
);
cube1.position.set(0, 1, 0);
group.add(cube1);

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'red' })
);
cube2.position.set(1, 0, 0);
group.add(cube2);

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'blue' })
);
cube3.position.set(-1, 0, 0);
group.add(cube3);

// group.rotation.set(0, 0.7, 0);
scene.add(group);

//Axes
const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);


//Canvas
const sizes = {
    width: 800,
    height: 600
};
const canvas = document.querySelector('.webgl');


//Camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.001, 100);

// const aspectRation = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(-1 * aspectRation, 1 * aspectRation, 1, -1, 0.001, 100);
camera.position.z = 3;
// camera.position.y = 3;
// camera.position.x = 3;
camera.lookAt(group.position);
scene.add(camera);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.target.y = 2;
// controls.update();

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas
});
renderer.setSize(sizes.width, sizes.height);

//DeltaTime
const clock = new THREE.Clock();

//Animation
const Animation = () => {
    const deltaTime = clock.getElapsedTime();

    //update camera
    // camera.position.x = Math.sin(cursos.x * Math.PI * 2) * 5;
    // camera.position.z = Math.cos(cursos.x * Math.PI * 2) * 5;
    // camera.position.y = cursos.y * 10;
    // camera.lookAt(new THREE.Vector3());

    //Update Controls
    controls.update();

    // group.rotation.y = Math.cos(deltaTime * Math.PI * 1);
    // cube1.rotation.y = Math.sin(deltaTime * Math.PI * 4);
    // cube2.rotation.x = Math.sin(-deltaTime * Math.PI * 4);
    // cube3.rotation.x = Math.sin(deltaTime * Math.PI * 4);

    renderer.render(scene, camera);
    window.requestAnimationFrame(Animation);
};

Animation();