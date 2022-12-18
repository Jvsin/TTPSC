<script>
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

    let canvas;

    onMount(() => {
        // Sizes
        const size  = {
            width: window.innerWidth, 
            height: window.innerHeight
        }

        // Scene
        const scene = new THREE.Scene();
        const url = '../../static/assets/background.png';
        // scene.background = new THREE.TextureLoader().load(url);

    });
</script>

<canvas bind:this={canvas}></canvas>

<style>
    canvas {
        position: absolute;
        left: 0;
        top: 0;
    }
</style>

