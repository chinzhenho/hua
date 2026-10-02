// Flower studio: builds each bloom from real 3D petals, lights it softly and
// renders it to a transparent image. Run `npm run flowers` to regenerate the
// sprites in src/assets/flowers (the website itself never loads three.js).
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

const TONES = {
  pink: ['#CF7F8B', '#ECB0B8', '#F9DADC'],
  blush: ['#DFA3AA', '#F4CDD0', '#FDEDEC'],
  cream: ['#D9BE93', '#F1E0C2', '#FCF4E6'],
  ivory: ['#DCCDB9', '#F3EBDF', '#FFFDF9'],
}

const lerp = (a, b, t) => a + (b - a) * t
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x))
const smooth = (t) => t * t * (3 - 2 * t)

function rng(seed) {
  let s = seed >>> 0
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
}

// width profile of a petal along its length (v: 0 base → 1 tip)
const PROFILES = {
  round: (v) => (v < 0.5 ? 0.45 + 0.55 * Math.sin(Math.PI * v) : Math.sqrt(clamp(1 - Math.pow((v - 0.5) / 0.5, 2.2)))),
  pointed: (v) => Math.pow(Math.sin(Math.PI * v), 0.85) * (1 - 0.25 * v),
  strap: (v) => clamp(v / 0.08) * 0.85 * Math.sqrt(clamp(1 - Math.pow(clamp((v - 0.82) / 0.18), 2))) + 0.15 * (1 - v),
  fan: (v) => 0.18 + 0.82 * Math.sin(Math.PI * 0.5 * Math.pow(v, 0.7)),
  orchid: (v) => Math.pow(Math.sin(Math.PI * (0.05 + 0.95 * v)), 0.55),
}

/**
 * One petal: base at the origin, length along +y, inner face toward +z.
 * cup: curl across the width   bend: curve along the length (toward inside)
 * tipCurl: tip rolls outward   roll: edges roll back   frill: ruffled edge (carnation)
 */
