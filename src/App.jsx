import React, { useState } from 'react';
import InputForm from './components/InputForm';
import Results from './components/Results';
import Scene from './components/canvas/Scene';
import { pack } from './utils/packer';
import { Box } from 'lucide-react'; // Assuming lucide-react for the Box icon

function App() {
  const [result, setResult] = useState(null);
  const [containerDims, setContainerDims] = useState({ width: 1200, height: 240, depth: 240 });
  const [boxes, setBoxes] = useState([]);

  const handleCalculate = (container, boxTypes, allowRotation) => {
    setContainerDims(container);
    const result = pack(
      container.width,
      container.height,
      container.depth,
      boxTypes,
      allowRotation
    );
    setResult(result);
    // The boxes state is now implicitly updated via the result state if result contains boxes
    // If Scene component still needs `boxes` directly, you might need to extract them from `result`
    // For now, assuming `result` contains `boxes` and Scene can access them from `result` or `setBoxes` is not strictly needed here.
    // If `pack` returns `result.boxes`, then `setBoxes(result.boxes)` would be appropriate here.
    // Based on the original `setBoxes(packingResult.boxes);`, let's assume `result` from `pack` has a `boxes` property.
    setBoxes(result.boxes);
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-96 bg-white shadow-xl flex flex-col h-screen overflow-y-auto z-10">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 text-blue-600 mb-1">
            <Box className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Konteyner Asistanı</h1>
          </div>
          <p className="text-sm text-gray-500">Optimum yükleme planlayıcı</p>
        </div>

        <div className="p-6 flex-1">
          <InputForm onCalculate={handleCalculate} />
          <Results result={result} />
        </div>

        <div className="mt-8 p-6 text-xs text-gray-400 border-t border-gray-100">
          <p>Basit Sezgisel Paketleyici</p>
          <p>Tek tip kutu için optimize edilmiştir.</p>
        </div>
      </div>

      {/* 3D Visualization Area */}
      <div className="flex-grow relative bg-gray-900 h-full">
        <Scene container={containerDims} boxes={boxes} />

        <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded text-sm pointer-events-none select-none">
          Sol Tık: Döndür | Sağ Tık: Kaydır | Tekerlek: Yakınlaştır
        </div>
      </div>
    </div>
  );
}

export default App;
