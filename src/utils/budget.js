import {Categories} from "../constants";

const BALANCE_CATEGORY_ID = 8;

export const getLastBudgetByCategory = (budget, categoryId) => {
    const lastBudget = Object.values(budget).pop();
    if (!lastBudget)
        return 0;

    return Object.values(lastBudget[categoryId]).reduce((acc, curr) => acc + curr, 0);
};

export const getBudgetSummary = budget => {
    const lastBudget = Object.values(budget).pop();

    if (!lastBudget)
        return {totalExpenses: 0, totalIncome: 0};

    const budgetIncome = Object.values(lastBudget[BALANCE_CATEGORY_ID]);
    const budgetExpenses = Object.entries(lastBudget).filter(([categoryId]) => String(categoryId) !== String(BALANCE_CATEGORY_ID));
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