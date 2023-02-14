<!-- <script>
    import { onMount } from "svelte";
    import * as THREE from 'three';
    import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

    let canvas, footer;

    onMount(() => {
        // Sizes
        const footerSizes  = {
            width: footer.getBoundingClientRect().width, 
            height: footer.getBoundingClientRect().height
        }

        // Scene
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(75, footerSizes.width / footerSizes.height, 0.1, 10000);
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

        renderer.setSize(footerSizes.width, footerSizes.height);
        renderer.render(scene, camera);
    })
</script>

<footer bind:this={footer}>
    <canvas bind:this={canvas} class="pikachu"></canvas>
</footer>

<style>
    footer {
        width: 100vw;
        height: auto;
        background: crimson;
    }
</style> -->