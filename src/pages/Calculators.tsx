import React from 'react';

const calculators = [
  {
    id: 'rmd-calculator',
    name: 'RMD Calculator',
    description: 'Compare RMD requirements with Roth conversion strategies.',
    enabled: false,
  },
  // More calculators will be added here
];

export function Calculators() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Calculators</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calculator) => (
          <div key={calculator.id} className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2">{calculator.name}</h2>
            <p className="text-gray-600 mb-4">{calculator.description}</p>
            <div className="flex items-center justify-between">
              <button
                className={`px-4 py-2 rounded-md ${
                  calculator.enabled
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {calculator.enabled ? 'Enabled' : 'Disabled'}
              </button>
              <button className="text-blue-600 hover:text-blue-700">
                Get Embed Code
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}