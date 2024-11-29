import { RetirementTaxCalculator } from '../components/calculators/RetirementTaxCalculator';

export function EmbeddedCalculator() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RetirementTaxCalculator embedded={true} />
    </div>
  );
}