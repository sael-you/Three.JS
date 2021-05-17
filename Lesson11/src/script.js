import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import * as dat from 'dat.gui';
import { Mesh } from 'three';

//Debug UI
const gui = new dat.GUI({ closed: true });
const parameters = {
    color: "#ff0000",
    spin: () => {
        gsap.to(group.rotation, { y: group.rotation.y + Math.PI * 2 });
    }
};

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
    new THREE.MeshBasicMaterial({
        color: '#008000',
        wireframe: true
    })
);
cube1.position.set(0, 1, 0);
cube1.name = 'Top Cube';
group.add(cube1);
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
        color: '#ff0000',
        wireframe: true
    })
);
cube2.position.set(1, 0, 0);
cube2.name = 'Right Cube';
group.add(cube2);
const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
        color: '#0000ff',
        wireframe: true
    })
);
cube3.position.set(0, 0, 1);
cube3.name = 'Left Cube';
group.add(cube3);
scene.add(group);

//Debug group
gui
    .add(group.position, 'y')
    .min(-3)
    .max(3)
    .step(0.001)
    .name('group Y');

group.children.forEach(element => {
    gui
        .addFolder(element.name)
        .add(element.material, 'wireframe')


    gui
        .addColor(parameters, 'color')
        .onChange(() => {
            element.material.color.set(parameters.color);
        });
});

gui
    .add(parameters, 'spin')

//Axes
const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);


//Canvas
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
const canvas = document.querySelector('.webgl');
window.addEventListener('resize', () => {
    //Update Sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    //Update Camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    //Update Renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
window.addEventListener('dblclick', () => {
    const fullScreen = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fullScreen) {
        if (canvas.requestFullscreen)
            canvas.requestFullscreen();
        else if (canvas.webkitRequestFullscreen)
            canvas.webkitRequestFullscreen();
    } else {
        if (document.exitFullscreen)
            document.exitFullscreen();
        else if (document.webkitExitFullscreen)
            canvas.webkitExitFullscreen();
    }
});

//Camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.001, 100);
camera.position.z = 3;
camera.lookAt(group.position);
scene.add(camera);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//DeltaTime
const clock = new THREE.Clock();

//Animation
const Animation = () => {
    const deltaTime = clock.getElapsedTime();
    //update camera

    //Update Controls
    controls.update();

    //Updae Objects
    // group.rotation.y = Math.cos(deltaTime * Math.PI * 1);
    // cube1.rotation.y = Math.sin(deltaTime * Math.PI * 4);
    // cube2.rotation.x = Math.sin(-deltaTime * Math.PI * 4);
    // cube3.rotation.x = Math.sin(deltaTime * Math.PI * 4);

    //Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(Animation);
};

Animation();