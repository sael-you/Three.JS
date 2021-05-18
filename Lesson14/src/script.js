import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color(0xffffff);
ambientLight.intensity = 0.5;
scene.add(ambientLight)
const ambientLightGUI = gui.addFolder("Ambient Light");
ambientLightGUI.add(ambientLight, 'intensity').min(0).max(1).step(0.01);

const directionalLight = new THREE.DirectionalLight();
directionalLight.color = new THREE.Color(0x00fffc)
directionalLight.intensity = 0.3;
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)
const directionalLightGUI = gui.addFolder('Directional Light');
directionalLightGUI.add(directionalLight, 'intensity').min(0).max(1).step(0.01);

const hemisphereLight = new THREE.HemisphereLight();
hemisphereLight.color = new THREE.Color(0xff0000)
hemisphereLight.groundColor = new THREE.Color(0x0000ff)
hemisphereLight.intensity = 0.3
scene.add(hemisphereLight)
const hemisphereLightGUI = gui.addFolder('Hemisphere Light');
hemisphereLightGUI.add(hemisphereLight, 'intensity').min(0).max(1).step(0.01);

const pointLight = new THREE.PointLight()
pointLight.color = new THREE.Color(0xff9000)
pointLight.intensity = 0.5;
pointLight.position.set(1, -0.5, 1)
pointLight.distance = 1
pointLight.decay = 2
scene.add(pointLight)
const pointlightGUI = gui.addFolder('Point Light');
pointlightGUI.add(pointLight, 'intensity').min(0).max(1).step(0.01);
pointlightGUI.add(pointLight, 'distance').min(1).max(10).step(0.01).name('Point Light Distance');
pointlightGUI.add(pointLight, 'decay').min(1).max(10).step(0.01).name('Point Light Decay');

const rectAreaLight = new THREE.RectAreaLight();
rectAreaLight.color = new THREE.Color(0x4e00ff)
rectAreaLight.intensity = 2;
rectAreaLight.width = 1
rectAreaLight.height = 1
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight)
const rectAreaLightGUI = gui.addFolder('RectArea Light');
rectAreaLightGUI.add(rectAreaLight, 'intensity').min(0).max(10).step(0.01);
rectAreaLightGUI.add(rectAreaLight, 'width').min(1).max(10).step(0.01);
rectAreaLightGUI.add(rectAreaLight, 'height').min(1).max(10).step(0.01);

const spotLight = new THREE.SpotLight();
spotLight.color = new THREE.Color(0x78ff00)
spotLight.intensity = 0.5;
spotLight.position.set(0, 2, 3)
spotLight.distance = 10
spotLight.angle = Math.PI * 0.1
spotLight.penumbra = 0.25
spotLight.decay = 1
scene.add(spotLight)
const spotLightGUI = gui.addFolder('Sport Light')
spotLightGUI.add(spotLight, 'intensity').min(0).max(10).step(0.01);
spotLightGUI.add(spotLight, 'distance').min(1).max(10).step(0.01);
spotLightGUI.add(spotLight, 'angle').min(0).max(10).step(0.01);
spotLightGUI.add(spotLight, 'penumbra').min(0).max(1.9).step(0.01);
spotLightGUI.add(spotLight, 'decay').min(1).max(10).step(0.01);
/**
 * LightHelpers 
 */
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)
window.requestAnimationFrame(() => {
    spotLightHelper.update();
});

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)
window.requestAnimationFrame(() => {
    rectAreaLightHelper.position.copy(rectAreaLight.position)
    rectAreaLightHelper.quaternion.copy(rectAreaLight.quaternion)
});

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = -1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5
spotLight.target.position.copy(torus.position)
scene.add(spotLight.target)
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()