import {Categories} from "../constants";

const BALANCE_CATEGORY_ID = 8;

export const getLastBudgetByCategory = (budget, categoryId) => {
    if (!budget)
        return 0;

    return Object.values(budget[categoryId]).reduce((acc, curr) => acc + curr, 0);
};

export const getBudgetSummary = budget => {
    if (!budget) {
        return {totalExpenses: 0, totalIncome: 0};
    }

    const budgetIncome = Object.values(budget[BALANCE_CATEGORY_ID]);
    const budgetExpenses = Object.entries(budget).filter(([categoryId]) => String(categoryId) !== String(BALANCE_CATEGORY_ID));
    const categoricalExpenses = budgetExpenses.map(([categoryId, amounts]) => {
        return {
            categoryName: Categories[categoryId].name,
            amount: Object.values(amounts).reduce((acc, curr) => acc + curr, 0),
        }
    });

    return {
        totalIncome: budgetIncome.reduce((acc, curr) => acc + curr, 0),
        totalExpenses: budgetExpenses.reduce((acc, [_, amounts]) => acc + Object.values(amounts).reduce((acc, curr) => acc + curr, 0), 0),
        categoricalExpenses
    }
}