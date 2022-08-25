// import * as THREE from 'three';
// import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from './three.js-master/examples/jsm/loaders/GLTFLoader.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const threeCanvas = document.getElementById("threecanvas");


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



//測試
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}


function render() {

	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

	for ( let i = 0; i < intersects.length; i ++ ) {

		intersects[ i ].object.material.color.set( 0xff0000 );

	}

	renderer.render( scene, camera );

}





//import model
const loader = new GLTFLoader()
loader.load('model/house.glb', function(gltf){
    const root = gltf.scene
    root.scale.set(0.1,0.1,0.1)
    scene.add(root)

},function(xhr){
    console.log((xhr.loaded/xhr.total * 100)+"% loaded")
},function(error){
    console.log('err')
})




var text2 = document.createElement('div');
text2.style.position = 'absolute';
text2.style.width = 100;
text2.style.height = 100;
text2.style.backgroundColor = "white";
text2.innerHTML = "hi there!";
text2.style.top = 200 + 'px';
text2.style.left = 200 + 'px';
document.body.appendChild(text2);


//light
const light = new THREE.DirectionalLight(0xffffff, 5)
const light2= new THREE.DirectionalLight(0xffffff, 2)
light.position.set(5,5,5)
light2.position.set(-5,5,-5)
scene.add(light)
scene.add(light2)

// controls
const controls = new OrbitControls( camera, renderer.domElement );
//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 0, 50, 0 );
controls.update();



// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );


// const geometry = new THREE.BoxGeometry();
// const texture = new THREE.TextureLoader().load('textures/metal.jpg');
// const material = new  THREE.MeshBasicMaterial({ map: texture })
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

camera.position.z = 5;

const animate = function () {
    requestAnimationFrame( animate );

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    // required if controls.enableDamping or controls.autoRotate are set to true
	// controls.update();

    renderer.render( scene, camera );
};

animate();


window.addEventListener( 'pointermove', onPointerMove );

window.requestAnimationFrame(render);

