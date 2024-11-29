export interface CalculatorEntry {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  age: number;
  birthYear: number;
  qualifiedAccountValue: number;
  taxBracket: number;
  growthRate: number;
  timestamp?: Date;
  userId?: string;
  calculatorId?: string;
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

export interface RMDProjection {
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

export interface RothProjection {
  year: number;
  age: number;
  rothValue: number;
  taxes: number;
}