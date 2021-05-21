import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//Scene
const scene = new THREE.Scene();

//Textures
const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load('/particlePack_1.1/PNG (Transparent)/circle_02.png');

//Particles

//Material
const particlesMaterial = new THREE.PointsMaterial();
// particlesMaterial.map = particlesTexture;
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particlesTexture;
particlesMaterial.size = 0.1;
particlesMaterial.sizeAttenuation = true;
// particlesMaterial.alphaTest = 0.001;
particlesMaterial.depthWrite = false;
particlesMaterial.vertexColors = true;


//buffer
const geometry = new THREE.BufferGeometry();
const count = 50000;
const verteces = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
    verteces[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
}

geometry.setAttribute('position', new THREE.BufferAttribute(verteces, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
const mesh = new THREE.Points(geometry, particlesMaterial);

scene.add(mesh);

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

    //update particles
    // mesh.rotation.y = deltaTime * 0.2;
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = geometry.attributes.position.array[i3];
        geometry.attributes.position.array[i3 + 1] = Math.sin(deltaTime + x);
    }
    geometry.attributes.position.needsUpdate = true;
    //Update Camera

    //Update Controls
    controls.update();

    //Update Renderer
    renderer.render(scene, camera);
    window.requestAnimationFrame(Animation);
};

Animation();