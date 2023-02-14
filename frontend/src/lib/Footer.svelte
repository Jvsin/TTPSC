<script>
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
        scene.background = new THREE.Color('rgb(20, 22, 26)')

        // Camera
        const camera = new THREE.PerspectiveCamera(75, footerSizes.width / footerSizes.height, 0.1, 10000);
        camera.position.z = 6;

        scene.add(camera);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);

        const directionLight = new THREE.DirectionalLight(0xffffff, 1);
        directionLight.position.set(2, -1, 1);

        scene.add(ambientLight, directionLight);

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });

        renderer.setSize(footerSizes.width, footerSizes.height);
        renderer.render(scene, camera);

        // Canvas Size Settings
        const sizeSetting = () => {
            footerSizes.width = footer.getBoundingClientRect().width;
            footerSizes.height = footer.getBoundingClientRect().height;

            camera.aspect = footerSizes.width / footerSizes.height
            camera.updateProjectionMatrix();

            renderer.setSize(footerSizes.width, footerSizes.height);
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

        loader.load('/assets/pikachu/scene.gltf', (gltf) => {
            obj1 = gltf.scene;
            obj1.scale.set(0.25, 0.25, 0.25);
            obj1.position.set(0, 0, 2);
            obj1.rotation.x = Math.PI * Math.pow(2, -3);

            scene.add(obj1);

            // Floating Mesh
            const floatMesh = () => {
                const elapsedTime = clock.getElapsedTime();

                obj1.position.y = Math.cos(Math.PI / 4 * elapsedTime) * 0.1;
                obj1.rotation.y = Math.PI / 4 * elapsedTime * 0.1;
                // obj1.rotation.z = Math.cos(Math.PI / 4 * elapsedTime) * 0.1;

                renderer.render(scene, camera);
                window.requestAnimationFrame(floatMesh);
            }

            floatMesh();
        });

        window.addEventListener('resize', sizeSetting, false);
        init();
    })
</script>

<footer bind:this={footer}>
    <canvas bind:this={canvas} class="pikachu"></canvas>
    <div class="footer-socials">
        <div class="social-box"><i class="fa-brands fa-facebook-f"></i></div>
        <div class="social-box"><i class="fa-brands fa-instagram"></i></div>
        <div class="social-box"><i class="fa-brands fa-linkedin-in"></i></div>
    </div>
    <div class="footer-rights">
        <p>© 2023, Team II (Poppo, Ronno and Philippicus). All rights reserved</p>
    </div>
</footer>

<style>
    .pikachu {
        width: auto;
        height: auto;
        position: absolute;
        z-index: -1;
    }

    footer {
        width: 100vw;
        height: 850px;
        /* background: rgb(20, 22, 26); */
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-flow: column wrap;
        color: rgb(255, 255, 255);
    }

    footer .footer-socials {
        width: 300px;
        height: auto;
        font-size: 23px;
        display: flex;
        justify-content: space-around;
        align-items: end;
        margin-bottom: 50px;
    }

    .footer-socials .social-box {
        width: 80px;
        height: 80px;
        border: 2px solid rgb(255, 255, 255);
        border-radius: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    footer .footer-rights {
        margin-bottom: 30px;
        text-align: center;
        word-wrap: break-word;
    }
</style>