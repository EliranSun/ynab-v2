export const formatCurrency = (amount, isShort = false, showSign = true) => {
    const formatted = new Intl.NumberFormat("he-IL", {
        style: "currency",
        currency: "ILS",
        currencyDisplay: 'narrowSymbol',
        compactDisplay: 'short',
        roundingMode: 'halfEven',
        maximumFractionDigits: 0,
        notation: isShort ? 'compact' : 'standard',
        signDisplay: showSign ? 'always' : 'never',
    }).format(amount);

    console.log({formatted});
    return formatted.split(" ‏").join('');
};