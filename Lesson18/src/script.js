import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui'

//Debug
const gui = new dat.GUI({ width: 300 });

//Scene
const scene = new THREE.Scene();

//Textures
const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load('/particlePack_1.1/PNG (Transparent)/circle_02.png');

//Galaxy
const parameters = {}
parameters.intensity = 2;
parameters.count = 100000;
parameters.size = 0.01;
parameters.radius = 5;
parameters.branches = 3;
parameters.spin = 1;
parameters.randomness = 0.2;
parameters.power = 2;
parameters.insideColor = '#ff6030';
parameters.outsideColor = '#1b3984';

let galaxyParticles = null;
let galaxyMateriels = null;
let galaxy = null;


const generateGalaxy = () => {

    //Destroy old Galaxy
    galaxy !== null ? (
        galaxyParticles.dispose(),
        galaxyMateriels.dispose(),
        scene.remove(galaxy)
    ) : null;
    galaxyParticles = new THREE.BufferGeometry();
    const particles = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);
    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;
        const radius = Math.random() * parameters.radius;
        const brancheAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;
        const spin = radius * parameters.spin;
        const randomX = Math.pow(Math.random(), parameters.power) * (Math.random() < 0.5 ? 1 : -1);
        const randomY = Math.pow(Math.random(), parameters.power) * (Math.random() < 0.5 ? 1 : -1);
        const randomZ = Math.pow(Math.random(), parameters.power) * (Math.random() < 0.5 ? 1 : -1);

        particles[i3] = Math.cos(brancheAngle + spin) * radius + randomX;
        particles[i3 + 1] = randomY;
        particles[i3 + 2] = Math.sin(brancheAngle + spin) * radius + randomZ;

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }
    galaxyParticles.setAttribute('position', new THREE.BufferAttribute(particles, 3));
    galaxyParticles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    galaxyMateriels = new THREE.PointsMaterial();
    galaxyMateriels.size = parameters.size;
    galaxyMateriels.sizeAttenuation = true;
    galaxyMateriels.depthWrite = false;
    galaxyMateriels.vertexColors = true;

    galaxyMateriels.blending = THREE.AdditiveBlending;

    galaxy = new THREE.Points(galaxyParticles, galaxyMateriels);

    scene.add(galaxy);
}
gui.add(parameters, 'intensity').min(0).max(10).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomness').min(0).max(2).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'power').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);
generateGalaxy();
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

//light


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

    //Update Camera

    //Update Controls
    controls.update();

    //Update Renderer
    renderer.render(scene, camera);
    window.requestAnimationFrame(Animation);
};

Animation();