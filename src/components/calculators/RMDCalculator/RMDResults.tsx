import { formatCurrency } from '../../../utils/formatters';
import type { CalculationResults } from '../../../types/calculator';

export interface RMDResultsProps {
  results: CalculationResults;
  initialBalance?: number;
  taxBracket?: number;
}

export function RMDResults({ results }: RMDResultsProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Your Retirement Tax Bill</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Keep Qualified Account</h3>
          <div className="space-y-2">
            <p>Taxes paid on RMDs at time of withdrawals: {formatCurrency(results.keepQualified.rmdTaxes)}</p>
            <p>Taxes paid on reinvested RMDs: {formatCurrency(results.keepQualified.reinvestedRmdTaxes)}</p>
            <p>Taxes paid on remaining account value at death: {formatCurrency(results.keepQualified.remainingBalanceTaxes)}</p>
            <p className="text-xl font-bold text-red-600 mt-4">
              Current Retirement Tax Bill: {formatCurrency(results.keepQualified.currentRetirementTaxBill)}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">S.M.A.R.T. Strategy</h3>
          <div className="space-y-2">
            <p>Taxes paid on reallocation: {formatCurrency(results.convertToRoth.conversionTaxes)}</p>
            <p>Taxes paid on tax-free growth account: {formatCurrency(results.convertToRoth.futureGrowthTaxes)}</p>
            <p>Taxes paid on remaining tax-free account value at death: {formatCurrency(results.convertToRoth.remainingBalanceTaxes)}</p>
            <p className="text-xl font-bold text-green-600 mt-4">
              Total Tax Savings: {formatCurrency(results.convertToRoth.totalTaxSavings)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4">Year-by-Year Projections</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2">Year</th>
                <th className="px-4 py-2">Age</th>
                <th className="px-4 py-2">RMD Factor</th>
                <th className="px-4 py-2">RMD Amount</th>
                <th className="px-4 py-2">After-Tax RMD</th>
                <th className="px-4 py-2">Qualified Account Value</th>
                <th className="px-4 py-2">Taxable Account - After-tax RMDs</th>
                <th className="px-4 py-2">Roth Value</th>
              </tr>
            </thead>
            <tbody>
              {results.keepQualified.yearByYear.map((year, index) => (
                <tr key={year.year} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="px-4 py-2">{year.year}</td>
                  <td className="px-4 py-2">{year.age}</td>
                  <td className="px-4 py-2">{year.rmdFactor.toFixed(1)}</td>
                  <td className="px-4 py-2">{formatCurrency(year.rmdAmount)}</td>
                  <td className="px-4 py-2">{formatCurrency(year.afterTaxRmd)}</td>
                  <td className="px-4 py-2">{formatCurrency(year.iraValue)}</td>
                  <td className="px-4 py-2">{formatCurrency(year.taxableAccount)}</td>
                  <td className="px-4 py-2">{formatCurrency(results.convertToRoth.yearByYear[index].rothValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}