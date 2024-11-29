import { type FC } from 'react';

const taxBrackets = [
  { rate: '10%', single: '$0 - $11,000', married: '$0 - $22,000' },
  { rate: '12%', single: '$11,001 - $44,725', married: '$22,001 - $89,450' },
  { rate: '22%', single: '$44,726 - $95,375', married: '$89,451 - $190,750' },
  { rate: '24%', single: '$95,376 - $182,100', married: '$190,751 - $364,200' },
  { rate: '32%', single: '$182,101 - $231,250', married: '$364,201 - $462,500' },
  { rate: '35%', single: '$231,251 - $578,125', married: '$462,501 - $693,750' },
  { rate: '37%', single: '$578,126+', married: '$693,751+' },
];

export const TaxBracketInfo: FC = () => {
  return (
    <div className="mt-8 bg-gray-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">2024 Tax Brackets</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Single</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Married Filing Jointly</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {taxBrackets.map((bracket, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{bracket.rate}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{bracket.single}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{bracket.married}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Note: These are marginal tax rates. You pay each rate only on the income within its bracket range.
      </p>
    </div>
  );
};