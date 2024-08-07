export const getLastBudgetByCategory = (budget, subcategoryId) => {
    if (budget.length === 0) {
        return 0;
    }

    return budget.filter(item => item.subcategoryId === subcategoryId).reduce((acc, curr) => acc + curr.amount, 0);
};

export const getBudgetSummary = (budget = [], categories = []) => {
    const incomeSubcategoriesIds = categories.filter(category => category.isIncome).flatMap(category => category.subcategories.map(subcategory => subcategory.id));

    if (budget.length === 0) {
        return {totalExpenses: 0, totalIncome: 0};
    }

    const budgetIncome = budget.filter(({categoryId}) => incomeSubcategoriesIds.includes(categoryId));
    const budgetExpenses = budget.filter(({categoryId}) => !incomeSubcategoriesIds.includes(categoryId));

    return {
        totalIncome: budgetIncome.reduce((acc, curr) => acc + curr.amount, 0),
        totalExpenses: budgetExpenses.reduce((acc, curr) => acc + curr.amount, 0),
        categoricalExpenses: budgetExpenses
    }
}