import * as THREE from './node_modules/three/build/three.module.js';
const WORLD = document.getElementById('world');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 10000);
const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
const mousePos = {x: 0, y: 0};
let sky, sea, airplane;
const Colors = {
    red: 0xf25346,
	white: 0xd8d0d1,
	brown: 0x59332e,
	pink: 0xF5986E,
	brownDark: 0x23190f,
	blue: 0x68c3c0,
};
Pilot.prototype.updateHairs = function(){
    const hairs = this.hairsTop.children;

    const l = hairs.length;
    for(let i = 0; i < l; i++){
        const h = hairs[i];

        h.scale.y = 0.75 + Math.cos(this.angleHair + i/3) * 0.25;
    }

    this.angleHair += 0.16;
};
init();
function init(){
    setUpScene();
    createLights();
    createPlane();
    createSea();
    createSky();

    document.addEventListener('mousemove', handleMouseMove, false);

    loop();
}
function setUpScene(){
    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
    
    camera.position.set(0, 100, 200);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    WORLD.appendChild(renderer.domElement);

    window.addEventListener('resize', handleWindowResize, false);
}
function handleWindowResize(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
function createLights(){
    const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);
    const ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);
    const shadowLight = new THREE.DirectionalLight(0xffffff, .9);
   
    shadowLight.position.set(150, 350, 350);

    shadowLight.castShadow = true;

    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    scene.add(hemisphereLight);
    scene.add(ambientLight);
    scene.add(shadowLight);
}
function Sea(){
    const geometry = new THREE.CylinderGeometry(600, 600, 800, 40, 10);

    geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI/2));

    const material = new THREE.MeshPhongMaterial({
        color: Colors.blue,
        transparent: true,
        opacity: .6,
        flatShading: true
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.receiveShadow = true;
}
function createSea(){
    sea = new Sea();
    sea.mesh.position.y = -600;
    scene.add(sea.mesh);
}
function Cloud(){
    this.mesh = new THREE.Object3D();

    const geometry = new THREE.BoxGeometry(20, 20, 20);

    const material = new THREE.MeshPhongMaterial({
        color: Colors.white
    });

    const nBlocks = 3 + Math.floor(Math.random() * 3);
    for(let i = 0; i < nBlocks; i++){
        const m = new THREE.Mesh(geometry, material);

        m.position.x = i * 15;
        m.position.y = Math.random() * 10;
        m.position.z = Math.random() * 10;
        m.rotation.z = Math.random() * Math.PI * 2;
        m.rotation.y = Math.random() * Math.PI * 2;

        const s = 0.1 + Math.random() * 0.9;
        m.scale.set(s, s, s);

        m.castShadow = true;
        m.receiveShadow = true;

        this.mesh.add(m);
    } 
}
function Sky(){
    this.mesh = new THREE.Object3D;
    this.nClouds = 20;

    const stepAngle = Math.PI * 2 / this.nClouds;

    for(let i = 0; i < this.nClouds; i++){
        const c = new Cloud();

        const a = stepAngle * i;
        const h = 750 + Math.random()*200;

        c.mesh.position.x = Math.cos(a) * h;
        c.mesh.position.y = Math.sin(a) * h;

        c.mesh.rotation.z = a + Math.PI/2;
        c.mesh.position.z = -360-Math.random()*360;

        const s = 1 + Math.random() * 2;
        c.mesh.scale.set(s, s, s);

        this.mesh.add(c.mesh);
    }
}
function createSky(){
    sky = new Sky();
    sky.mesh.position.y = -600;
    scene.add(sky.mesh);
}
function Airplane(){
    this.mesh = new THREE.Object3D();

    const geomCockpit = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
    const matCockpit = new THREE.MeshPhongMaterial({
        color: Colors.red,
        flatShading: true
    });
    const cockpit = new THREE.Mesh(geomCockpit, matCockpit);
    cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    this.mesh.add(cockpit);

    const geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
    const matEngine = new THREE.MeshPhongMaterial({
        color: Colors.white,
        flatShading: true
    });
    const engine = new THREE.Mesh(geomEngine, matEngine);
    engine.position.x = 40;
    engine.castShadow = true;
    engine.receiveShadow = true;
    this.mesh.add(engine);

    const geomTail = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
    const matTail = new THREE.MeshPhongMaterial({
        color: Colors.red,
        flatShading: true
    });
    const tail = new THREE.Mesh(geomTail, matTail);
    tail.position.set(-35, 25, 0);
    tail.castShadow = true;
    tail.receiveShadow = true;
    this.mesh.add(tail);

    const geomWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
    const matWing = new THREE.MeshPhongMaterial({
        color: Colors.red,
        flatShading: true
    });
    const wing = new THREE.Mesh(geomWing, matWing);
    wing.castShadow = true;
    wing.receiveShadow = true;
    this.mesh.add(wing);

    const geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
    const matPropeller = new THREE.MeshPhongMaterial({
        color: Colors.brown,
        flatShading: true
    });
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
    this.propeller.caseShadow = true;
    this.propeller.receiveShadow = true;

    const geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
    const matBlade = new THREE.MeshPhongMaterial({
        color: Colors.brownDark,
        flatShading: true
    });
    const blade = new THREE.Mesh(geomBlade, matBlade);
    blade.position.set(8, 0, 0);
    blade.castShadow = true;
    blade.receiveShadow = true;
    this.propeller.add(blade);
    this.propeller.position.set(50, 0, 0);
    this.mesh.add(this.propeller);

    this.pilot = new Pilot();
    this.pilot.mesh.position.y += 35;
    this.mesh.add(this.pilot.mesh);
}
function createPlane(){
    airplane = new Airplane();
    airplane.mesh.scale.set(0.25, 0.25, 0.25);
    airplane.mesh.position.y = 100;
    scene.add(airplane.mesh);
}
function handleMouseMove(e){
    const tx = -1 + (e.clientX / window.innerWidth)*2;
    const ty = 1 - (e.clientY / window.innerHeight)*2;

    mousePos.x = tx;
    mousePos.y = ty;
}
function updatePlane(){
    // const targetX = normalize(mousePos.x, -0.75, 0.75, -100, 100);
    const targetY = normalize(mousePos.y, -0.75, 0.75, 25, 175);

    airplane.mesh.position.y += (targetY - airplane.mesh.position.y)*0.1;
    
    airplane.mesh.rotation.x = (airplane.mesh.position.y - targetY)*0.0064;
    airplane.mesh.rotation.z = (targetY - airplane.mesh.position.y)*0.0128;
    
    airplane.propeller.rotation.x += 0.3;
    airplane.pilot.updateHairs();
}
function normalize(v, vmin, vmax, tmin, tmax){
    const nv = Math.max(Math.min(v, vmax), vmin);
    const dv = vmax - vmin;
    const pc = (nv - vmin)/dv;
    const dt = tmax - tmin;
    const tv = tmin + (pc * dt);
    return tv;
}
function Pilot(){
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'pilot';

    this.angleHair = 0;

    const geomBody = new THREE.BoxGeometry(15, 15, 15);
    const matBody = new THREE.MeshPhongMaterial({
        color: Colors.brown,
        flatShading: true
    });
    const body = new THREE.Mesh(geomBody, matBody);
    body.position.set(2, -12, 0);
    this.mesh.add(body);

    const geomFace = new THREE.BoxGeometry(10, 10, 10);
    const matFace = new THREE.MeshPhongMaterial({
        color: Colors.pink
    });
    const face = new THREE.Mesh(geomFace, matFace);
    this.mesh.add(face);

    const geomHair = new THREE.BoxGeometry(4, 4, 4);
    const matHair = new THREE.MeshPhongMaterial({
        color: Colors.brown
    });
    const hair = new THREE.Mesh(geomHair, matHair);
    hair.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 2, 0));
    
    const hairs = new THREE.Object3D();

    this.hairsTop = new THREE.Object3D();

    for(let i = 0; i < 12; i++){
        const h = hair.clone();
        const col = i % 3;
        const row = Math.floor(i/3);
        const startPosZ = -4;
        const startPosX = -4;

        h.position.set(startPosX + row*4, 0, startPosZ + col*4);
        this.hairsTop.add(h);
    }

    hairs.add(this.hairsTop);

    const geomHairSide = new THREE.BoxGeometry(12, 4, 2);
    geomHairSide.applyMatrix4(new THREE.Matrix4().makeTranslation(-6, 0, 0));
    const hairSideR = new THREE.Mesh(geomHairSide, matHair);
    const hairSideL = new THREE.Mesh(geomHairSide, matHair);

    hairSideR.position.set(8, -2, 6);
    hairSideL.position.set(8, -2, -6);
    hairs.add(hairSideR);
    hairs.add(hairSideL);

    const geomHairBack = new THREE.BoxGeometry(2, 8, 10);
    const hairBack = new THREE.Mesh(geomHairBack, matHair);

    hairBack.position.set(-1, -4, 0);
    hairs.add(hairBack);
    hairs.position.set(-5, 5, 0);

    this.mesh.add(hairs);

    const geomGlass = new THREE.BoxGeometry(5, 5, 5);
    const matGlass = new THREE.MeshPhongMaterial({
        color: Colors.brown
    });
    const glassR = new THREE.Mesh(geomGlass, matGlass);
    const glassL = new THREE.Mesh(geomGlass, matGlass);

    glassR.position.set(6, 0, 3);
    glassL.position.set(6, 0, -3);

    const geomGlassA = new THREE.BoxGeometry(11, 1, 11);
    const glassA = new THREE.Mesh(geomGlassA, matGlass);

    this.mesh.add(glassR);
    this.mesh.add(glassL);
    this.mesh.add(glassA);

    const geomEar = new THREE.BoxGeometry(2, 3, 2);
    const earR = new THREE.Mesh(geomEar, matFace);
    const earL = earR.clone();

    earR.position.set(0, 0, 6);
    earL.position.set(0, 0, -6);

    this.mesh.add(earR);
    this.mesh.add(earL);
}
function updateCameraFov(){
    camera.fov = normalize(mousePos.x,-1,1,40, 80);
    camera.updateProjectionMatrix();
}
function loop(){
    sea.mesh.rotation.z += 0.005;
    sky.mesh.rotation.z += 0.01;

    updatePlane();
    updateCameraFov();

    renderer.render(scene, camera);

    requestAnimationFrame(loop);
}