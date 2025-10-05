import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 8, 15);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Label renderer
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
labelRenderer.domElement.style.pointerEvents = 'none';
document.getElementById('canvas-container').appendChild(labelRenderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 30;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(15, 5, 0);
sunLight.castShadow = true;
sunLight.shadow.camera.near = 0.1;
sunLight.shadow.camera.far = 50;
sunLight.shadow.camera.left = -10;
sunLight.shadow.camera.right = 10;
sunLight.shadow.camera.top = 10;
sunLight.shadow.camera.bottom = -10;
scene.add(sunLight);

// Background stars
const createStarfield = () => {
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
    opacity: 0.8
  });

  const starsVertices = [];
  for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;
    const z = (Math.random() - 0.5) * 200;
    starsVertices.push(x, y, z);
  }

  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
};
createStarfield();

// Texture loader
const textureLoader = new THREE.TextureLoader();

// Earth materials
let earthGroup, earthMesh, oceanMesh, atmosphereMesh;
let moon, sunSphere;
let tidalBulgeUniforms;

const createEarth = () => {
  earthGroup = new THREE.Group();

  // Load textures (using procedural textures as fallback)
  const earthTexture = textureLoader.load(
    'https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg',
    () => console.log('Earth texture loaded'),
    undefined,
    () => {
      console.log('Using procedural earth texture');
      const fallbackTexture = textureLoader.load(
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
        () => console.log('Fallback Earth texture loaded'),
        undefined,
        () => {
          earthTexture.image = createProceduralEarthTexture();
          earthTexture.needsUpdate = true;
        }
      );
      earthMesh.material.map = fallbackTexture;
    }
  );

  // Load bump/normal map for terrain detail
  const earthBumpMap = textureLoader.load(
    'https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png',
    () => console.log('Earth bump map loaded')
  );

  // Earth solid sphere
  const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
  const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
    bumpMap: earthBumpMap,
    bumpScale: 0.05,
    roughness: 0.7,
    metalness: 0.0,
    emissive: new THREE.Color(0x112244),
    emissiveIntensity: 0.1
  });
  earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  earthMesh.receiveShadow = true;
  earthMesh.castShadow = true;
  earthGroup.add(earthMesh);

  // Ocean layer with tidal deformation shader
  const oceanGeometry = new THREE.SphereGeometry(2.01, 128, 128);
  
  tidalBulgeUniforms = {
    time: { value: 0 },
    moonPosition: { value: new THREE.Vector3(5, 0, 0) },
    sunPosition: { value: new THREE.Vector3(15, 0, 0) },
    tideStrength: { value: 1.0 },
    sunInfluence: { value: 0.0 },
    oceanColor: { value: new THREE.Color(0x004d7a) }
  };

  const oceanMaterial = new THREE.ShaderMaterial({
    uniforms: tidalBulgeUniforms,
    vertexShader: document.getElementById('oceanVertexShader') ? 
      document.getElementById('oceanVertexShader').textContent : oceanVertexShader,
    fragmentShader: document.getElementById('oceanFragmentShader') ?
      document.getElementById('oceanFragmentShader').textContent : oceanFragmentShader,
    transparent: true,
    side: THREE.FrontSide,
    depthWrite: false,
    blending: THREE.NormalBlending
  });

  oceanMesh = new THREE.Mesh(oceanGeometry, oceanMaterial);
  earthGroup.add(oceanMesh);

  // Atmosphere glow
  const atmosphereGeometry = new THREE.SphereGeometry(2.12, 32, 32);
  const atmosphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
      lightPosition: { value: sunLight.position }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        float intensity = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        gl_FragColor = vec4(0.3, 0.6, 1.0, 0.6) * intensity;
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  });
  atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  earthGroup.add(atmosphereMesh);

  scene.add(earthGroup);
};

// Ocean shaders
const oceanVertexShader = `
  uniform float time;
  uniform vec3 moonPosition;
  uniform vec3 sunPosition;
  uniform float tideStrength;
  uniform float sunInfluence;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vTideHeight;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    
    // Calculate tidal bulge from Moon
    vec3 toMoon = normalize(moonPosition);
    float moonAlignment = dot(normalize(worldPos), toMoon);
    
    // Tidal force creates bulges on near and far sides
    float tidalEffect = moonAlignment * moonAlignment; // Quadratic for bulges on both sides
    
    // Add Sun's influence for spring/neap tides
    vec3 toSun = normalize(sunPosition);
    float sunAlignment = dot(normalize(worldPos), toSun);
    float sunTidalEffect = sunAlignment * sunAlignment;
    
    float combinedTide = tidalEffect + sunTidalEffect * sunInfluence * 0.5;
    
    // Wave animation
    float wave = sin(time * 2.0 + worldPos.x * 3.0) * 0.01 +
                 cos(time * 1.5 + worldPos.z * 3.0) * 0.01;
    
    float displacement = combinedTide * 0.15 * tideStrength + wave;
    vTideHeight = displacement;
    
    vec3 newPosition = position + normal * displacement;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const oceanFragmentShader = `
  uniform vec3 oceanColor;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vTideHeight;

  void main() {
    vec3 lightDir = normalize(vec3(1.0, 0.5, 0.5));
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    // Color based on tide height - more subtle blue
    vec3 deepOcean = vec3(0.0, 0.15, 0.35);
    vec3 shallowOcean = vec3(0.1, 0.3, 0.5);
    vec3 color = mix(deepOcean, shallowOcean, vTideHeight * 5.0 + 0.5);
    
    color = color * (0.5 + diff * 0.5);
    
    // Fresnel effect for ocean shine
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);
    color += vec3(fresnel * 0.2);
    
    // Much more transparent ocean so land shows through
    float alpha = 0.4 + vTideHeight * 0.2;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

