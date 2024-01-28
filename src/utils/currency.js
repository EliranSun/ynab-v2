export const formatCurrency = (amount, isShort = false, showSign = true) => {
    return new Intl.NumberFormat("he-IL", {
        style: "currency",
        currency: "ILS",
        currencyDisplay: 'symbol',
        compactDisplay: 'short',
        roundingMode: 'halfEven',
        maximumFractionDigits: 0,
        notation: isShort ? 'compact' : 'standard',
        signDisplay: showSign ? 'always' : 'never',
    }).format(amount);
};