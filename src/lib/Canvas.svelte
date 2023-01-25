<script>
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

    let canvas;

    onMount(() => {
        // Sizes
        const sizes  = {
            width: window.innerWidth, 
            height: window.innerHeight
        }

        // Scene
        const scene = new THREE.Scene();
        const url = '../../static/assets/background.png';
        scene.background = new THREE.TextureLoader().load(url);

        // Camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000);
        camera.position.z = 6;

        scene.add(camera);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);

        const directionLight = new THREE.DirectionalLight(0xffffff, 3);
        directionLight.position.set(-2, 0, 2);

        scene.add(ambientLight, directionLight);

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });

        renderer.setSize(sizes.width, sizes.height);
        renderer.render(scene, camera);

        // Canvas Size Settings
        const sizeSetting = () => {
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;

            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix();

            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            renderer.render(scene, camera);
        }

        // Initiolize
        const init = () => {
            renderer.render(scene, camera);

            window.requestAnimationFrame(init);
        }

        // Clock
        const clock = new THREE.Clock();

        // GLTF Loader
        const loader = new GLTFLoader();
        let obj1 = null;
        loader.load('/assets/pokeball/scene.gltf', (gltf) => {
            obj1 = gltf.scene;
            obj1.scale.set(0.25, 0.25, 0.25);
            obj1.position.set(-0.5, 0, 2);

            scene.add(obj1);

            // Floating Mesh
            const floatMesh = () => {
                const elapsedTime = clock.getElapsedTime();

                obj1.position.y = Math.cos(Math.PI / 4 * elapsedTime) * 0.1;
                obj1.rotation.x = Math.sin(Math.PI / 4 * elapsedTime) * 0.1;
                obj1.rotation.z = Math.cos(Math.PI / 4 * elapsedTime) * 0.1;

                renderer.render(scene, camera);
                window.requestAnimationFrame(floatMesh);
            }

            floatMesh();
        });

        let obj2 = null;
        loader.load('/assets/pokeball/scene.gltf', (gltf) => {
            obj2 = gltf.scene;
            obj2.scale.set(Math.pow(2, -3), Math.pow(2, -3), Math.pow(2, -3));
            obj2.position.set(-2.5, -1.8, 2);
            obj2.rotation.y = Math.PI * Math.pow(2, -3);

            scene.add(obj2);

            // Floating Mesh
            const floatMesh = () => {
                const elapsedTime = clock.getElapsedTime();

                obj2.rotation.x = Math.cos(Math.PI / 4 * elapsedTime) * 0.2;
                obj2.rotation.z = Math.sin(Math.PI / 4 * elapsedTime) * 0.2;

                renderer.render(scene, camera);
                window.requestAnimationFrame(floatMesh);
            }

            floatMesh();
        });

        window.addEventListener('resize', sizeSetting, false);
        init();
    });
</script>

<canvas bind:this={canvas}></canvas>

<style>
    canvas {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: -1;
    }
</style>

