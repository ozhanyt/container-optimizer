import React from 'react';

const ContainerMesh = ({ width, height, depth }) => {
    return (
        <group>
            {/* Wireframe representation of the container */}
            <mesh position={[width / 2, height / 2, depth / 2]}>
                <boxGeometry args={[width, height, depth]} />
                <meshBasicMaterial color="white" wireframe />
            </mesh>
            {/* Transparent fill to make it look solid but see-through */}
            <mesh position={[width / 2, height / 2, depth / 2]}>
                <boxGeometry args={[width, height, depth]} />
                <meshStandardMaterial color="gray" transparent opacity={0.1} />
            </mesh>
        </group>
    );
};

export default ContainerMesh;