function petalGeometry(o, colors, rand) {
  const { L, W, profile = 'round', cup = 0.6, bend = 0.2, tipCurl = 0, roll = 0, frill = 0, segU = 14, segV = 18 } = o
  const prof = PROFILES[profile]
  const pos = []
  const col = []
  const idx = []
  const c0 = new THREE.Color(colors[0])
  const c1 = new THREE.Color(colors[1])
  const c2 = new THREE.Color(colors[2])
  const wob = rand() * 10
  for (let j = 0; j <= segV; j++) {
    const v = j / segV
    let w = W * prof(v)
    if (frill) w *= 1 + 0.06 * Math.sin(v * 9 + wob)
    for (let i = 0; i <= segU; i++) {
      const u = -1 + (2 * i) / segU
      const x = u * w
      let y = v * L
      let z = cup * u * u * w * 0.9 + bend * v * v * L
      if (tipCurl) z -= tipCurl * Math.pow(clamp((v - 0.62) / 0.38), 2) * L * 0.32
      if (roll) z -= roll * Math.pow(clamp((Math.abs(u) - 0.6) / 0.4), 2) * clamp((v - 0.35) / 0.65) * L * 0.22
      if (frill) {
        z += frill * Math.sin(u * 13 + wob) * Math.pow(v, 2.4) * L * 0.07
        y += frill * Math.abs(Math.sin(u * 17 + wob)) * Math.pow(v, 5) * L * -0.09
      }
      // a soft natural wave
      z += Math.sin(u * 3 + wob) * 0.02 * L * v
      pos.push(x, y, z)
      // colour: deeper at the base, lighter at the rim, with a little variation
      const t = smooth(clamp(v * 1.1))
      const c = t < 0.5 ? c0.clone().lerp(c1, t * 2) : c1.clone().lerp(c2, (t - 0.5) * 2)
      const edge = Math.pow(Math.abs(u), 4) * 0.25 * v
      c.lerp(c2, edge)
      col.push(c.r, c.g, c.b)
    }
  }
  const row = segU + 1
  for (let j = 0; j < segV; j++)
    for (let i = 0; i < segU; i++) {
      const a = j * row + i
      idx.push(a, a + 1, a + row, a + 1, a + row + 1, a + row)
    }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

/**
 * A petal that wraps around the flower's axis, like a section of a cup.
 * Successive petals sit on slightly larger shells, so they nest instead of crossing.
 */
function shellGeometry(o, colors, rand) {
  const { rb, L, phi0, phi1, span, theta, roll = 0, tipCurl = 0, frill = 0, profile = 'round', segU = 34, segV = 30 } = o
  const prof = PROFILES[profile]
  const pos = [], col = [], idx = []
  const c0 = new THREE.Color(colors[0]), c1 = new THREE.Color(colors[1]), c2 = new THREE.Color(colors[2])
  const wob = rand() * 10
  let r = rb, y = 0, vPrev = 0
  for (let j = 0; j <= segV; j++) {
    const v = Math.sin(((j / segV) * Math.PI) / 2)
    const dv = v - vPrev
    vPrev = v
    let phi = phi0 + (phi1 - phi0) * Math.pow(v, 1.6) + tipCurl * smooth(clamp((v - 0.55) / 0.45)) * deg(55)
    if (j > 0) {
      r += Math.sin(phi) * L * dv
      y += Math.cos(phi) * L * dv
    }
    const half = (span / 2) * prof(v)
    for (let i = 0; i <= segU; i++) {
      const u = -1 + (2 * i) / segU
      const a = theta + u * half
      let rr = r, yy = y
      if (roll) {
        const e = Math.pow(clamp((Math.abs(u) - 0.6) / 0.4), 2) * clamp((v - 0.3) / 0.7)
        rr += roll * e * L * 0.22
        yy -= roll * e * L * 0.08
      }
      if (frill) {
        rr += frill * Math.sin(u * 22 + wob) * Math.pow(v, 2.2) * L * 0.06
        yy -= frill * Math.abs(Math.sin(u * 26 + wob)) * Math.pow(v, 4) * L * 0.08
      }
      rr += (Math.sin(u * 2.5 + wob) * 0.025 + Math.sin(v * 7 + u * 1.5 + wob) * 0.012) * L * v
      pos.push(rr * Math.cos(a), yy, rr * Math.sin(a))
      const t = smooth(clamp(v * 1.08))
      const c = t < 0.5 ? c0.clone().lerp(c1, t * 2) : c1.clone().lerp(c2, (t - 0.5) * 2)
      c.lerp(c2, Math.pow(Math.abs(u), 4) * 0.3 * v)
      const ao = 0.62 + 0.38 * smooth(clamp(v / 0.45))
      c.multiplyScalar(ao * (0.97 + 0.06 * Math.sin(u * 4 + wob)))
      col.push(c.r, c.g, c.b)
    }
  }
  const row = segU + 1
  for (let j = 0; j < segV; j++)
    for (let i = 0; i < segU; i++) {
      const a = j * row + i
      idx.push(a, a + 1, a + row, a + 1, a + row + 1, a + row)
    }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

function addShell(group, opts, colors, rand) {
  const m = new THREE.Mesh(shellGeometry(opts, colors, rand), group.userData.mat)
  m.castShadow = true
  m.receiveShadow = true
  group.add(m)
}

const UP = new THREE.Vector3(0, 1, 0)
// place a petal around the flower's axis: azimuth theta, opening phi (0 upright → 90° flat)
function placePetal(mesh, theta, phi, r0, h0) {
  const R = new THREE.Vector3(Math.cos(theta), 0, Math.sin(theta))
  const Y = UP.clone().multiplyScalar(Math.cos(phi)).add(R.clone().multiplyScalar(Math.sin(phi)))
  const Z = UP.clone().multiplyScalar(Math.sin(phi)).sub(R.clone().multiplyScalar(Math.cos(phi)))
  const X = new THREE.Vector3().crossVectors(Y, Z)
  mesh.matrix.makeBasis(X, Y, Z)
  mesh.matrix.setPosition(R.multiplyScalar(r0).add(UP.clone().multiplyScalar(h0)))
  mesh.matrixAutoUpdate = false
}

function material() {
  return new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    roughness: 0.62,
    metalness: 0,
    sheen: 0.7,
    sheenRoughness: 0.55,
    sheenColor: new THREE.Color('#ffffff'),
  })
}

function addPetal(group, opts, colors, rand, theta, phi, r0, h0) {
  const m = new THREE.Mesh(petalGeometry(opts, colors, rand), group.userData.mat)
  m.castShadow = true
  m.receiveShadow = true
  placePetal(m, theta, phi, r0, h0)
  group.add(m)
}

const GA = (137.508 * Math.PI) / 180
const deg = (d) => (d * Math.PI) / 180

