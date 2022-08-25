import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js';

import { Matrix4, Vector3,
    DirectionalLight, AmbientLight,
    PerspectiveCamera,
    Scene, WebGLRenderer,
  } from 'https://unpkg.com/three@0.127.0/build/three.module.js'

  
  //mapboxgl.accessToken = 'YOUR_API_KEY'
  //this API key is restricted to this github repo. Make a free account to get your own: https://account.mapbox.com/auth/signup/
  mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94dXNlcjg4NiIsImEiOiJjbDc4bHRhcWkwYjFyM3BxZjNxaWZxbHh3In0.AGR2P8b6d6rJIZveurbqVw';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    zoom: 20,
    center: [121.5, 25],
    pitch: 75,
    bearing: -80,
    antialias: true,
    // projection: 'globe' 
  });
  
  const modelOrigin = [121.5, 25];
  const modelAltitude = 0;
  const modelRotate = [Math.PI / 2, .72, 0];
   
  const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude);
   
  const modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
  };
   
  const scene = new Scene();
  const camera = new PerspectiveCamera();
  const renderer = new WebGLRenderer({
    canvas: map.getCanvas(),
    antialias: true,
  });
  renderer.autoClear = false;

  
  
  const customLayer = {
  
    id: '3d-model',
    type: 'custom',
    renderingMode: '3d',
  
    onAdd: function () {
        const loader = new GLTFLoader()

        let  pickableObjects = []

        loader.load('model/pyramid2.glb', function (gltf) {
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
                        // adddot(v)				
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

    //   const ifcLoader = new IFCLoader();
    //   ifcLoader.ifcManager.setWasmPath( '../../../' );
    //   ifcLoader.load( '../../../IFC/01.ifc', function ( model ) {
    //     scene.add( model );
    //   });
  
      const directionalLight = new DirectionalLight(0x404040);
      const directionalLight2 = new DirectionalLight(0x404040);
      const ambientLight = new AmbientLight( 0x404040, 3 ); 
  
      directionalLight.position.set(0, -70, 100).normalize();
      directionalLight2.position.set(0, 70, 100).normalize();
  
      scene.add(directionalLight, directionalLight2, ambientLight);
    },
  
    render: function (gl, matrix) {
      const rotationX = new Matrix4().makeRotationAxis(
      new Vector3(1, 0, 0), modelTransform.rotateX);
      const rotationY = new Matrix4().makeRotationAxis(
      new Vector3(0, 1, 0), modelTransform.rotateY);
      const rotationZ = new Matrix4().makeRotationAxis(
      new Vector3(0, 0, 1), modelTransform.rotateZ);
    
      const m = new Matrix4().fromArray(matrix);
      const l = new Matrix4()
      .makeTranslation(
      modelTransform.translateX,
      modelTransform.translateY,
      modelTransform.translateZ
      )
      .scale(
      new Vector3(
      modelTransform.scale,
      -modelTransform.scale,
      modelTransform.scale)
      )
      .multiply(rotationX)
      .multiply(rotationY)
      .multiply(rotationZ);
      
      camera.projectionMatrix = m.multiply(l);
      renderer.resetState();
      renderer.render(scene, camera);
      map.triggerRepaint();
    }
  };
   
  map.on('style.load', () => {
    map.addLayer(customLayer, 'waterway-label');
  });
  