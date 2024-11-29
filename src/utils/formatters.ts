export const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseCurrencyToNumber(value) : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
};

export const parseCurrencyToNumber = (value: string): number => {
  // Remove currency symbols, commas, and spaces
  const cleanValue = value.replace(/[$,\s]/g, '');
  // Convert to number, return 0 if invalid
  return cleanValue ? Number(cleanValue) : 0;
};