const BUILDERS = {
  rose(g, col, rand, n = 38) {
    for (let k = 0; k < n; k++) {
      const t = k / (n - 1)
      addShell(
        g,
        {
          rb: lerp(0.012, 0.085, t),
          L: lerp(0.26, 0.8, Math.pow(t, 0.75)) * (0.95 + rand() * 0.1),
          phi0: deg(lerp(1, 30, Math.pow(t, 1.3))),
          phi1: deg(lerp(6, 72, Math.pow(t, 1.15))),
          span: deg(lerp(230, 118, Math.pow(t, 0.8))),
          theta: k * GA,
          roll: lerp(0, 1.25, Math.pow(t, 1.3)),
          tipCurl: lerp(0, 0.75, Math.pow(t, 2)),
        },
        col,
        rand,
      )
    }
  },
  ranunculus(g, col, rand) {
    const n = 84
    for (let k = 0; k < n; k++) {
      const t = k / (n - 1)
      addShell(
        g,
        {
          rb: lerp(0.008, 0.07, t),
          L: lerp(0.14, 0.66, Math.pow(t, 0.85)),
          phi0: deg(lerp(0, 32, t)),
          phi1: deg(lerp(6, 66, t)),
          span: deg(lerp(170, 92, t)),
          theta: k * GA,
          segU: 20,
          segV: 12,
        },
        col,
        rand,
      )
    }
  },
  spray(g, col, rand) {
    BUILDERS.rose(g, col, rand, 20)
  },
  carnation(g, col, rand) {
    const n = 44
    for (let k = 0; k < n; k++) {
      const t = k / (n - 1)
      addShell(
        g,
        {
          rb: lerp(0.02, 0.08, t),
          L: lerp(0.3, 0.8, Math.pow(t, 0.8)),
          phi0: deg(lerp(8, 46, t)),
          phi1: deg(lerp(30, 98, t)),
          span: deg(lerp(140, 96, t)),
          theta: k * GA,
          profile: 'fan',
          frill: 0.55,
          segU: 40,
          segV: 14,
        },
        col,
        rand,
      )
    }
  },
  gerbera(g, col, rand) {
    // two rows of slim ray petals
    ;[[26, 84, 0.98], [26, 76, 0.9]].forEach(([n, ph, len], row) => {
      for (let k = 0; k < n; k++) {
        addPetal(
          g,
          { L: len * (0.96 + rand() * 0.08), W: 0.085, profile: 'strap', cup: 0.35, bend: -0.06, segU: 6, segV: 14 },
          row ? col : [col[1], col[1], col[2]],
          rand,
          ((k + row * 0.5) / n) * Math.PI * 2,
          deg(ph + (rand() - 0.5) * 6),
          0.2,
          0.02 + row * 0.01,
        )
      }
    })
    // short inner crest of florets
    for (let k = 0; k < 34; k++)
      addPetal(g, { L: 0.11, W: 0.04, profile: 'strap', cup: 0.3, segU: 4, segV: 6 }, [col[0], col[1], col[2]], rand, (k / 34) * Math.PI * 2, deg(55), 0.17, 0.035)
    // centre disk
    const disk = new THREE.Mesh(new THREE.SphereGeometry(0.19, 32, 16), new THREE.MeshStandardMaterial({ color: '#CDC596', roughness: 0.95 }))
    disk.scale.set(1, 0.3, 1)
    disk.position.y = 0.04
    disk.castShadow = disk.receiveShadow = true
    g.add(disk)
    const dotMat = new THREE.MeshStandardMaterial({ color: '#A97C68', roughness: 0.9 })
    for (let k = 0; k < 140; k++) {
      const a = k * GA
      const r = 0.02 + 0.15 * Math.sqrt(k / 140)
      const d = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 6), k < 40 ? new THREE.MeshStandardMaterial({ color: '#BDB98A' }) : dotMat)
      d.position.set(Math.cos(a) * r, 0.044 + 0.057 * Math.sqrt(Math.max(0, 1 - (r / 0.19) ** 2)), Math.sin(a) * r)
      g.add(d)
    }
  },
  dahlia(g, col, rand) {
    const rings = [[18, 90, 0.64], [16, 80, 0.58], [14, 68, 0.5], [12, 54, 0.42], [9, 38, 0.32], [6, 20, 0.22]]
    rings.forEach(([n, ph, L], ri) => {
      for (let k = 0; k < n; k++)
        addPetal(
          g,
          { L: L * (0.95 + rand() * 0.1), W: L * 0.32, profile: 'pointed', cup: 0.9, bend: 0.06, segU: 10, segV: 12 },
          [col[1], col[2], col[2]],
          rand,
          ((k + (ri % 2) * 0.5) / n) * Math.PI * 2 + ri * 0.13,
          deg(ph),
          0.06 + ri * -0.005,
          ri * 0.012,
        )
    })
  },
  orchid(g, col, rand) {
    // dorsal sepal up, two lateral sepals down, two broad petals left/right, small lip
    ;[[270, 0.6, 0.26], [40, 0.58, 0.24], [140, 0.58, 0.24]].forEach(([a, L, W]) =>
      addPetal(g, { L, W, profile: 'orchid', cup: 0.3, bend: -0.06, segU: 12, segV: 14 }, col, rand, deg(a), deg(86), 0.02, 0),
    )
    ;[[195], [345]].forEach(([a]) =>
      addPetal(g, { L: 0.62, W: 0.62, profile: 'orchid', cup: 0.22, bend: -0.05, segU: 16, segV: 16 }, [col[1], col[2], col[2]], rand, deg(a), deg(83), 0.02, 0.012),
    )
    addPetal(g, { L: 0.2, W: 0.12, profile: 'round', cup: 0.9, bend: 0.1 }, ['#E2A6AE', '#F1C9CD', '#FAE4E5'], rand, deg(90), deg(78), 0.02, 0.03)

  },
}

