export const formatCurrency = (amount, isShort = false, showSign = false) => {
  return new Intl.NumberFormat("en-IL", {
    style: "currency",
    currency: "ILS",
    currencyDisplay: 'symbol',
    notation: isShort ? 'compact' : 'standard',
    compactDisplay: 'short',
    roundingMode: 'halfEven',
    maximumFractionDigits: 0,
    signDisplay: showSign ? 'always' : 'never',
  }).format(amount);
};