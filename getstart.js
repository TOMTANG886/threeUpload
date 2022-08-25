import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

//light
const light = new THREE.DirectionalLight(0xffffff, 10)
const light2 = new THREE.DirectionalLight(0xffffff, 10)
const light3 = new THREE.AmbientLight(0x404040); // soft white light

light.position.set(-5, -5, -5)
light2.position.set(5, 5, 5)
scene.add(light)
scene.add(light2)
scene.add(light3);

/**controls*/
const controls = new OrbitControls(camera, renderer.domElement);
//controls.update() must be called after any manual changes to the camera's transform
camera.position.set(10, 10, 10);
controls.update();

//add to html body
document.body.appendChild(renderer.domElement);

//import model
const pickableObjects = []
const objectsVertices = []

//Sets up the glb loading
const loader = new GLTFLoader()

const input = document.getElementById('file-input')

input.addEventListener(
	'change',
	(changed) => {
		const glbURL = URL.createObjectURL(changed.target.files[0])
		// loader.load(glbURL, (model) => scene.add(model.scene))
		loader.load(glbURL, function (gltf) {
			const root = gltf.scene
		
			//set material
			root.traverse((o) => {
				if (o.isMesh) o.material.transparent = true
			if (o.isMesh) o.material.opacity = 0.1
			});
		
			scene.add(root)
		
			const modelVertices = []
			root.children.map(
				x=>{
					pickableObjects.push(x)
		
					let pos = x.geometry.attributes.position
					console.log(pos)
					let scaleV = x.scale
					console.log(scaleV)
		
					const vertex = new THREE.Vector3()
		
					for ( let vertexIndex = 0; vertexIndex < pos.count; vertexIndex ++ ) {
						let v = vertex.fromBufferAttribute( pos, vertexIndex)
						console.log(v)
						adddot(v)
						
					}
					console.log(modelVertices)
				}
			)	
		}, 
		function (xhr) {
			console.log((xhr.loaded / xhr.total * 100) + "% loaded")
		}, function (error) {
			console.log('err')
		})
	},
	false
)

/**loadGLB */
loader.load('model/transform.glb', function (gltf) {
	const root = gltf.scene

	//set material
	root.traverse((o) => {
		if (o.isMesh){
			o.material.transparent = true
			o.material.opacity = 0.1
		}
	});

	
	// root.position.set(0, 0, 0)
	// root.updateMatrixWorld()
	console.log(root.children)
	const testglb = root.clone().children
	console.log(testglb)
	const m = testglb.geometry

	// testglb.applyMatrix4( defaultTransform )

	scene.add(root)

	const modelVertices = []
	root.children.map(
		x=>{
			pickableObjects.push(x)

			let pos = x.geometry.attributes.position
			console.log(pos)
			let a = x.geometry.index
			console.log(a)
			

			const vertex = new THREE.Vector3()

			for ( let vertexIndex = 0; vertexIndex < pos.count; vertexIndex ++ ) {
				let v = vertex.fromBufferAttribute( pos, vertexIndex)
				console.log(v)
				adddot(v)				
			}

			let scaleV = x.scale
			console.log(scaleV)

			// for ( let vertexIndex = 0; vertexIndex < pos.count; vertexIndex ++ ) {
			// 	let vertextest = new THREE.Vector3( pos.getX(vertexIndex)*scaleV.x, pos.getY(vertexIndex)*scaleV.y, pos.getZ(vertexIndex)*scaleV.z)
			// 	adddot(vertextest)
			// 	modelVertices.push(vertextest)
			// }

			console.log(modelVertices)
		}
	)	
	
}, 
function (xhr) {
	console.log((xhr.loaded / xhr.total * 100) + "% loaded")
}, function (error) {
	console.log('err')
})



//測試hover


const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
const material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

window.addEventListener('mousemove', onMouseMove);
function onMouseMove(event) {
	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
	console.log('aaa')
}

