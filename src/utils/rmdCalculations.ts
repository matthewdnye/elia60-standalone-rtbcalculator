import type { CalculatorEntry } from '../types/calculator';

interface RMDProjection {
  year: number;
  age: number;
  rmdFactor: number;
  rmdAmount: number;
  afterTaxRmd: number;
  iraValue: number;
  taxableAccount: number;
  reinvestedRmds: number;
  taxes: number;
}

interface RothProjection {
  year: number;
  age: number;
  rothValue: number;
  taxes: number;
}

export interface CalculationResults {
  keepQualified: {
    rmdTaxes: number;
    reinvestedRmdTaxes: number;
    remainingBalanceTaxes: number;
    currentRetirementTaxBill: number;
    yearByYear: RMDProjection[];
  };
  convertToRoth: {
    conversionTaxes: number;
    futureGrowthTaxes: number;
    remainingBalanceTaxes: number;
    totalTaxSavings: number;
    yearByYear: RothProjection[];
  };
}

function getRmdStartAge(birthYear: number): number {
  if (birthYear >= 1960) return 75;
  if (birthYear >= 1951) return 73;
  return 72;
}

function getRmdFactor(age: number): number {
  // 2022 IRS Uniform Lifetime Table
  const rmdTable: { [key: number]: number } = {
    72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7,
    77: 22.9, 78: 22.0, 79: 21.1, 80: 20.2, 81: 19.4,
    82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2,
    87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5,
    92: 10.8, 93: 10.1, 94: 9.5, 95: 8.9, 96: 8.4,
    97: 7.8, 98: 7.3, 99: 6.8, 100: 6.4
  };
  return rmdTable[age] || 6.4;
}

export function calculateProjections(
  currentAge: number,
  qualifiedBalance: number,
  taxBracket: number,
  birthYear: number,
  growthRate: number = 5
): CalculationResults {
  const annualGrowthRate = growthRate / 100;
  const taxRate = taxBracket / 100;
  const projectionYears = 90 - currentAge;
  const rmdStartAge = getRmdStartAge(birthYear);
  const currentYear = new Date().getFullYear();

  // RMD Scenario
  const rmdProjection: RMDProjection[] = [];
  let rmdBalance = qualifiedBalance;
  let reinvestedRmds = 0;
  let totalRmdTaxes = 0;
  let totalReinvestedTaxes = 0;

  // Roth Conversion Scenario
  const rothProjection: RothProjection[] = [];
  const conversionTax = qualifiedBalance * taxRate;
  let rothBalance = qualifiedBalance - conversionTax;

  for (let yearOffset = 0; yearOffset <= projectionYears; yearOffset++) {
    const age = currentAge + yearOffset;
    const year = currentYear + yearOffset;

    // Calculate RMD scenario
    let rmdAmount = 0;
    let rmdTax = 0;
    let afterTaxRmd = 0;

    // Apply growth to existing balances
    rmdBalance *= (1 + annualGrowthRate);
    reinvestedRmds *= (1 + annualGrowthRate);
    rothBalance *= (1 + annualGrowthRate);

    // Calculate RMD if applicable
    if (age >= rmdStartAge) {
      const rmdFactor = getRmdFactor(age);
      rmdAmount = rmdBalance / rmdFactor;
      rmdTax = rmdAmount * taxRate;
      afterTaxRmd = rmdAmount - rmdTax;
      
      // Update balances
      rmdBalance -= rmdAmount;
      reinvestedRmds += afterTaxRmd;
      totalRmdTaxes += rmdTax;
    }

    // Calculate taxes on reinvested RMDs growth
    const reinvestedGrowth = reinvestedRmds * annualGrowthRate;
    const reinvestedTax = reinvestedGrowth * (taxRate / 2); // Capital gains rate
    totalReinvestedTaxes += reinvestedTax;

    // Store projections
    rmdProjection.push({
      year,
      age,
      rmdFactor: age >= rmdStartAge ? getRmdFactor(age) : 0,
      rmdAmount,
      afterTaxRmd,
      iraValue: rmdBalance,
      taxableAccount: reinvestedRmds,
      reinvestedRmds,
      taxes: rmdTax + reinvestedTax
    });

    rothProjection.push({
      year,
      age,
      rothValue: rothBalance,
      taxes: yearOffset === 0 ? conversionTax : 0
    });
  }

  // Calculate final tax implications
  const remainingRmdTax = rmdBalance * taxRate;
  const remainingReinvestedTax = reinvestedRmds * (taxRate / 2);

  return {
    keepQualified: {
      rmdTaxes: totalRmdTaxes,
      reinvestedRmdTaxes: totalReinvestedTaxes,
      remainingBalanceTaxes: remainingRmdTax + remainingReinvestedTax,
      currentRetirementTaxBill: totalRmdTaxes + totalReinvestedTaxes + remainingRmdTax + remainingReinvestedTax,
      yearByYear: rmdProjection
    },
    convertToRoth: {
      conversionTaxes: conversionTax,
      futureGrowthTaxes: 0, // Roth growth is tax-free
      remainingBalanceTaxes: 0, // Roth withdrawals are tax-free
      totalTaxSavings: (totalRmdTaxes + totalReinvestedTaxes + remainingRmdTax + remainingReinvestedTax) - conversionTax,
      yearByYear: rothProjection
    }
  };
}