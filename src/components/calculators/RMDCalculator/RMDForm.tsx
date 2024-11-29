import { useForm } from 'react-hook-form';
import type { CalculatorEntry } from '../../../types/calculator';

interface RMDFormProps {
  onSubmit: (data: CalculatorEntry) => void;
  loading: boolean;
}

export function RMDForm({ onSubmit, loading }: RMDFormProps) {
  const { handleSubmit, watch } = useForm<CalculatorEntry>();
  const currentAge = watch('age', 65);
  const birthYear = new Date().getFullYear() - currentAge;

  const handleFormSubmit = (data: CalculatorEntry) => {
    onSubmit({
      ...data,
      birthYear
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">RMD vs Roth Conversion Analysis</h1>
        <p className="mt-4 text-gray-600">
          Compare keeping your money in a qualified account vs converting to a Roth IRA
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-sm space-y-6">
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Calculating...' : 'Calculate'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}