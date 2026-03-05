import * as THREE from 'three';
import gsap from 'gsap';

export function create3DCake(containerId, onSlice) {
    const container = document.getElementById(containerId);
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 4, 10);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 10, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const fillLight = new THREE.PointLight(0xffb6c1, 0.5);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    const cakeGroup = new THREE.Group();
    scene.add(cakeGroup);

    // Materials - Matte Aesthetic
    const mattePink = new THREE.MeshStandardMaterial({
        color: 0xffb6c1,
        roughness: 0.8,
        metalness: 0.1
    });

    const pastelPurple = new THREE.MeshStandardMaterial({
        color: 0xd8bfd8,
        roughness: 0.6,
        metalness: 0.1
    });

    const cakeInner = new THREE.MeshStandardMaterial({
        color: 0xfff0f5,
        roughness: 0.9
    });

    const sliceGroup = new THREE.Group();
    cakeGroup.add(sliceGroup);

    const mainCakeGroup = new THREE.Group();
    cakeGroup.add(mainCakeGroup);

    const layerHeights = [1.2, 1, 0.8];
    const layerRadii = [2.5, 2, 1.5];
    let currentY = 0;

    const sliceAngle = Math.PI * 0.2; // 36 degrees slice

    for (let i = 0; i < 3; i++) {
        const h = layerHeights[i];
        const r = layerRadii[i];

        // Layer Base
        const mainGeo = new THREE.CylinderGeometry(r, r, h, 64, 1, false, sliceAngle, Math.PI * 2 - sliceAngle);
        const mainMesh = new THREE.Mesh(mainGeo, mattePink);
        mainMesh.position.y = currentY + h / 2;
        mainMesh.castShadow = true;
        mainMesh.receiveShadow = true;
        mainCakeGroup.add(mainMesh);

        const sliceGeo = new THREE.CylinderGeometry(r, r, h, 64, 1, false, 0, sliceAngle);
        const sliceMesh = new THREE.Mesh(sliceGeo, mattePink);
        sliceMesh.position.y = currentY + h / 2;
        sliceMesh.castShadow = true;
        sliceGroup.add(sliceMesh);

        // Inner faces (Sponge)
        const leftFaceGeo = new THREE.PlaneGeometry(r, h);
        const leftFace = new THREE.Mesh(leftFaceGeo, cakeInner);
        leftFace.rotation.y = -Math.PI / 2;
        leftFace.position.set(0, currentY + h / 2, r / 2);
        mainCakeGroup.add(leftFace);

        const rightFaceGeo = new THREE.PlaneGeometry(r, h);
        const rightFace = new THREE.Mesh(rightFaceGeo, cakeInner);
        rightFace.rotation.y = -Math.PI / 2 + sliceAngle;
        rightFace.position.set(Math.sin(sliceAngle) * (r / 2), currentY + h / 2, Math.cos(sliceAngle) * (r / 2));
        mainCakeGroup.add(rightFace);

        const sLeftFace = leftFace.clone();
        sLeftFace.material = cakeInner;
        sliceGroup.add(sLeftFace);

        const sRightFace = rightFace.clone();
        sRightFace.material = cakeInner;
        sliceGroup.add(sRightFace);

        // Pastel Purple Cream Balls (Decorations)
        const ballCount = 16;
        const ballRadius = 0.12;
        const ballGeo = new THREE.SphereGeometry(ballRadius, 16, 16);

        for (let j = 0; j < ballCount; j++) {
            const angle = (j / ballCount) * Math.PI * 2;
            const ball = new THREE.Mesh(ballGeo, pastelPurple);
            const x = Math.sin(angle) * (r - 0.1);
            const z = Math.cos(angle) * (r - 0.1);
            ball.position.set(x, currentY + h, z);

            if (angle > 0 && angle < sliceAngle) {
                sliceGroup.add(ball);
            } else {
                mainCakeGroup.add(ball);
            }
        }

        currentY += h;
    }

    // Single Thin Candle
    const candleGroup = new THREE.Group();
    candleGroup.position.set(0, currentY, 0);
    mainCakeGroup.add(candleGroup);

    const candleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16);
    const candleMesh = new THREE.Mesh(candleGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }));
    candleMesh.position.y = 0.4;
    candleGroup.add(candleMesh);

    // Warm Flame
    const flameGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const flameMesh = new THREE.Mesh(flameGeo, new THREE.MeshStandardMaterial({
        color: 0xffcc33,
        emissive: 0xffaa00,
        emissiveIntensity: 2
    }));
    flameMesh.position.y = 0.85;
    candleGroup.add(flameMesh);

    // Flame Flicker
    gsap.to(flameMesh.scale, {
        x: 1.1, y: 1.4, z: 1.1,
        duration: 0.15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // Interaction
    let sliced = false;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onPointerDown(event) {
        if (sliced) return;

        const bounds = container.getBoundingClientRect();
        mouse.x = ((event.clientX - bounds.left) / width) * 2 - 1;
        mouse.y = -((event.clientY - bounds.top) / height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cakeGroup.children, true);

        if (intersects.length > 0) {
            sliced = true;
            const angle = sliceAngle / 2;
            const dist = 1.2;
            gsap.to(sliceGroup.position, {
                x: Math.sin(angle) * dist,
                z: Math.cos(angle) * dist,
                duration: 1.2,
                ease: "power2.out",
                onComplete: onSlice
            });

            gsap.to(cakeGroup.rotation, {
                y: cakeGroup.rotation.y + 0.8,
                duration: 1.5,
                ease: "power2.out"
            });
        }
    }

    container.addEventListener('pointerdown', onPointerDown);

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        if (!sliced) {
            cakeGroup.rotation.y += 0.003;
        }
        renderer.render(scene, camera);
    }

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
}
