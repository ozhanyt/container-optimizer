import React, { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import ContainerMesh from './ContainerMesh';
import BoxMesh from './BoxMesh';

const CameraController = ({ containerDims }) => {
    const { camera, controls } = useThree();

    useEffect(() => {
        if (containerDims) {
            const maxDim = Math.max(containerDims.width, containerDims.height, containerDims.depth);
            // Increase distance to fit everything
            const distance = maxDim * 2;
            camera.position.set(distance, distance, distance);
            camera.lookAt(containerDims.width / 2, containerDims.height / 2, containerDims.depth / 2);

            // Update far plane to avoid clipping for large containers
            camera.far = 100000;
            camera.updateProjectionMatrix();

            if (controls) {
                controls.target.set(containerDims.width / 2, containerDims.height / 2, containerDims.depth / 2);
                controls.update();
            }
        }
    }, [containerDims, camera, controls]);

    return null;
};

const Scene = ({ container, boxes }) => {
    return (
        <Canvas>
            {/* Set initial far plane high enough */}
            <PerspectiveCamera makeDefault position={[100, 100, 100]} far={100000} />
            <OrbitControls makeDefault />

            <ambientLight intensity={0.8} />
            <directionalLight position={[1000, 2000, 1000]} intensity={1.5} castShadow />
            <pointLight position={[-1000, -1000, -1000]} intensity={0.5} />

            <group>
                {container && (
                    <ContainerMesh
                        width={container.width}
                        height={container.height}
                        depth={container.depth}
                    />
                )}

                {boxes && boxes.map((box) => (
                    <BoxMesh
                        key={box.id}
                        width={box.width}
                        height={box.height}
                        depth={box.depth}
                        position={box.position}
                        color={box.color}
                    />
                ))}
            </group>

            <gridHelper args={[5000, 100]} position={[0, -1, 0]} />
            <axesHelper args={[500]} />

            <CameraController containerDims={container} />
        </Canvas>
    );
};

export default Scene;
