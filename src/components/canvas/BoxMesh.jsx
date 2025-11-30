import React from 'react';

const BoxMesh = ({ width, height, depth, position, color = "#3b82f6" }) => {
    return (
        <mesh position={[position.x + width / 2, position.y + height / 2, position.z + depth / 2]}>
            <boxGeometry args={[width - 1, height - 1, depth - 1]} /> {/* Increased gap for better visibility */}
            <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
            {/* Add edges for better definition */}
            <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(width - 1, height - 1, depth - 1)]} />
                <lineBasicMaterial color="black" linewidth={1} />
            </lineSegments>
        </mesh>
    );
};

// Need to import THREE for edgesGeometry in JSX if not using drei's Edges
import * as THREE from 'three';

export default BoxMesh;
