import { useState } from 'react';
import type { CalculationResults, CalculatorEntry } from '../../../types/calculator';
import { formatCurrency } from '../../../utils/formatters';
import { useBrandingStore } from '../../../store/brandingStore';
import { generatePDF } from '../../pdf/PDFReport';

interface TaxResultsProps {
  results: CalculationResults;
  formData: CalculatorEntry;
  onRecalculate: () => void;
}

export function TaxResults({ results, formData, onRecalculate }: TaxResultsProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { settings: branding } = useBrandingStore();

  const handleDownloadPDF = async () => {
    if (!branding) {
      console.error('No branding settings available');
      return;
    }

    try {
      setIsGeneratingPDF(true);
      const pdfBlob = await generatePDF({ results, formData, branding });
      
      // Create a download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `retirement-tax-analysis-${formData.lastName.toLowerCase()}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Your Retirement Tax Bill</h2>
        <p className="mt-2 text-gray-600">
          Compare the tax implications of your retirement strategy
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-blue-900">Keep Qualified Account</h3>
          <div className="space-y-3">
            <p className="flex justify-between">
              <span>Taxes paid on RMDs at time of withdrawals:</span>
              <span className="font-medium">{formatCurrency(results.keepQualified.rmdTaxes)}</span>
            </p>
            <p className="flex justify-between">
              <span>Taxes paid on reinvested RMDs:</span>
              <span className="font-medium">{formatCurrency(results.keepQualified.reinvestedRmdTaxes)}</span>
            </p>
            <p className="flex justify-between">
              <span>Taxes paid on remaining account value at death:</span>
              <span className="font-medium">{formatCurrency(results.keepQualified.remainingBalanceTaxes)}</span>
            </p>
            <div className="pt-3 mt-3 border-t border-blue-200">
              <p className="flex justify-between text-xl font-bold text-red-600">
                <span>Current Retirement Tax Bill:</span>
                <span>{formatCurrency(results.keepQualified.currentRetirementTaxBill)}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-green-900">Re-allocate using S.M.A.R.T. Strategy</h3>
          <div className="space-y-3">
            <p className="flex justify-between">
              <span>Taxes paid on reallocation:</span>
              <span className="font-medium">{formatCurrency(results.convertToRoth.conversionTaxes)}</span>
            </p>
            <p className="flex justify-between">
              <span>Taxes paid on tax-free growth account:</span>
              <span className="font-medium">{formatCurrency(results.convertToRoth.futureGrowthTaxes)}</span>
            </p>
            <p className="flex justify-between">
              <span>Taxes paid on remaining tax-free account value at death:</span>
              <span className="font-medium">{formatCurrency(results.convertToRoth.remainingBalanceTaxes)}</span>
            </p>
            <div className="pt-3 mt-3 border-t border-green-200">
              <p className="flex justify-between text-xl font-bold text-green-600">
                <span>Total Tax Savings:</span>
                <span>{formatCurrency(results.convertToRoth.totalTaxSavings)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4">Year-by-Year Projections</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RMD Factor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RMD Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">After-Tax RMD</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualified Account Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taxable Account - After-tax RMDs</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roth Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.keepQualified.yearByYear.map((year, index) => (
                <tr key={year.year} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="px-4 py-3">{year.year}</td>
                  <td className="px-4 py-3">{year.age}</td>
                  <td className="px-4 py-3">{year.rmdFactor.toFixed(1)}</td>
                  <td className="px-4 py-3">{formatCurrency(year.rmdAmount)}</td>
                  <td className="px-4 py-3">{formatCurrency(year.afterTaxRmd)}</td>
                  <td className="px-4 py-3">{formatCurrency(year.iraValue)}</td>
                  <td className="px-4 py-3">{formatCurrency(year.taxableAccount)}</td>
                  <td className="px-4 py-3">{formatCurrency(results.convertToRoth.yearByYear[index].rothValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={onRecalculate}
          className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Recalculate
        </button>
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF Report'}
        </button>
      </div>
    </div>
  );
}