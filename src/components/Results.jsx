import React from 'react';
import { Box, Percent } from 'lucide-react';

const Results = ({ result }) => {
    if (!result) return null;

    return (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Sonuçlar</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded shadow-sm">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <Box className="w-4 h-4" />
                        <span className="text-sm font-medium">Sığan / Kapasite</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                        {result.count}
                        {result.totalCapacity > 0 && result.totalCapacity > result.count && (
                            <span className="text-sm text-gray-500 font-normal ml-1">/ {result.totalCapacity}</span>
                        )}
                    </p>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                    <div className="flex items-center gap-2 text-green-600 mb-1">
                        <Percent className="w-4 h-4" />
                        <span className="text-sm font-medium">Verimlilik</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                        {(result.efficiency * 100).toFixed(1)}%
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Results;
