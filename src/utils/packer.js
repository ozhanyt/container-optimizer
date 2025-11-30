
export class Box {
    constructor(width, height, depth, id) {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.id = id;
        this.position = null; // {x, y, z}
        this.rotation = 0; // 0: none, 1: 90 deg on Y axis (width/depth swap) - simplified for now
        this.color = "#3b82f6";
    }
}

export class Container {
    constructor(width, height, depth) {
        this.width = width;
        this.height = height;
        this.depth = depth;
    }
}

/**
 * Packs multiple box types using a "Potential Points" heuristic (Tetris-like).
 * Prioritizes filling gaps: Front-to-Back (X), then Narrow-to-Wide (Z), then Bottom-Up (Y).
 */
export function pack(containerWidth, containerHeight, containerDepth, boxTypes, allowRotation = true) {
    const container = new Container(containerWidth, containerHeight, containerDepth);
    let placedBoxes = [];
    let totalVolumePacked = 0;

    // Potential placement points, initialized with origin
    let potentialPoints = [{ x: 0, y: 0, z: 0 }];

    let idCounter = 0;

    // Process each box type in priority order
    for (const boxType of boxTypes) {
        let quantity = boxType.quantity === 0 ? Infinity : boxType.quantity;
        // Safety break for infinite loop if quantity is 0 (meaning "fill as much as possible")
        // We'll limit "Infinity" to a reasonable max number to prevent browser crash if logic fails
        if (quantity === Infinity) quantity = 10000;

        for (let i = 0; i < quantity; i++) {
            // Sort points to prioritize: X (Front), then Z (Left/Narrow), then Y (Bottom)
            // This ensures we fill columns (Y) within a row (Z) within a slice (X)

            potentialPoints.sort((a, b) => {
                if (a.x !== b.x) return a.x - b.x;
                if (a.z !== b.z) return a.z - b.z;
                return a.y - b.y;
            });

            let bestPlacement = null;

            // Try to find a valid point for this box
            pointLoop:
            for (let pIndex = 0; pIndex < potentialPoints.length; pIndex++) {
                const point = potentialPoints[pIndex];

                // Define orientations to try
                const orientations = allowRotation ? [
                    [boxType.width, boxType.height, boxType.depth],
                    [boxType.width, boxType.depth, boxType.height],
                    [boxType.height, boxType.width, boxType.depth],
                    [boxType.height, boxType.depth, boxType.width],
                    [boxType.depth, boxType.width, boxType.height],
                    [boxType.depth, boxType.height, boxType.width]
                ] : [
                    [boxType.width, boxType.height, boxType.depth]
                ];

                for (const [w, h, d] of orientations) {
                    // Check container bounds
                    if (point.x + w > containerWidth || point.y + h > containerHeight || point.z + d > containerDepth) {
                        continue;
                    }

                    // Check collision with placed boxes
                    let collision = false;
                    for (const placed of placedBoxes) {
                        if (intersect({ x: point.x, y: point.y, z: point.z, w, h, d },
                            { x: placed.position.x, y: placed.position.y, z: placed.position.z, w: placed.width, h: placed.height, d: placed.depth })) {
                            collision = true;
                            break;
                        }
                    }

                    if (!collision) {
                        bestPlacement = { point, w, h, d, pIndex };
                        break pointLoop; // Found a fit!
                    }
                }
            }

            if (bestPlacement) {
                const { point, w, h, d, pIndex } = bestPlacement;

                const box = new Box(w, h, d, idCounter++);
                box.position = { x: point.x, y: point.y, z: point.z };
                box.color = boxType.color;
                placedBoxes.push(box);
                totalVolumePacked += w * h * d;

                // Remove the used point
                potentialPoints.splice(pIndex, 1);

                // Add new potential points (Top, Right, Front relative to this box)
                // We add them to the list, they will be sorted next iteration
                addPoint(potentialPoints, point.x + w, point.y, point.z, containerWidth, containerHeight, containerDepth);
                addPoint(potentialPoints, point.x, point.y + h, point.z, containerWidth, containerHeight, containerDepth);
                addPoint(potentialPoints, point.x, point.y, point.z + d, containerWidth, containerHeight, containerDepth);

            } else {
                // Could not place this box anywhere. 
                // If quantity was specific, we stop for this type? 
                // Or should we try to fit others? 
                // Usually if one doesn't fit, we stop this type.
                break;
            }
        }
    }

    const volumeContainer = containerWidth * containerHeight * containerDepth;
    const efficiency = totalVolumePacked / volumeContainer;

    return {
        count: placedBoxes.length,
        boxes: placedBoxes,
        efficiency: efficiency,
        totalCapacity: -1
    };
}

function addPoint(points, x, y, z, cw, ch, cd) {
    if (x >= cw || y >= ch || z >= cd) return;
    // Optional: Check if point is already inside another box or duplicate
    // For simplicity, just add. Sorting handles priority.
    // Optimization: Don't add if already exists
    if (!points.some(p => p.x === x && p.y === y && p.z === z)) {
        points.push({ x, y, z });
    }
}

function intersect(b1, b2) {
    return (
        b1.x < b2.x + b2.w &&
        b1.x + b1.w > b2.x &&
        b1.y < b2.y + b2.h &&
        b1.y + b1.h > b2.y &&
        b1.z < b2.z + b2.d &&
        b1.z + b1.d > b2.z
    );
}
