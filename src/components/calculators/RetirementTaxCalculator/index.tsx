import { useState } from 'react';
import { TaxForm } from './TaxForm';
import { TaxResults } from './TaxResults';
import { calculateProjections } from '../../../utils/rmdCalculations';
import type { CalculationResults, CalculatorEntry } from '../../../types/calculator';
import { useCalculatorStore } from '../../../store/calculatorStore';

interface RetirementTaxCalculatorProps {
  embedded?: boolean;
}

export function RetirementTaxCalculator({ embedded = false }: RetirementTaxCalculatorProps) {
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [formData, setFormData] = useState<CalculatorEntry | null>(null);
  const { saveEntry, loading } = useCalculatorStore();

  const handleSubmit = async (data: CalculatorEntry) => {
    try {
      console.log('Form Data:', data);
      const calculationResults = calculateProjections(
        Number(data.age),
        Number(data.qualifiedAccountValue),
        Number(data.taxBracket),
        Number(data.birthYear),
        Number(data.growthRate)
      );

      setResults(calculationResults);
      setFormData(data);

      try {
        await saveEntry({
          ...data,
          calculatorId: 'retirement-tax-calculator',
        });
      } catch (saveError) {
        console.error('Error saving entry (non-critical):', saveError);
      }

      setShowResults(true);
    } catch (err) {
      console.error('Error calculating results:', err);
      alert('There was an error calculating the results. Please try again.');
    }
  };

  return (
    <div className={embedded ? "bg-transparent" : "min-h-screen bg-gray-50"}>
      {!showResults ? (
        <TaxForm onSubmit={handleSubmit} loading={loading} embedded={embedded} />
      ) : results && formData ? (
        <TaxResults
          results={results}
          formData={formData}
          onRecalculate={() => setShowResults(false)}
          embedded={embedded}
        />
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Calculating results...</p>
          </div>
        </div>
      )}
    </div>
  );
}