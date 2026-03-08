import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function FloatingRing({ position, rotationSpeed, scale }) {
    const meshRef = useRef()
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        meshRef.current.rotation.x = t * rotationSpeed[0]
        meshRef.current.rotation.y = t * rotationSpeed[1]
        meshRef.current.rotation.z = t * rotationSpeed[2]
        meshRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.3
    })
    return (
        <mesh ref={meshRef} position={position} scale={scale}>
            <torusGeometry args={[1, 0.05, 16, 100]} />
            <meshStandardMaterial color="#C9A84C" metalness={0.9} roughness={0.15} />
        </mesh>
    )
}

function FloatingDiamond({ position, rotationSpeed, scale }) {
    const meshRef = useRef()
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        meshRef.current.rotation.x = t * rotationSpeed[0]
        meshRef.current.rotation.y = t * rotationSpeed[1]
        meshRef.current.position.y = position[1] + Math.sin(t * 0.7 + 1) * 0.2
    })
    return (
        <mesh ref={meshRef} position={position} scale={scale}>
            <octahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial color="#E2C97E" metalness={0.85} roughness={0.2} wireframe />
        </mesh>
    )
}

function FloatingSphere({ position, rotationSpeed, scale }) {
    const meshRef = useRef()
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        meshRef.current.rotation.y = t * rotationSpeed[1]
        meshRef.current.position.y = position[1] + Math.sin(t * 0.3 + 2) * 0.4
        meshRef.current.position.x = position[0] + Math.cos(t * 0.2) * 0.1
    })
    return (
        <mesh ref={meshRef} position={position} scale={scale}>
            <icosahedronGeometry args={[0.6, 1]} />
            <meshStandardMaterial color="#9B7E33" metalness={0.9} roughness={0.1} wireframe />
        </mesh>
    )
}

function GoldParticles() {
    const count = 120
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 16
            pos[i * 3 + 1] = (Math.random() - 0.5) * 10
            pos[i * 3 + 2] = (Math.random() - 0.5) * 8
        }
        return pos
    }, [])

    const ref = useRef()
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        const arr = ref.current.geometry.attributes.position.array
        for (let i = 0; i < count; i++) {
            arr[i * 3 + 1] += Math.sin(t + i) * 0.001
        }
        ref.current.geometry.attributes.position.needsUpdate = true
    })

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial color="#C9A84C" size={0.03} transparent opacity={0.6} sizeAttenuation />
        </points>
    )
}

export default function ThreeScene() {
    return (
        <div className="absolute inset-0 z-10 pointer-events-none" style={{ opacity: 0.7 }}>
            <Canvas
                camera={{ position: [0, 0, 6], fov: 60 }}
                gl={{ alpha: true, antialias: true }}
                style={{ background: 'transparent' }}
                dpr={[1, 1.5]}
            >
                <ambientLight intensity={0.3} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} color="#E2C97E" />
                <pointLight position={[-3, -2, 3]} intensity={0.5} color="#C9A84C" />

                <FloatingRing position={[2.5, 0.5, 0]} rotationSpeed={[0.3, 0.5, 0.1]} scale={0.8} />
                <FloatingRing position={[-3, -1, -1]} rotationSpeed={[0.2, -0.4, 0.15]} scale={0.5} />
                <FloatingDiamond position={[-1.5, 1.5, 0.5]} rotationSpeed={[0.4, 0.3]} scale={0.6} />
                <FloatingDiamond position={[3, -1.5, -0.5]} rotationSpeed={[-0.3, 0.5]} scale={0.4} />
                <FloatingSphere position={[0, -0.5, 1]} rotationSpeed={[0.2, 0.3]} scale={0.5} />
                <GoldParticles />
            </Canvas>
        </div>
    )
}
