import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import CANNON from 'cannon'
import CannonDebugerRenderer from 'cannon-es-debugger'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}

debugObject.createSphere = () => {
    createSphere(Math.random() * 0.5, {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3
    });
}
debugObject.createBox = () => {
    createBox(Math.random() * 0.5, {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3
    })
}

debugObject.reset = () => {
    for (const object of objectsToUpdate) {
        world.remove(object.body);
        scene.remove(object.mesh);
    }
}

gui.add(debugObject, 'reset');
gui.add(debugObject, 'createBox');
gui.add(debugObject, 'createSphere');
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(5, 7, -4)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 0.001
directionalLight.shadow.camera.far = 20
directionalLight.shadow.camera.top = 20
directionalLight.shadow.camera.right = 20
directionalLight.shadow.camera.bottom = -20
directionalLight.shadow.camera.left = -20
directionalLight.shadow.radius = 5
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(directionalLight)

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
scene.add(directionalLightCameraHelper)

/**
 * PHysics
 */
//World
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(0, -9.82, 0);

//Material
const defaultMaterial = new CANNON.Material('concrete');
const boxMaterial = new CANNON.Material('wood');
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial, {
        friction: 0.1,
        restitution: 0.9
    }
)
const boxFloorContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    boxMaterial, {
        friction: 1,
        restitution: 0
    }
)
world.addContactMaterial(boxFloorContactMaterial);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

//Floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.mass = 0;
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0),
    Math.PI * 0.5);
world.addBody(floorBody);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4;
material.metalness = 0.3;
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
/**
 * Objects
 */
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    material
)
plane.rotation.x = -Math.PI * 0.5
plane.receiveShadow = true
scene.add(plane)

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
camera.position.x = 5
camera.position.y = 5
camera.position.z = 5
const cameraGui = gui.addFolder('Camera');
cameraGui.add(camera.position, 'x').min(-5).max(5).step(0.001)
cameraGui.add(camera.position, 'y').min(-5).max(5).step(0.001)
cameraGui.add(camera.position, 'z').min(-5).max(5).step(0.001)

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

renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Utils
 */
const objectsToUpdate = [];

const createSphere = (radius, position) => {
    //ThreeJS Mesh
    const sphere = new THREE.Mesh(
        sphereGeometry,
        material
    )
    sphere.scale.set(radius, radius, radius);
    sphere.position.copy(position);
    sphere.castShadow = true
    scene.add(sphere);



    //CannonJS Body
    const sheperShape = new CANNON.Sphere(radius);
    const sphereBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: sheperShape,
        material: defaultMaterial
    })
    sphereBody.position.copy(position)
    world.addBody(sphereBody);

    //save in objects to update
    objectsToUpdate.push({
        mesh: sphere,
        body: sphereBody
    })
}

const createBox = (boxScale, position) => {
    const box = new THREE.Mesh(
        boxGeometry,
        material
    )
    box.scale.set(boxScale, boxScale, boxScale);
    box.position.copy(position);
    box.castShadow = true
    scene.add(box);

    const boxShape = new CANNON.Box(new CANNON.Vec3(boxScale * 0.5, boxScale * 0.5, boxScale * 0.5));
    const boxBody = new CANNON.Body({
        mass: 0.5,
        position: new CANNON.Vec3(0, 3, 0),
        shape: boxShape,
        material: boxMaterial
    })
    boxBody.position.copy(position);
    world.addBody(boxBody);
    //save in objects to update
    objectsToUpdate.push({
        mesh: box,
        body: boxBody
    });
    // console.log(objectsToUpdate);
}


/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0;
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;
    // Update controls
    controls.update()

    //Update physics world
    // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)
    world.step(1 / 60, deltaTime, 3);
    for (const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position);
        object.mesh.quaternion.copy(object.body.quaternion);
    }

    //Update the sphere
    // sphere.position.x = sphereBody.position.x;
    // sphere.position.z = sphereBody.position.z;
    // sphere.position.y = sphereBody.position.y;
    // sphere.position.copy(sphereBody.position);
    // console.log(("speher pos " + sphere.position));
    // console.log("spherebody pos " + sphereBody.position);
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
CannonDebugerRenderer(scene, world.bodies)
tick()