// Create Moon
const createMoon = () => {
  const moonTexture = textureLoader.load(
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg',
    () => console.log('Moon texture loaded'),
    undefined,
    () => {
      console.log('Using procedural moon texture');
    }
  );

  const moonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const moonMaterial = new THREE.MeshStandardMaterial({
    map: moonTexture,
    roughness: 1.0,
    metalness: 0.0
  });
  moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moon.position.set(5, 0, 0);
  moon.castShadow = true;
  moon.receiveShadow = true;
  scene.add(moon);

  // Add label
  const moonLabel = createLabel('Moon', moon, new THREE.Vector3(0, 0.8, 0));
};

// Create Sun
const createSun = () => {
  const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    emissive: 0xffaa00,
    emissiveIntensity: 1
  });
  sunSphere = new THREE.Mesh(sunGeometry, sunMaterial);
  sunSphere.position.copy(sunLight.position);
  
  // Add glow
  const glowGeometry = new THREE.SphereGeometry(2.0, 32, 32);
  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        gl_FragColor = vec4(1.0, 0.8, 0.0, 1.0) * intensity;
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  sunSphere.add(glow);
  
  sunSphere.visible = false;
  scene.add(sunSphere);
};

// Gravitational force visualization
let gravityArrow;
const createGravityArrow = () => {
  const arrowLength = 3;
  const dir = new THREE.Vector3(1, 0, 0);
  const origin = new THREE.Vector3(0, 0, 0);
  gravityArrow = new THREE.ArrowHelper(dir, origin, arrowLength, 0x00ff00, 0.5, 0.3);
  scene.add(gravityArrow);
};

// Labels
const createLabel = (text, parent, offset = new THREE.Vector3()) => {
  const div = document.createElement('div');
  div.className = 'label';
  div.textContent = text;
  div.style.color = '#4FC3F7';
  div.style.fontSize = '14px';
  div.style.fontWeight = 'bold';
  div.style.textShadow = '0 0 5px rgba(0,0,0,0.8)';
  div.style.pointerEvents = 'none';
  
  const label = new CSS2DObject(div);
  label.position.copy(offset);
  parent.add(label);
  return label;
};

// Tide labels
let tideLabels = [];
const createTideLabels = () => {
  const labelPositions = [
    { text: 'High Tide', angle: 0, color: '#FF6B6B' },
    { text: 'Low Tide', angle: Math.PI / 2, color: '#4ECDC4' },
    { text: 'High Tide', angle: Math.PI, color: '#FF6B6B' },
    { text: 'Low Tide', angle: Math.PI * 1.5, color: '#4ECDC4' }
  ];

  labelPositions.forEach(({ text, angle, color }) => {
    const div = document.createElement('div');
    div.textContent = text;
    div.style.color = color;
    div.style.fontSize = '12px';
    div.style.fontWeight = 'bold';
    div.style.padding = '4px 8px';
    div.style.background = 'rgba(0,0,0,0.7)';
    div.style.borderRadius = '4px';
    div.style.pointerEvents = 'none';

    const label = new CSS2DObject(div);
    const radius = 2.5;
    label.position.set(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    );
    earthGroup.add(label);
    tideLabels.push({ label, baseAngle: angle });
  });
};