function hoverPieces() {
	raycaster.setFromCamera(mouse, camera)
	const intersects = raycaster.intersectObjects(scene.children, true)

	for(let i = 0; i < intersects.length; i++){
		// intersects[i].object.material.transparent = true
		// intersects[i].object.material.opacity = 0.5
		// intersects[i].object.material.color = {r: 0.5, g: 0.5, b: 0.0}
	}
	renderer.render(scene, camera);
}

function resetMaterials(){
	scene.traverse(function(child) {
		if (child.type === "Mesh") {		
			child.material.opacity = 0.5
			child.material.color = {r: 0.8, g: 0.8, b: 0.8}
		}
	});

}

//測試 點擊畫線
window.onclick = pick;

let drawingLine = false
let pointsarray= []
let line 
let sphere


function adddot(p){
	var dotGeometry =  new THREE.BufferGeometry()
	dotGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [p.x, p.y, p.z], 3 ) );
	var dotMaterial = new THREE.PointsMaterial( { size: 0.1, color: 0x00ffff } );
	var dot = new THREE.Points( dotGeometry, dotMaterial );
	scene.add( dot );
}
function addsphere(p){
	const m = new THREE.MeshStandardMaterial({color: 0x0000ff, roughness: 0})
	let geometry2 = new THREE.SphereGeometry( 0.05, 32, 32 );
	let sphere = new THREE.Mesh( geometry2, m )
	sphere.position.set(p.x, p.y, p.z)
	scene.add( sphere )
}

function cast(event) {
	raycaster.setFromCamera(mouse, camera)
	const intersects = raycaster.intersectObjects(pickableObjects, true)
	// if (intersects.length > 0) {
	// 	console.log(intersects);
	// }
	for(let i = 0; i < intersects.length; i++){
		// intersects[i].object.material.transparent = true
		// intersects[i].object.material.opacity = 0.5
		// intersects[i].object.material.color = {r: 0.9, g: 0.2, b: 0.2}
	}

	if(intersects.length>0 ) {
		if(drawingLine==false){
			// console.log(intersects[0].point)
			pointsarray= []
			let p = intersects[0].point
			pointsarray.push(p)
			

			intersects.forEach(x=>adddot(x.point))

			console.log(intersects)
			console.log('start')
			drawingLine=true
		}else{
			// points.push(intersects[0].point)
            //     points.push(intersects[0].point.clone())
            //     const geometry = new THREE.BufferGeometry().setFromPoints(
            //         points
            //     )

			pointsarray.push(intersects[0].point)
			
			intersects.forEach(x=>adddot(x.point))
			
			const geometry = new THREE.BufferGeometry().setFromPoints(pointsarray)
			const m1 = new THREE.LineBasicMaterial({
				color: 0xffffff,
				transparent: true,
				opacity: 1,
				// depthTest: false,
				// depthWrite: false
			})
			
			line = new THREE.LineSegments(
				geometry,
				m1
			)
			line.frustumCulled = false
			scene.add(line)
			
			console.log(intersects)
			console.log('end')
			drawingLine=false
		}
	}

	renderer.render(scene, camera);
}

function pick(event) {
	const points = []
	console.log('pick')
	const found = cast(event);
	// if (found) {
	//     console.log('testttt');
	// }
}

//clipping plane slider

let n = 0
let v = new THREE.Vector3(0, -1, 0)
//increase button

const btn = document.getElementById("increase")
const slide = document.getElementById("myRange")
const slidecontainer = document.getElementsByClassName("slidecontainer")[0]
btn.addEventListener('click', increase)
slidecontainer.addEventListener('change', increase)

function increase() {
	let sliderValue = slide.value*0.1
	n = sliderValue
	console.log(n)
	globalPlane.set(v,n)
}

//clippingPlane
// var localPlane = new THREE.Plane( new THREE.Vector3( 0, - 10, 0 ), 10 );
// renderer.localClippingEnabled = true;
var globalPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 10);
renderer.clippingPlanes = [globalPlane];

// renderer.domElement.addEventListener('click',pick)


const animate = function () {
	// controls.update()
	// resetMaterials()
	hoverPieces()
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
};

animate();

  





