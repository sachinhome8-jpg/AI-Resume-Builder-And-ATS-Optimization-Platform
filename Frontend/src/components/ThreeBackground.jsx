import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

const ThreeBackground = ({ particleCount = 75, interactive = true }) => {
    const containerRef = useRef(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        // ── Scene, Camera & Renderer ──
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            60,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        )
        camera.position.z = 220

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        })
        renderer.setSize(container.clientWidth, container.clientHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setClearColor(0x000000, 0)
        container.appendChild(renderer.domElement)

        // ── Particles & Positions ──
        const particlesData = []
        const positions = new Float32Array(particleCount * 3)
        const colors = new Float32Array(particleCount * 3)

        // Palette: Neon Magenta (#ff2d78) to Purple (#8b5cf6) to Cyan (#00f2fe)
        const colorPalette = [
            new THREE.Color('#ff2d78'),
            new THREE.Color('#a855f7'),
            new THREE.Color('#ec4899'),
            new THREE.Color('#38bdf8')
        ]

        const maxRange = 280
        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * maxRange - maxRange / 2
            const y = Math.random() * maxRange - maxRange / 2
            const z = Math.random() * maxRange - maxRange / 2

            positions[i * 3] = x
            positions[i * 3 + 1] = y
            positions[i * 3 + 2] = z

            const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)]
            colors[i * 3] = chosenColor.r
            colors[i * 3 + 1] = chosenColor.g
            colors[i * 3 + 2] = chosenColor.b

            particlesData.push({
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.45,
                    (Math.random() - 0.5) * 0.45,
                    (Math.random() - 0.5) * 0.45
                ),
                numConnections: 0
            })
        }

        // Particle Points Geometry
        const particlesGeometry = new THREE.BufferGeometry()
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

        // Circular glow point material
        const canvas = document.createElement('canvas')
        canvas.width = 16
        canvas.height = 16
        const ctx = canvas.getContext('2d')
        const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8)
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
        gradient.addColorStop(0.3, 'rgba(255, 45, 120, 0.8)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 16, 16)
        const pointTexture = new THREE.CanvasTexture(canvas)

        const pMaterial = new THREE.PointsMaterial({
            size: 6,
            map: pointTexture,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })

        const pointCloud = new THREE.Points(particlesGeometry, pMaterial)
        scene.add(pointCloud)

        // Connecting Lines
        const maxLines = particleCount * 4
        const linePositions = new Float32Array(maxLines * 6)
        const lineColors = new Float32Array(maxLines * 6)

        const linesGeometry = new THREE.BufferGeometry()
        linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage))
        linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage))

        const linesMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })

        const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial)
        scene.add(linesMesh)

        // Floating geometric shards in background
        const shardGeom1 = new THREE.IcosahedronGeometry(18, 0)
        const shardMat1 = new THREE.MeshBasicMaterial({
            color: 0xff2d78,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        })
        const shard1 = new THREE.Mesh(shardGeom1, shardMat1)
        shard1.position.set(-100, 50, -40)
        scene.add(shard1)

        const shardGeom2 = new THREE.OctahedronGeometry(24, 0)
        const shardMat2 = new THREE.MeshBasicMaterial({
            color: 0x8b5cf6,
            wireframe: true,
            transparent: true,
            opacity: 0.12
        })
        const shard2 = new THREE.Mesh(shardGeom2, shardMat2)
        shard2.position.set(110, -40, -50)
        scene.add(shard2)

        // ── Mouse Interaction ──
        const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
        const handleMouseMove = (e) => {
            if (!interactive) return
            const rect = container.getBoundingClientRect()
            mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1
            mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
        }

        window.addEventListener('mousemove', handleMouseMove, { passive: true })

        // ── Resize Handler ──
        const handleResize = () => {
            if (!container) return
            camera.aspect = container.clientWidth / container.clientHeight
            camera.updateProjectionMatrix()
            renderer.setSize(container.clientWidth, container.clientHeight)
        }

        window.addEventListener('resize', handleResize)

        // ── Animation Loop ──
        let animationFrameId
        const minDistance = 75

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate)

            // Smooth camera parallax
            mouse.x += (mouse.targetX - mouse.x) * 0.05
            mouse.y += (mouse.targetY - mouse.y) * 0.05
            camera.position.x = mouse.x * 20
            camera.position.y = mouse.y * 20
            camera.lookAt(scene.position)

            // Rotate background shards
            shard1.rotation.x += 0.003
            shard1.rotation.y += 0.005
            shard2.rotation.x -= 0.002
            shard2.rotation.y += 0.004

            let lineVertexCount = 0
            let colorIndex = 0

            // Update particle positions
            const posArray = particlesGeometry.attributes.position.array
            for (let i = 0; i < particleCount; i++) {
                const data = particlesData[i]

                posArray[i * 3] += data.velocity.x
                posArray[i * 3 + 1] += data.velocity.y
                posArray[i * 3 + 2] += data.velocity.z

                const limit = maxRange / 2
                if (posArray[i * 3] < -limit || posArray[i * 3] > limit) data.velocity.x *= -1
                if (posArray[i * 3 + 1] < -limit || posArray[i * 3 + 1] > limit) data.velocity.y *= -1
                if (posArray[i * 3 + 2] < -limit || posArray[i * 3 + 2] > limit) data.velocity.z *= -1

                // Connect nearby particles with glowing lines
                for (let j = i + 1; j < particleCount; j++) {
                    const dx = posArray[i * 3] - posArray[j * 3]
                    const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1]
                    const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2]
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

                    if (dist < minDistance && lineVertexCount < maxLines * 2) {
                        const alpha = 1.0 - dist / minDistance

                        linePositions[lineVertexCount * 3] = posArray[i * 3]
                        linePositions[lineVertexCount * 3 + 1] = posArray[i * 3 + 1]
                        linePositions[lineVertexCount * 3 + 2] = posArray[i * 3 + 2]

                        linePositions[(lineVertexCount + 1) * 3] = posArray[j * 3]
                        linePositions[(lineVertexCount + 1) * 3 + 1] = posArray[j * 3 + 1]
                        linePositions[(lineVertexCount + 1) * 3 + 2] = posArray[j * 3 + 2]

                        // Line colors fade with distance
                        lineColors[colorIndex++] = 1.0 * alpha
                        lineColors[colorIndex++] = 0.18 * alpha
                        lineColors[colorIndex++] = 0.47 * alpha

                        lineColors[colorIndex++] = 0.65 * alpha
                        lineColors[colorIndex++] = 0.33 * alpha
                        lineColors[colorIndex++] = 0.97 * alpha

                        lineVertexCount += 2
                    }
                }
            }

            particlesGeometry.attributes.position.needsUpdate = true
            linesGeometry.setDrawRange(0, lineVertexCount)
            linesGeometry.attributes.position.needsUpdate = true
            linesGeometry.attributes.color.needsUpdate = true

            renderer.render(scene, camera)
        }

        animate()

        // ── Cleanup ──
        return () => {
            cancelAnimationFrame(animationFrameId)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('resize', handleResize)

            particlesGeometry.dispose()
            pMaterial.dispose()
            linesGeometry.dispose()
            linesMaterial.dispose()
            shardGeom1.dispose()
            shardMat1.dispose()
            shardGeom2.dispose()
            shardMat2.dispose()
            renderer.dispose()

            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement)
            }
        }
    }, [particleCount, interactive])

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0.85
            }}
        />
    )
}

export default ThreeBackground
