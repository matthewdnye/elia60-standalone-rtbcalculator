import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { CalculatorEntry } from '../../../types/calculator';
import { TaxBracketInfo } from './TaxBracketInfo';
import { states } from '../../../utils/states';
import { formatCurrency, parseCurrencyToNumber } from '../../../utils/formatters';

interface TaxFormProps {
  onSubmit: (data: CalculatorEntry) => void;
  loading: boolean;
}

const inputClasses = "w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4";
const labelClasses = "block text-sm font-medium text-gray-700 mb-2";
const errorClasses = "mt-1 text-sm text-red-600";

export function TaxForm({ onSubmit, loading }: TaxFormProps) {
  const [showTaxInfo, setShowTaxInfo] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<CalculatorEntry>({
    defaultValues: {
      taxBracket: 24,
      growthRate: 5,
      state: '',
      calculatorId: 'retirement-tax-calculator'
    }
  });

  const currentAge = watch('age', 65);
  const birthYear = new Date().getFullYear() - currentAge;
  
  const getRmdStartAge = (birthYear: number): number => {
    if (birthYear >= 1960) return 75;
    if (birthYear >= 1951) return 73;
    return 72;
  };

  const handleFormSubmit = async (data: CalculatorEntry) => {
    try {
      setSubmitError(null);
      
      const phoneRegex = /^\+?1?\d{10,11}$/;
      const cleanPhone = data.phone.replace(/\D/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        setSubmitError('Please enter a valid 10-digit phone number');
        return;
      }

      const formattedData = {
        ...data,
        phone: cleanPhone,
        qualifiedAccountValue: typeof data.qualifiedAccountValue === 'string' 
          ? parseCurrencyToNumber(data.qualifiedAccountValue)
          : data.qualifiedAccountValue,
        birthYear,
        calculatorId: 'retirement-tax-calculator'
      };
      
      await onSubmit(formattedData);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit form');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Retirement Tax Bill Calculator</h1>
        <p className="mt-4 text-gray-600">
          Compare the tax implications of keeping your qualified retirement accounts versus converting to a Roth IRA
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {submitError}
          </div>
        )}

        {/* Contact Information Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6 text-blue-900 border-b border-blue-200 pb-2">
            Contact Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className={labelClasses}>First Name</label>
              <input
                id="firstName"
                type="text"
                {...register('firstName', { required: 'First name is required' })}
                className={inputClasses}
              />
              {errors.firstName && (
                <p className={errorClasses}>{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className={labelClasses}>Last Name</label>
              <input
                id="lastName"
                type="text"
                {...register('lastName', { required: 'Last name is required' })}
                className={inputClasses}
              />
              {errors.lastName && (
                <p className={errorClasses}>{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className={labelClasses}>Email</label>
              <input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={inputClasses}
              />
              {errors.email && (
                <p className={errorClasses}>{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className={labelClasses}>Phone</label>
              <input
                id="phone"
                type="tel"
                {...register('phone', { required: 'Phone number is required' })}
                className={inputClasses}
              />
              {errors.phone && (
                <p className={errorClasses}>{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="state" className={labelClasses}>State</label>
              <select
                id="state"
                {...register('state', { required: 'State is required' })}
                className={inputClasses}
              >
                <option value="">Select a state</option>
                {states.map(state => (
                  <option key={state.abbreviation} value={state.abbreviation}>
                    {state.name}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className={errorClasses}>{errors.state.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Financial Information Section */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6 text-green-900 border-b border-green-200 pb-2">
            Financial Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="age" className={labelClasses}>Current Age</label>
              <input
                id="age"
                type="number"
                {...register('age', { 
                  required: 'Age is required',
                  min: { value: 50, message: 'Age must be at least 50' },
                  max: { value: 100, message: 'Age must be less than 100' }
                })}
                className={inputClasses}
              />
              {errors.age && (
                <p className={errorClasses}>{errors.age.message}</p>
              )}
              {currentAge && (
                <p className="mt-2 text-sm text-green-800">
                  Birth Year: {birthYear} (RMD Start Age: {getRmdStartAge(birthYear)})
                </p>
              )}
            </div>

            <div>
              <label htmlFor="qualifiedAccountValue" className={labelClasses}>Qualified Account Value</label>
              <Controller
                name="qualifiedAccountValue"
                control={control}
                rules={{
                  required: 'Account value is required',
                  min: { value: 0, message: 'Value must be positive' }
                }}
                render={({ field: { onChange, value } }) => (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      id="qualifiedAccountValue"
                      type="text"
                      className={`${inputClasses} pl-7`}
                      placeholder="500,000"
                      value={value ? formatCurrency(value).replace('$', '') : ''}
                      onChange={(e) => {
                        const rawValue = parseCurrencyToNumber(e.target.value);
                        onChange(rawValue);
                      }}
                    />
                  </div>
                )}
              />
              {errors.qualifiedAccountValue && (
                <p className={errorClasses}>{errors.qualifiedAccountValue.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="growthRate" className={labelClasses}>Expected Annual Growth Rate</label>
              <Controller
                name="growthRate"
                control={control}
                rules={{
                  required: 'Growth rate is required',
                  min: { value: 1, message: 'Minimum growth rate is 1%' },
                  max: { value: 12, message: 'Maximum growth rate is 12%' }
                }}
                render={({ field }) => (
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <input
                        id="growthRate"
                        type="range"
                        min="1"
                        max="12"
                        step="0.5"
                        {...field}
                        className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-green-800 font-medium min-w-[4rem]">{field.value}%</span>
                    </div>
                  </div>
                )}
              />
              {errors.growthRate && (
                <p className={errorClasses}>{errors.growthRate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="taxBracket" className={labelClasses}>
                Tax Bracket{' '}
                <button
                  type="button"
                  onClick={() => setShowTaxInfo(!showTaxInfo)}
                  className="text-green-700 hover:text-green-800 text-sm ml-2 underline"
                >
                  {showTaxInfo ? 'Hide' : 'Show'} Tax Brackets
                </button>
              </label>
              <Controller
                name="taxBracket"
                control={control}
                rules={{
                  required: 'Tax bracket is required',
                  min: { value: 10, message: 'Minimum tax bracket is 10%' },
                  max: { value: 37, message: 'Maximum tax bracket is 37%' }
                }}
                render={({ field }) => (
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <input
                        id="taxBracket"
                        type="range"
                        min="10"
                        max="37"
                        step="1"
                        {...field}
                        className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-green-800 font-medium min-w-[4rem]">{field.value}%</span>
                    </div>
                  </div>
                )}
              />
              {errors.taxBracket && (
                <p className={errorClasses}>{errors.taxBracket.message}</p>
              )}
            </div>
          </div>

          {showTaxInfo && <TaxBracketInfo />}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors text-lg font-medium"
          >
            {loading ? 'Calculating...' : 'Calculate Tax Impact'}
          </button>
        </div>
      </form>
    </div>
  );
}