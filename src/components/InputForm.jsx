import React, { useState } from 'react';
import { Package, Truck, Calculator, Plus, Trash2 } from 'lucide-react';

const InputForm = ({ onCalculate }) => {
    const [container, setContainer] = useState({ width: 1200, height: 240, depth: 240 }); // Standard approx cm
    const [boxTypes, setBoxTypes] = useState([
        { id: 1, width: 50, height: 50, depth: 50, quantity: 0, color: '#3b82f6' }
    ]);
    const [allowRotation, setAllowRotation] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedBoxes = boxTypes.map(b => ({
            ...b,
            quantity: Number(b.quantity) || Infinity
        }));

        onCalculate(container, formattedBoxes, allowRotation);
    };

    const handleContainerChange = (field, value) => {
        setContainer(prev => ({ ...prev, [field]: Number(value) }));
    };

    const handleBoxChange = (id, field, value) => {
        setBoxTypes(prev => prev.map(box =>
            box.id === id ? { ...box, [field]: Number(value) } : box
        ));
    };

    const addBoxType = () => {
        const newId = Math.max(...boxTypes.map(b => b.id), 0) + 1;
        const colors = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#14b8a6'];
        const nextColor = colors[(newId - 1) % colors.length];

        setBoxTypes(prev => [...prev, {
            id: newId,
            width: 50,
            height: 50,
            depth: 50,
            quantity: 0,
            color: nextColor
        }]);
    };

    const removeBoxType = (id) => {
        if (boxTypes.length > 1) {
            setBoxTypes(prev => prev.filter(box => box.id !== id));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4 text-gray-800">
                    <Truck className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-semibold">Konteyner Boyutları (cm)</h2>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Uzunluk</label>
                        <input
                            type="number"
                            value={container.width}
                            onChange={(e) => handleContainerChange('width', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Yükseklik</label>
                        <input
                            type="number"
                            value={container.height}
                            onChange={(e) => handleContainerChange('height', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Genişlik</label>
                        <input
                            type="number"
                            value={container.depth}
                            onChange={(e) => handleContainerChange('depth', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4 text-gray-800">
                    <div className="flex items-center gap-3">
                        <Package className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-semibold">Kutu Listesi</h2>
                    </div>
                    <button
                        type="button"
                        onClick={addBoxType}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        <Plus className="w-4 h-4" /> Kutu Ekle
                    </button>
                </div>

                <div className="space-y-6">
                    {boxTypes.map((box, index) => (
                        <div key={box.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: box.color }}></span>
                                    {index + 1}. Öncelikli Kutu
                                </span>
                                {boxTypes.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeBoxType(box.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">En (cm)</label>
                                    <input
                                        type="number"
                                        value={box.width}
                                        onChange={(e) => handleBoxChange(box.id, 'width', e.target.value)}
                                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Boy (cm)</label>
                                    <input
                                        type="number"
                                        value={box.height}
                                        onChange={(e) => handleBoxChange(box.id, 'height', e.target.value)}
                                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Derinlik (cm)</label>
                                    <input
                                        type="number"
                                        value={box.depth}
                                        onChange={(e) => handleBoxChange(box.id, 'depth', e.target.value)}
                                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Adet (0=Tümü)</label>
                                    <input
                                        type="number"
                                        value={box.quantity}
                                        onChange={(e) => handleBoxChange(box.id, 'quantity', e.target.value)}
                                        placeholder="Tümü"
                                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="allowRotation"
                        checked={allowRotation}
                        onChange={(e) => setAllowRotation(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="allowRotation" className="text-sm text-gray-700">
                        Kutuyu Döndürmeye İzin Ver (Otomatik Optimizasyon)
                    </label>
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
                <Calculator className="w-5 h-5" />
                Hesapla
            </button>
        </form>
    );
};

export default InputForm;