// Procedural textures (fallback)
const createProceduralEarthTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  
  // Ocean base
  ctx.fillStyle = '#0a4d7a';
  ctx.fillRect(0, 0, 1024, 1024);
  
  // Add ocean depth variation
  const gradient = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
  gradient.addColorStop(0, 'rgba(30, 100, 150, 0.5)');
  gradient.addColorStop(1, 'rgba(10, 40, 80, 0.8)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 1024);
  
  // Create more realistic continents
  const continents = [
    // Africa
    { x: 512, y: 512, size: 120, color: '#3d5a2c' },
    // Americas
    { x: 200, y: 400, size: 100, color: '#4a6b35' },
    { x: 180, y: 600, size: 90, color: '#3d5a2c' },
    // Europe
    { x: 550, y: 350, size: 60, color: '#4a6b35' },
    // Asia
    { x: 750, y: 380, size: 140, color: '#3d5a2c' },
    // Australia
    { x: 850, y: 650, size: 70, color: '#4a6b35' },
    // Antarctica
    { x: 512, y: 950, size: 150, color: '#e8e8e8' },
    // Greenland
    { x: 350, y: 150, size: 50, color: '#c8d8e8' }
  ];
  
  continents.forEach(continent => {
    // Draw irregular landmasses
    ctx.fillStyle = continent.color;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const variance = 0.6 + Math.random() * 0.8;
      const x = continent.x + Math.cos(angle) * continent.size * variance;
      const y = continent.y + Math.sin(angle) * continent.size * variance;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    
    // Add some darker spots (forests/mountains)
    ctx.fillStyle = '#2d4520';
    for (let i = 0; i < 3; i++) {
      const offsetX = (Math.random() - 0.5) * continent.size;
      const offsetY = (Math.random() - 0.5) * continent.size;
      ctx.beginPath();
      ctx.arc(continent.x + offsetX, continent.y + offsetY, continent.size * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  
  // Add cloud-like texture for variation
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 100; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 30, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;
  
  return canvas;
};

// Mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDragging = false;
let dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

const onMouseDown = (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(moon);

  if (intersects.length > 0) {
    isDragging = true;
    controls.enabled = false;
  }
};

const onMouseMove = (event) => {
  if (!isDragging) return;

  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersectPoint = new THREE.Vector3();
  raycaster.ray.intersectPlane(dragPlane, intersectPoint);

  if (intersectPoint) {
    // Keep moon at current distance
    const distance = moon.position.length();
    intersectPoint.normalize().multiplyScalar(distance);
    moon.position.copy(intersectPoint);
    updateTidalForces();
  }
};

const onMouseUp = () => {
  isDragging = false;
  controls.enabled = true;
};

// Touch support
const onTouchStart = (event) => {
  if (event.touches.length === 1) {
    const touch = event.touches[0];
    onMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
  }
};

const onTouchMove = (event) => {
  if (event.touches.length === 1) {
    const touch = event.touches[0];
    onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    event.preventDefault();
  }
};

const onTouchEnd = () => {
  onMouseUp();
};

// Event listeners
renderer.domElement.addEventListener('mousedown', onMouseDown);
renderer.domElement.addEventListener('mousemove', onMouseMove);
renderer.domElement.addEventListener('mouseup', onMouseUp);
renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: false });
renderer.domElement.addEventListener('touchend', onTouchEnd);

// Update tidal forces
const updateTidalForces = () => {
  tidalBulgeUniforms.moonPosition.value.copy(moon.position);
  
  // Update gravity arrow
  const direction = moon.position.clone().normalize();
  gravityArrow.setDirection(direction);
  gravityArrow.position.copy(direction.clone().multiplyScalar(2.2));
  
  // Update tide labels rotation
  const moonAngle = Math.atan2(moon.position.z, moon.position.x);
  tideLabels.forEach((item, index) => {
    const angle = moonAngle + item.baseAngle;
    const radius = 2.5;
    item.label.position.set(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    );
  });
};

// UI Controls
let isOrbiting = false;
let orbitAngle = 0;
let showSun = false;
let earthRotationSpeed = 0.3;

document.getElementById('orbitToggle').addEventListener('click', (e) => {
  isOrbiting = !isOrbiting;
  e.target.textContent = isOrbiting ? 'Stop Moon Orbit' : 'Start Moon Orbit';
  e.target.classList.toggle('active');
});

document.getElementById('sunToggle').addEventListener('click', (e) => {
  showSun = !showSun;
  sunSphere.visible = showSun;
  tidalBulgeUniforms.sunInfluence.value = showSun ? 1.0 : 0.0;
  e.target.classList.toggle('active');
});

document.getElementById('moonDistance').addEventListener('input', (e) => {
  const distance = parseFloat(e.target.value);
  document.getElementById('distanceValue').textContent = distance.toFixed(1);
  const currentDirection = moon.position.clone().normalize();
  moon.position.copy(currentDirection.multiplyScalar(distance));
  updateTidalForces();
});

document.getElementById('tideStrength').addEventListener('input', (e) => {
  const strength = parseFloat(e.target.value);
  document.getElementById('tideValue').textContent = strength.toFixed(1);
  tidalBulgeUniforms.tideStrength.value = strength;
});

document.getElementById('rotationSpeed').addEventListener('input', (e) => {
  earthRotationSpeed = parseFloat(e.target.value);
  document.getElementById('rotationValue').textContent = earthRotationSpeed.toFixed(1);
});

// Window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
const clock = new THREE.Clock();

const animate = () => {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  // Update time uniform for ocean waves
  tidalBulgeUniforms.time.value = elapsed;

  // Earth rotation
  if (earthGroup) {
    earthGroup.rotation.y += delta * earthRotationSpeed * 0.1;
  }

  // Moon orbit
  if (isOrbiting && moon) {
    orbitAngle += delta * 0.3;
    const distance = moon.position.length();
    moon.position.x = Math.cos(orbitAngle) * distance;
    moon.position.z = Math.sin(orbitAngle) * distance;
    updateTidalForces();
  }

  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
};

// Initialize scene
const init = async () => {
  createEarth();
  createMoon();
  createSun();
  createGravityArrow();
  createTideLabels();
  updateTidalForces();
  
  // Hide loading message
  document.getElementById('loading').style.display = 'none';
  
  animate();
};

init();
