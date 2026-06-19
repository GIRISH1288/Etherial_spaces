'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ThreeHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#161514'); // Dark elegant background matching site theme
    scene.fog = new THREE.FogExp2('#161514', 0.05);

    // 2. CAMERA SETUP
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.6, 7.5); // Eye-level view slightly back

    // 3. RENDERER SETUP
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // 4. PARALLAX / MOUSE TRACKING
    let mouseX = 0;
    let mouseY = 0;
    const targetCamPos = new THREE.Vector3(0, 1.6, 7.5);
    const currentCamPos = new THREE.Vector3(0, 1.6, 7.5);

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 5. PROCEDURAL TEXTURES GENERATORS
    const createWoodTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      
      // Warm dark walnut base
      ctx.fillStyle = '#4A3321';
      ctx.fillRect(0, 0, 512, 512);

      // Plank lines
      ctx.strokeStyle = '#2F1F14';
      ctx.lineWidth = 3;
      const plankWidth = 64;
      for (let x = 0; x < 512; x += plankWidth) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 512);
        ctx.stroke();
      }

      // Planks grains lines
      ctx.strokeStyle = '#5E422C';
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const length = Math.random() * 180 + 60;
        ctx.lineWidth = Math.random() * 1.2 + 0.4;
        ctx.globalAlpha = Math.random() * 0.15 + 0.05;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(
          x + length / 3, y + Math.random() * 10 - 5,
          x + (2 * length) / 3, y + Math.random() * 10 - 5,
          x + length, y
        );
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
      return texture;
    };

    const createMarbleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      
      // Cream white base
      ctx.fillStyle = '#EAE8E2';
      ctx.fillRect(0, 0, 512, 512);

      // Fine grey marble veins
      ctx.strokeStyle = '#9E9C96';
      ctx.globalAlpha = 0.4;
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.lineWidth = Math.random() * 3 + 0.8;
        let x = Math.random() * 512;
        let y = 0;
        ctx.moveTo(x, y);
        while (y < 512) {
          x += (Math.random() - 0.5) * 30;
          y += Math.random() * 30 + 10;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Fine gold vein accents
      ctx.strokeStyle = '#C5A059';
      ctx.globalAlpha = 0.25;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.lineWidth = Math.random() * 1.5 + 0.3;
        let x = Math.random() * 512;
        let y = 0;
        ctx.moveTo(x, y);
        while (y < 512) {
          x += (Math.random() - 0.5) * 15;
          y += Math.random() * 25 + 10;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    const createFabricNoiseTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      
      // Base white
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 256, 256);
      
      // Fabric noise dots
      ctx.fillStyle = '#e8e8e8';
      for (let i = 0; i < 15000; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        ctx.fillRect(x, y, 1, 1);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(10, 10);
      return texture;
    };

    const createDustParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d')!;
      
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'rgba(255, 230, 180, 1.0)');
      grad.addColorStop(0.5, 'rgba(255, 230, 180, 0.3)');
      grad.addColorStop(1, 'rgba(255, 230, 180, 0.0)');
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);

      return new THREE.CanvasTexture(canvas);
    };

    // Instantiate textures
    const woodFloorTexture = createWoodTexture();
    const marbleTableTexture = createMarbleTexture();
    const fabricBumpTexture = createFabricNoiseTexture();

    // 6. OBJECT MATERIALS
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: '#EFEFEA', // Cream/Beige
      roughness: 0.9,
      metalness: 0.05
    });

    const floorMaterial = new THREE.MeshStandardMaterial({
      map: woodFloorTexture,
      roughness: 0.3,
      metalness: 0.1
    });

    const sofaMaterial = new THREE.MeshStandardMaterial({
      color: '#EADEC9', // Cream/Beige fabric
      bumpMap: fabricBumpTexture,
      bumpScale: 0.015,
      roughness: 0.85,
      metalness: 0.02
    });

    const marbleMaterial = new THREE.MeshStandardMaterial({
      map: marbleTableTexture,
      roughness: 0.12,
      metalness: 0.05
    });

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: '#2A2928', // Dark grey/black metal
      roughness: 0.3,
      metalness: 0.85
    });

    const brassMaterial = new THREE.MeshStandardMaterial({
      color: '#C5A059', // Brass gold accents
      roughness: 0.25,
      metalness: 0.88
    });

    const plantMaterial = new THREE.MeshStandardMaterial({
      color: '#2D3E2F', // Organic dark green
      roughness: 0.6,
      metalness: 0.05
    });

    // 7. LIGHTS CONFIGURATION
    const ambientLight = new THREE.AmbientLight('#EBDAC4', 1.0); // Warm indirect light
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight('#ffffff', '#332820', 0.6); // Ambient environment light
    scene.add(hemiLight);

    // Main Golden Hour Directional Light (Entering through window left)
    const sunLight = new THREE.DirectionalLight('#FFAA55', 6.0);
    sunLight.position.set(-9, 5, -2.5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 25;
    sunLight.shadow.camera.left = -6;
    sunLight.shadow.camera.right = 6;
    sunLight.shadow.camera.top = 6;
    sunLight.shadow.camera.bottom = -6;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // 8. SCENE LAYOUT GROUP (Organized into parallax speed layers)
    const bgGroup = new THREE.Group();
    const midGroup = new THREE.Group();
    const fgGroup = new THREE.Group();
    
    scene.add(bgGroup);
    scene.add(midGroup);
    scene.add(fgGroup);

    // 8a. ROOM SHELL (bgGroup)
    // Floor
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMesh = new THREE.Mesh(floorGeo, floorMaterial);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.8;
    floorMesh.receiveShadow = true;
    bgGroup.add(floorMesh);

    // Back Wall
    const backWallGeo = new THREE.PlaneGeometry(30, 15);
    const backWall = new THREE.Mesh(backWallGeo, wallMaterial);
    backWall.position.set(0, 5, -9);
    backWall.receiveShadow = true;
    bgGroup.add(backWall);

    // Left Wall with big architectural window frame
    const leftWallNearGeo = new THREE.PlaneGeometry(10, 15);
    const leftWallNear = new THREE.Mesh(leftWallNearGeo, wallMaterial);
    leftWallNear.rotation.y = Math.PI / 2;
    leftWallNear.position.set(-8.5, 5, 5);
    bgGroup.add(leftWallNear);

    const leftWallFarGeo = new THREE.PlaneGeometry(10, 15);
    const leftWallFar = new THREE.Mesh(leftWallFarGeo, wallMaterial);
    leftWallFar.rotation.y = Math.PI / 2;
    leftWallFar.position.set(-8.5, 5, -5);
    leftWallFar.receiveShadow = true;
    bgGroup.add(leftWallFar);

    // Minimalist Art Frame on Back Wall
    const artFrameGeo = new THREE.BoxGeometry(2.4, 3.4, 0.05);
    const artFrame = new THREE.Mesh(artFrameGeo, metalMaterial);
    artFrame.position.set(-3.5, 2.2, -8.95);
    bgGroup.add(artFrame);

    const artCanvasGeo = new THREE.PlaneGeometry(2.2, 3.2);
    // Draw minimal geometric art procedurally
    const artCanvas = document.createElement('canvas');
    artCanvas.width = 256;
    artCanvas.height = 256;
    const artCtx = artCanvas.getContext('2d')!;
    artCtx.fillStyle = '#E3DDD3';
    artCtx.fillRect(0, 0, 256, 256);
    artCtx.fillStyle = '#C5A059';
    artCtx.beginPath();
    artCtx.arc(128, 128, 64, 0, Math.PI * 2);
    artCtx.fill();
    artCtx.fillStyle = '#2A2928';
    artCtx.fillRect(100, 128, 80, 4);

    const artTexture = new THREE.CanvasTexture(artCanvas);
    const artMaterial = new THREE.MeshStandardMaterial({ map: artTexture, roughness: 0.8 });
    const artMesh = new THREE.Mesh(artCanvasGeo, artMaterial);
    artMesh.position.set(-3.5, 2.2, -8.92);
    bgGroup.add(artMesh);

    // Window Slats Frame (Left)
    const windowFrameGeo = new THREE.BoxGeometry(0.1, 7, 0.08);
    for (let z = -2.5; z <= 2.5; z += 1.25) {
      const windowFrame = new THREE.Mesh(windowFrameGeo, metalMaterial);
      windowFrame.position.set(-8.4, 2.7, z);
      bgGroup.add(windowFrame);
    }
    const windowHeaderGeo = new THREE.BoxGeometry(0.1, 0.1, 6.0);
    const windowHeader = new THREE.Mesh(windowHeaderGeo, metalMaterial);
    windowHeader.position.set(-8.4, 6.2, 0);
    bgGroup.add(windowHeader);

    // Textured Rug on Floor
    const rugGeo = new THREE.PlaneGeometry(6.2, 5.0);
    const rugMaterial = new THREE.MeshStandardMaterial({
      color: '#DFD8CC', // Textured beige
      roughness: 0.95,
      bumpMap: fabricBumpTexture,
      bumpScale: 0.02
    });
    const rug = new THREE.Mesh(rugGeo, rugMaterial);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0.5, -0.79, 0.8);
    rug.receiveShadow = true;
    midGroup.add(rug);

    // 8b. MIDGROUND LAYER (midGroup - Sectional Sofa & Tables)
    // Sectional Sofa cushions structure
    const sofaGroup = new THREE.Group();
    sofaGroup.position.set(0.4, -0.8, -0.5);

    // Cushion 1 (Left Long Piece)
    const cushion1Geo = new THREE.BoxGeometry(2.4, 0.45, 1.2);
    const cushion1 = new THREE.Mesh(cushion1Geo, sofaMaterial);
    cushion1.position.set(-1.0, 0.225, 0);
    cushion1.castShadow = true;
    cushion1.receiveShadow = true;
    sofaGroup.add(cushion1);

    // Cushion 2 (Right Corner Piece)
    const cushion2Geo = new THREE.BoxGeometry(1.2, 0.45, 1.2);
    const cushion2 = new THREE.Mesh(cushion2Geo, sofaMaterial);
    cushion2.position.set(0.8, 0.225, 0);
    cushion2.castShadow = true;
    cushion2.receiveShadow = true;
    sofaGroup.add(cushion2);

    // Cushion 3 (Chaise Extension Forward)
    const cushion3Geo = new THREE.BoxGeometry(1.2, 0.45, 1.6);
    const cushion3 = new THREE.Mesh(cushion3Geo, sofaMaterial);
    cushion3.position.set(0.8, 0.225, 1.4);
    cushion3.castShadow = true;
    cushion3.receiveShadow = true;
    sofaGroup.add(cushion3);

    // Backrest Left
    const backrestLGeo = new THREE.BoxGeometry(2.4, 0.6, 0.3);
    const backrestL = new THREE.Mesh(backrestLGeo, sofaMaterial);
    backrestL.position.set(-1.0, 0.75, -0.45);
    backrestL.castShadow = true;
    sofaGroup.add(backrestL);

    // Backrest Right
    const backrestRGeo = new THREE.BoxGeometry(1.5, 0.6, 0.3);
    const backrestR = new THREE.Mesh(backrestRGeo, sofaMaterial);
    backrestR.position.set(0.65, 0.75, -0.45);
    backrestR.castShadow = true;
    sofaGroup.add(backrestR);

    // Armrest Left
    const armrestLGeo = new THREE.BoxGeometry(0.3, 0.6, 1.2);
    const armrestL = new THREE.Mesh(armrestLGeo, sofaMaterial);
    armrestL.position.set(-2.35, 0.5, 0);
    armrestL.castShadow = true;
    sofaGroup.add(armrestL);

    midGroup.add(sofaGroup);

    // Marble Coffee Table
    const tableGroup = new THREE.Group();
    tableGroup.position.set(-0.3, -0.8, 1.5);

    const tableTopGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.08, 32);
    const tableTop = new THREE.Mesh(tableTopGeo, marbleMaterial);
    tableTop.position.y = 0.44;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);

    // Minimalistic cross frame base
    const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8);
    const legs = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const leg = new THREE.Mesh(legGeo, metalMaterial);
      leg.position.set(Math.cos(angle) * 0.75, 0.2, Math.sin(angle) * 0.75);
      leg.castShadow = true;
      tableGroup.add(leg);
      legs.push(leg);
    }
    const baseRingGeo = new THREE.CylinderGeometry(0.77, 0.77, 0.02, 32, 1, true);
    const baseRing = new THREE.Mesh(baseRingGeo, metalMaterial);
    baseRing.position.y = 0.01;
    tableGroup.add(baseRing);

    // Small ceramic vase on Coffee Table
    const vaseGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.24, 16);
    const vaseMaterial = new THREE.MeshStandardMaterial({ color: '#C08A64', roughness: 0.9 });
    const vase = new THREE.Mesh(vaseGeo, vaseMaterial);
    vase.position.set(-0.25, 0.6, 0.1);
    vase.castShadow = true;
    tableGroup.add(vase);

    // Interior Books on Table
    const bookGeo = new THREE.BoxGeometry(0.28, 0.03, 0.36);
    const book1Material = new THREE.MeshStandardMaterial({ color: '#2B2B28', roughness: 0.8 });
    const book1 = new THREE.Mesh(bookGeo, book1Material);
    book1.position.set(0.2, 0.495, -0.15);
    book1.rotation.y = 0.1;
    book1.castShadow = true;
    tableGroup.add(book1);

    midGroup.add(tableGroup);

    // 8c. FOREGROUND LAYER (fgGroup - Designer Lamp & Plant)
    // Curved Designer Floor Lamp
    const lampGroup = new THREE.Group();
    lampGroup.position.set(-2.0, -0.8, -1.2);

    // Weighted base
    const lampBaseGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 32);
    const lampBase = new THREE.Mesh(lampBaseGeo, metalMaterial);
    lampBase.castShadow = true;
    lampGroup.add(lampBase);

    // Curved neck structure (TubeGeometry along quadratic curve)
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0.5, 2.5, 0.2),
      new THREE.Vector3(1.4, 2.7, 1.2)
    );
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.03, 8, false);
    const lampNeck = new THREE.Mesh(tubeGeo, brassMaterial);
    lampNeck.castShadow = true;
    lampGroup.add(lampNeck);

    // Lamp Shade Dome
    const shadeGroup = new THREE.Group();
    shadeGroup.position.set(1.4, 2.7, 1.2);
    
    const shadeGeo = new THREE.SphereGeometry(0.22, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const lampShade = new THREE.Mesh(shadeGeo, brassMaterial);
    lampShade.rotation.x = Math.PI; // flip to face down
    lampShade.castShadow = true;
    shadeGroup.add(lampShade);

    // Point Light inside the Shade (Casting warm ambient light downwards)
    const lampLight = new THREE.PointLight('#FFC280', 2.8, 6.5, 1.5);
    lampLight.position.set(0, -0.1, 0);
    lampLight.castShadow = true;
    lampLight.shadow.bias = -0.002;
    shadeGroup.add(lampLight);

    // Visual bulb mesh glow
    const bulbGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const bulbMat = new THREE.MeshBasicMaterial({ color: '#FFD699' });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(0, -0.05, 0);
    shadeGroup.add(bulb);

    lampGroup.add(shadeGroup);
    fgGroup.add(lampGroup);

    // Tall Indoor Plant
    const plantGroup = new THREE.Group();
    plantGroup.position.set(2.4, -0.8, 1.8);

    // Clay Pot
    const potGeo = new THREE.CylinderGeometry(0.35, 0.26, 0.74, 24);
    const potMat = new THREE.MeshStandardMaterial({ color: '#9C958C', roughness: 0.95 });
    const pot = new THREE.Mesh(potGeo, potMat);
    pot.position.y = 0.37;
    pot.castShadow = true;
    plantGroup.add(pot);

    // Plant Stems and Leaves (Procedural)
    const leaves: THREE.Mesh[] = [];
    const leafGeo = new THREE.ConeGeometry(0.12, 0.9, 4);
    leafGeo.rotateX(-Math.PI / 2.5); // align outward
    
    // Create 15 leaves angled in a spiral upward
    for (let i = 0; i < 15; i++) {
      const leafStem = new THREE.Group();
      leafStem.position.set(0, 0.65 + (i * 0.08), 0);
      
      const angle = i * 2.4; // golden spiral angle
      leafStem.rotation.y = angle;
      
      const leaf = new THREE.Mesh(leafGeo, plantMaterial);
      const scale = 0.75 + (Math.sin(i / 3) * 0.25);
      leaf.scale.set(scale, scale, scale * 1.3);
      leaf.position.set(0, 0, 0.25);
      leaf.castShadow = true;
      leaf.receiveShadow = true;
      
      leafStem.add(leaf);
      plantGroup.add(leafStem);
      leaves.push(leaf); // Track leaves for sway animation
    }

    fgGroup.add(plantGroup);

    // 9. VOLUMETRIC DUST PARTICLES SYSTEM
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: number[] = [];

    // Distribute particles in a volume intersecting the light shaft
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8.5; // X
      positions[i * 3 + 1] = Math.random() * 5.0 - 0.8; // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6.5; // Z
      
      velocities.push(
        (Math.random() * 0.005 + 0.002), // y speed (floating upward)
        (Math.random() * 0.002 - 0.001) // x speed (slight side drift)
      );
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dustTexture = createDustParticleTexture();

    const particleMat = new THREE.PointsMaterial({
      size: 0.09,
      map: dustTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85
    });

    const dustParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(dustParticles);

    // 10. LIGHT SHAFT REPRESENTATION (Procedural soft cone cylinder representing light rays)
    const shaftGeo = new THREE.CylinderGeometry(0.4, 2.2, 10.0, 16, 1, true);
    shaftGeo.translate(0, -5, 0);
    shaftGeo.rotateZ(Math.PI / 4.2); // Angle down from left windows
    
    // Draw linear opacity gradient
    const shaftMat = new THREE.MeshBasicMaterial({
      color: '#FFAA55',
      transparent: true,
      opacity: 0.038,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    
    const lightShaft = new THREE.Mesh(shaftGeo, shaftMat);
    lightShaft.position.set(-6, 5, 0);
    scene.add(lightShaft);

    // Hide loader
    setLoading(false);

    // 11. ANIMATION LOOP
    let clock = new THREE.Clock();
    let animId = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Micro-sway on plant leaves (gentle sine wave)
      leaves.forEach((leaf, idx) => {
        leaf.rotation.x = Math.sin(elapsed * 0.85 + idx) * 0.04;
        leaf.rotation.z = Math.cos(elapsed * 0.6 + idx) * 0.025;
      });

      // Micro-floating motion of lamp head
      shadeGroup.position.y = 2.7 + Math.sin(elapsed * 1.2) * 0.02;

      // Animate dust particles floating
      const positions = dustParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        // Apply velocity
        positions[i * 3 + 1] += velocities[i * 2]; // Y
        positions[i * 3] += velocities[i * 2 + 1]; // X

        // Boundary wrap checks
        if (positions[i * 3 + 1] > 4.2) {
          positions[i * 3 + 1] = -0.8;
        }
        if (positions[i * 3] > 4.2 || positions[i * 3] < -4.2) {
          positions[i * 3] = (Math.random() - 0.5) * 8.0;
        }
      }
      dustParticles.geometry.attributes.position.needsUpdate = true;

      // Smooth Camera LERP based on mouse parallax inputs
      targetCamPos.x = mouseX * 0.48;
      targetCamPos.y = 1.6 + mouseY * 0.28;
      
      currentCamPos.x += (targetCamPos.x - currentCamPos.x) * 0.05;
      currentCamPos.y += (targetCamPos.y - currentCamPos.y) * 0.05;
      
      camera.position.set(currentCamPos.x, currentCamPos.y, camera.position.z);
      camera.lookAt(0, 0.8, -0.5); // Always look toward the central sectional area

      // Layered Depth Parallax rotations (Foreground moves slightly faster than background)
      bgGroup.rotation.y = currentCamPos.x * 0.038;
      midGroup.rotation.y = currentCamPos.x * 0.07;
      fgGroup.rotation.y = currentCamPos.x * 0.125;

      renderer.render(scene, camera);
    };

    animate();

    // 12. RESPONSIVENESS
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);

      // Dispose Three geometries and materials to avoid memory leaks
      floorGeo.dispose();
      backWallGeo.dispose();
      leftWallNearGeo.dispose();
      leftWallFarGeo.dispose();
      artFrameGeo.dispose();
      artCanvasGeo.dispose();
      windowFrameGeo.dispose();
      windowHeaderGeo.dispose();
      rugGeo.dispose();
      cushion1Geo.dispose();
      cushion2Geo.dispose();
      cushion3Geo.dispose();
      backrestLGeo.dispose();
      backrestRGeo.dispose();
      armrestLGeo.dispose();
      tableTopGeo.dispose();
      legGeo.dispose();
      baseRingGeo.dispose();
      vaseGeo.dispose();
      bookGeo.dispose();
      lampBaseGeo.dispose();
      tubeGeo.dispose();
      shadeGeo.dispose();
      bulbGeo.dispose();
      potGeo.dispose();
      leafGeo.dispose();
      particleGeo.dispose();
      shaftGeo.dispose();

      woodFloorTexture.dispose();
      marbleTableTexture.dispose();
      fabricBumpTexture.dispose();
      dustTexture.dispose();
      artTexture.dispose();

      wallMaterial.dispose();
      floorMaterial.dispose();
      sofaMaterial.dispose();
      marbleMaterial.dispose();
      metalMaterial.dispose();
      brassMaterial.dispose();
      plantMaterial.dispose();
      rugMaterial.dispose();
      vaseMaterial.dispose();
      book1Material.dispose();
      bulbMat.dispose();
      potMat.dispose();
      particleMat.dispose();
      shaftMat.dispose();
      
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden select-none pointer-events-none">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Loading Placeholder */}
      {loading && (
        <div className="absolute inset-0 bg-[#161514] flex items-center justify-center transition-opacity duration-700">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <span className="absolute w-6 h-6 border border-gold rotate-45 animate-spin" />
            </div>
            <span className="text-[12px] uppercase tracking-[0.2em] text-champagne/80 font-light">
              Loading 3D Atmosphere...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
