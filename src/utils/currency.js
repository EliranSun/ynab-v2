export const formatCurrency = (amount) => {
    return new Intl.NumberFormat("he-IL", {
        style: "currency",
        currency: "ILS",
        currencyDisplay: 'symbol',
        notation: 'compact',
        // notation: 'standard',
    }).format(amount);
};