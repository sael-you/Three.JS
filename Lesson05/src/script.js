import './style.css'
import * as THREE from 'three'
import { Scene } from 'three';

const scene = new THREE.Scene();

//Objects
const group = new THREE.Group();

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'red' })
);
cube1.position.set(0, 0, 0);
group.add(cube1);

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'green' })
);
cube2.position.set(cube1.position.x + 2, 0, 0);
group.add(cube2);

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'blue' })
);
cube3.position.set(cube1.position.x - 2, 0, 0);
group.add(cube3);

group.scale.set(0.5, 0.5, 0.5);
scene.add(group);

//Axes helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

//Size
const sizes = {
    width: 800,
    height: 600
};

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
camera.lookAt(group.position);
scene.add(camera);

//Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);