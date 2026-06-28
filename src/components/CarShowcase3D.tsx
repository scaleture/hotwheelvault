'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei'
import { Suspense, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three'

function CarModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  
  // Enable shadows on all child meshes of the loaded model
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })

  // Calculate layout parameters once to prevent incremental drift on re-renders
  const { center, scaleMultiplier, bottomY } = useMemo(() => {
    // 1. Reset scene scale and position so calculations start clean
    scene.position.set(0, 0, 0)
    scene.scale.set(1, 1, 1)
    scene.rotation.set(0, 0, 0)

    // 2. Compute bounding box of the raw unrotated scene
    const box = new THREE.Box3().setFromObject(scene)
    const center = new THREE.Vector3()
    box.getCenter(center)
    const size = new THREE.Vector3()
    box.getSize(size)

    // 3. Since we will rotate 180 deg on X, Y remains the vertical axis
    const rotatedHeight = size.y
    const maxDim = Math.max(size.x, size.y, size.z)
    
    // Normalize model size to 3.2 units long
    const scaleMultiplier = 3.2 / maxDim
    
    // Compute exact position to sit bottom of wheels on the floor (Y = -1.0)
    const bottomY = -1.0 + (rotatedHeight / 2) * scaleMultiplier

    return { center, scaleMultiplier, bottomY }
  }, [scene])

  // Pure, declarative rendering using nested groups:
  // - Outer group scales the model and positions it sitting on the shadow floor.
  // - Middle group rotates the model around its center to flip it right-side up (180 deg around X).
  // - Primitive handles the centering shift on raw unrotated axes.
  return (
    <group scale={scaleMultiplier} position={[0, bottomY, 0]}>
      <group rotation={[Math.PI, 0, Math.PI]}>
        <primitive object={scene} position={[-center.x, -center.y, -center.z]} />
      </group>
    </group>
  )
}

const CAR_MODELS = [
  { id: 'splittin-image-2', label: "Splittin' Image II", url: '/models/hot_wheels_-_splittin_image_2.glb' },
  { id: 'revuelto', label: 'Lamborghini Revuelto', url: '/models/lamborghini_revuelto_grays_widebody.glb' },
  { id: 'saleen-s7', label: 'Saleen S7', url: '/models/2005_saleen_s7_twin_turbo.glb' },
  { id: 'asterion', label: 'Lamborghini Asterion', url: '/models/2014_lamborghini_asterion_lpi910-4_concept.glb' },
]

export default function CarShowcase3D() {
  const [activeModel, setActiveModel] = useState(CAR_MODELS[0])

  return (
    // RULE: All HTML is OUTSIDE Canvas
    <div className="relative w-full h-[320px] sm:h-[520px] bg-white border border-gray-200 shadow-sm">
      
      {/* Model selector buttons — OUTSIDE Canvas */}
      <div className="absolute top-4 left-4 z-10 flex gap-2 overflow-x-auto max-w-[calc(100%-2rem)] pb-1">
        {CAR_MODELS.map(car => (
          <button
            key={car.id}
            onClick={() => setActiveModel(car)}
            className={`px-3 py-1 text-[10px] sm:text-xs font-['Barlow_Condensed'] font-bold 
              tracking-widest uppercase transition-all whitespace-nowrap
              ${activeModel.id === car.id 
                ? 'bg-[#FF3D00] text-white' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            {car.label}
          </button>
        ))}
      </div>

      {/* Hint text — OUTSIDE Canvas */}
      <div className="hidden sm:block absolute bottom-4 right-4 z-10 text-gray-400 text-xs 
        tracking-widest uppercase font-['Barlow_Condensed']">
        Drag to rotate · Scroll to zoom
      </div>

      {/* Canvas container wrapped with motion.div, and Three.js primitives ONLY inside Canvas */}
      <motion.div 
        className="w-full h-full relative z-0" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Canvas camera={{ position: [0, 2, 20], fov: 30 }} shadows>
          <ambientLight intensity={0.4} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
            color="#FF3D00"
            castShadow
          />
          <spotLight
            position={[-10, 5, -5]}
            angle={0.2}
            intensity={1}
            color="#FFD700"
          />
          <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" />

          <Suspense fallback={null}>
            <CarModel url={activeModel.url} />
            <Environment preset="night" />
            <ContactShadows
              position={[0, -1, 0]}
              opacity={0.6}
              scale={12}
              blur={2.5}
              far={10}
              color="#FF3D00"
            />
          </Suspense>

          <OrbitControls
            enableZoom={true}
            autoRotate
            autoRotateSpeed={2.5}
            minDistance={1}
            maxDistance={30}
          />
        </Canvas>
      </motion.div>
    </div>
  )
}

useGLTF.preload('/models/hot_wheels_-_splittin_image_2.glb')
useGLTF.preload('/models/lamborghini_revuelto_grays_widebody.glb')
useGLTF.preload('/models/2005_saleen_s7_twin_turbo.glb')
useGLTF.preload('/models/2014_lamborghini_asterion_lpi910-4_concept.glb')
