import { useState } from 'react';
import { RMDForm } from './RMDForm';
import { RMDResults } from './RMDResults';
import { calculateProjections } from '../../../utils/rmdCalculations';
import type { CalculationResults, CalculatorEntry } from '../../../types/calculator';
import { useCalculatorStore } from '../../../store/calculatorStore';

export function RMDCalculator() {
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [initialValues, setInitialValues] = useState<{
    balance: number;
    taxBracket: number;
  } | null>(null);
  const { saveEntry, loading, error } = useCalculatorStore();

  const handleSubmit = async (data: Omit<CalculatorEntry, 'timestamp' | 'userId'>) => {
    try {
      const calculationResults = calculateProjections(
        data.age,
        data.qualifiedAccountValue,
        data.taxBracket,
        data.birthYear
      );

      setResults(calculationResults);
      setInitialValues({
        balance: data.qualifiedAccountValue,
        taxBracket: data.taxBracket
      });

      await saveEntry({
        ...data,
        calculatorId: 'rmd-calculator',
      });

      setShowResults(true);
    } catch (err) {
      console.error('Error calculating results:', err);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {!showResults ? (
        <RMDForm onSubmit={handleSubmit} loading={loading} />
      ) : results && initialValues ? (
        <RMDResults
          results={results}
          initialBalance={initialValues.balance}
          taxBracket={initialValues.taxBracket}
        />
      ) : null}
    </div>
  );
}