export function buildFlower(type, tone, seed = 1) {
  const g = new THREE.Group()
  g.userData.mat = material()
  const col = type === 'orchid' ? TONES.ivory : TONES[tone]
  BUILDERS[type](g, col, rng(seed))
  return g
}

export function makeStage(size = 640) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
  renderer.setPixelRatio(1)
  renderer.setSize(size, size)
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 0.95
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const scene = new THREE.Scene()
  scene.add(new THREE.HemisphereLight('#FFF6F0', '#9C726F', 0.5))
  const key = new THREE.DirectionalLight('#FFF4EA', 3.9)
  key.position.set(-1.6, 3, 2)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  key.shadow.radius = 6
  key.shadow.bias = -0.0008
  key.shadow.normalBias = 0.01
  Object.assign(key.shadow.camera, { left: -1.4, right: 1.4, top: 1.4, bottom: -1.4, near: 0.1, far: 10 })
  scene.add(key)
  const fill = new THREE.DirectionalLight('#FBE3E3', 0.7)
  fill.position.set(2, 1, 1.5)
  scene.add(fill)
  const rim = new THREE.DirectionalLight('#FFFFFF', 0.5)
  rim.position.set(0, 1.5, -2.5)
  scene.add(rim)

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50)
  const front = new THREE.PointLight('#FFF1EE', 6, 0, 1.2)
  camera.add(front)
  scene.add(camera)
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const ao = new GTAOPass(scene, camera, size, size)
  ao.blendIntensity = 0.75
  ao.updateGtaoMaterial({ radius: 0.12, distanceExponent: 1.6, thickness: 1.2, scale: 1.4, samples: 16 })
  ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 })
  composer.addPass(ao)
  composer.addPass(new OutputPass())
  return { renderer, scene, camera, composer }
}

/** view: 'front' (looking into the bloom) | 'side' (tilted, showing its depth) */
export function render(stage, type, tone, view, seed) {
  const { renderer, scene, camera } = stage
  const flower = buildFlower(type, tone, seed)
  flower.rotation.y = seed * 0.7
  scene.add(flower)
  const elev = view === 'front' ? 74 : 50
  const dist = 5.2
  camera.position.set(0, Math.sin(deg(elev)) * dist, Math.cos(deg(elev)) * dist)
  camera.lookAt(0, type === 'orchid' ? 0.02 : 0.12, 0)
  // colour pass with ambient occlusion, over the page's cream
  scene.background = new THREE.Color('#FBF6EE')
  stage.composer.render()
  const color = renderer.domElement.toDataURL('image/png')
  // silhouette pass for the alpha mask
  scene.background = new THREE.Color('#000000')
  scene.overrideMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide })
  const tm = renderer.toneMapping
  renderer.toneMapping = THREE.NoToneMapping
  renderer.render(scene, camera)
  const mask = renderer.domElement.toDataURL('image/png')
  renderer.toneMapping = tm
  scene.overrideMaterial = null
  scene.background = null
  const url = [color, mask]
  scene.remove(flower)
  flower.traverse((o) => o.geometry?.dispose())
  return url
}
