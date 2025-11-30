
export class Box {
    constructor(width, height, depth, id, typeId) {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.id = id;
        this.typeId = typeId; // To check compatibility
        this.position = null; // {x, y, z}
        this.rotation = 0;
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
 * Packs multiple box types using a "Layer-First" heuristic.
 * Prioritizes:
 * 1. Bottom-Up (Y): Fill the floor first to ensure stability and gap at top.
 * 2. Front-to-Back (X): Fill from the door inwards (or front wall).
 * 3. Narrow-to-Wide (Z): Fill columns.
 * 
 * Constraint: No Mixed Stacking (Type B cannot sit on Type A).
 */
export function pack(containerWidth, containerHeight, containerDepth, boxTypes, allowRotation = true) {
    const container = new Container(containerWidth, containerHeight, containerDepth);
    let placedBoxes = [];
    let totalVolumePacked = 0;

    // Potential placement points, initialized with origin
    let potentialPoints = [{ x: 0, y: 0, z: 0 }];

    let idCounter = 0;

    // Process each box type
    boxTypes.forEach((boxType, typeIndex) => {
        let quantity = boxType.quantity === 0 ? Infinity : boxType.quantity;
        if (quantity === Infinity) quantity = 10000;

        for (let i = 0; i < quantity; i++) {
            // Dynamic sorting based on box type count:
            // - Single type (1): Y->X->Z (Layer-First) spreads boxes across floor
            // - Multiple types (2+): X->Z->Y (Wall-First) creates vertical blocks, sequential placement
            if (boxTypes.length === 1) {
                // Single box type: prioritize floor coverage (layers)
                potentialPoints.sort((a, b) => {
                    if (a.y !== b.y) return a.y - b.y;
                    if (a.x !== b.x) return a.x - b.x;
                    return a.z - b.z;
                });
            } else {
                // Multiple box types: prioritize vertical blocks (walls) for sequential packing
                potentialPoints.sort((a, b) => {
                    if (a.x !== b.x) return a.x - b.x;
                    if (a.z !== b.z) return a.z - b.z;
                    return a.y - b.y;
                });
            }

            let bestPlacement = null;

            // Try to find a valid point
            pointLoop:
            for (let pIndex = 0; pIndex < potentialPoints.length; pIndex++) {
                const point = potentialPoints[pIndex];

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
                    // 1. Check container bounds
                    if (point.x + w > containerWidth || point.y + h > containerHeight || point.z + d > containerDepth) {
                        continue;
                    }

                    // 2. Check collision with placed boxes
                    if (checkCollision(point, w, h, d, placedBoxes)) {
                        continue;
                    }

                    // 3. Check Support & Type Compatibility
                    // Must be on floor OR supported by boxes of SAME type
                    if (!checkSupport(point, w, h, d, placedBoxes, typeIndex)) {
                        continue;
                    }

                    bestPlacement = { point, w, h, d, pIndex };
                    break pointLoop;
                }
            }

            if (bestPlacement) {
                const { point, w, h, d, pIndex } = bestPlacement;

                const box = new Box(w, h, d, idCounter++, typeIndex);
                box.position = { x: point.x, y: point.y, z: point.z };
                box.color = boxType.color;
                placedBoxes.push(box);
                totalVolumePacked += w * h * d;

                // Remove used point
                potentialPoints.splice(pIndex, 1);

                // Add new points
                addPoint(potentialPoints, point.x + w, point.y, point.z, containerWidth, containerHeight, containerDepth);
                addPoint(potentialPoints, point.x, point.y + h, point.z, containerWidth, containerHeight, containerDepth);
                addPoint(potentialPoints, point.x, point.y, point.z + d, containerWidth, containerHeight, containerDepth);

            } else {
                break; // Cannot place this box
            }
        }
    });

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
    if (!points.some(p => p.x === x && p.y === y && p.z === z)) {
        points.push({ x, y, z });
    }
}

function checkCollision(point, w, h, d, placedBoxes) {
    const b1 = { x: point.x, y: point.y, z: point.z, w, h, d };
    for (const placed of placedBoxes) {
        const b2 = {
            x: placed.position.x,
            y: placed.position.y,
            z: placed.position.z,
            w: placed.width,
            h: placed.height,
            d: placed.depth
        };
        if (intersect(b1, b2)) return true;
    }
    return false;
}

function checkSupport(point, w, h, d, placedBoxes, currentTypeId) {
    // If on floor, valid
    if (point.y === 0) return true;

    // Check area immediately below
    const bottomFace = {
        x: point.x,
        y: point.y - 0.1, // Slightly below
        z: point.z,
        w: w,
        h: 0.1, // Thin slice
        d: d
    };

    let hasSupport = false;

    for (const placed of placedBoxes) {
        const b2 = {
            x: placed.position.x,
            y: placed.position.y,
            z: placed.position.z,
            w: placed.width,
            h: placed.height,
            d: placed.depth
        };

        if (intersect(bottomFace, b2)) {
            // Found a supporting box
            hasSupport = true;
            // Check type
            if (placed.typeId !== currentTypeId) {
                return false; // Mixed stacking forbidden
            }
        }
    }

    return hasSupport; // Must have at least one supporting box (Gravity)
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
