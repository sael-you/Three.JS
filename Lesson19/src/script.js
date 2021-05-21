import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui'

//GUI
const Gui = new dat.GUI();
//Scene
const scene = new THREE.Scene();

//Cursor
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1;
    mouse.y = -(event.clientY / sizes.height * 2 - 1);
});

window.addEventListener('click', () => {
    if (currentIntersect) {
        switch (currentIntersect.object) {
            case object1:
                console.log("click in object1");
                break;
            case object2:
                console.log("click in object2");
                break;
            case object3:
                console.log("click in object3");
                break;
        }
    }
});

//Objects
const object1 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
);

const object3 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
);
object3.position.x = 2;

scene.add(object1, object2, object3);


//Canvas
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

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
const canvas = document.querySelector('.webgl');

//Camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.001, 100);

camera.position.z = 3;
scene.add(camera);

//Raycaster
const raycaster = new THREE.Raycaster();
// const rayOrigin = new Vector3(-3, 0, 0);
// const rayDirection = new Vector3(10, 0, 0);
// rayDirection.normalize();
// raycaster.set(rayOrigin, rayDirection);

// const intersect = raycaster.intersectObject(object2);
// console.log(intersect);
// const intersects = raycaster.intersectObjects([object1, object2, object3]);
// console.log(intersects);



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
let currentIntersect = null;

//Animation
const Animation = () => {
    const deltaTime = clock.getElapsedTime();

    //Update Objects
    object1.position.y = Math.sin(deltaTime * 1.5 * 0.8);
    object2.position.y = Math.sin(deltaTime * 1.5) * 1.4;
    object3.position.y = Math.sin(deltaTime * 1.5) * 0.8;

    //Update Raycast

    raycaster.setFromCamera(mouse, camera);
    const objectsToTest = [object1, object2, object3];
    const intersects = raycaster.intersectObjects(objectsToTest);
    for (const object of objectsToTest) {
        object.material.color.set('#ff0000');
    }
    for (const intersect of intersects) {
        intersect.object.material.color.set('#00ff00')
    }

    // intersects.length ? (
    //     currentIntersect === null ? console.log("i'm here") : null,
    //     currentIntersect = intersects[0]) : (
    //     currentIntersect ? console.log("i'm leaving") : null,
    //     currentIntersect = null);
    if (intersects.length) {
        if (!currentIntersect) {

        }
        currentIntersect = intersects[0];
    } else {
        if (currentIntersect) {

        }
        currentIntersect = null;
    }

    //update camera

    //Update Controls
    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(Animation);
};

Animation();