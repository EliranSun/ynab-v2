import {Expense} from "../models";
import {isSameMonth, startOfMonth} from "date-fns";
import {getExpenses} from "./firebase";
import {Categories} from "../constants";
import {orderBy} from "lodash";
import {getLastBudgetByCategory} from "./budget";

const RecurringExpenses = [
    "מרכז הספורט",
];

const isRecurringExpense = (expenseName) => {
    if (!expenseName) {
        return false;
    }

    let isRecurring = false;
    RecurringExpenses.forEach((recurringExpense) => {
        if (expenseName.includes(recurringExpense)) {
            isRecurring = true;
        }
    });

    return isRecurring;
}

export const isExistingExpense = (newExpense, expenses) => {
    const existingExpense = expenses.find((expense) => {
        if (isRecurringExpense(newExpense.name)) {
            return false;
        }

        return (
            expense.name === newExpense.name &&
            expense.timestamp === newExpense.timestamp &&
            newExpense.amount === expense.amount
        );
    });

    return !!existingExpense;
};

export const getExistingExpenses = (expense, expenses) => {
    return expenses.filter((item) => {
        return (
            expense.name === item.name &&
            expense.timestamp === item.timestamp &&
            expense.amount === item.amount
        );
    });
};

export const parseNewExpenses = (text = '', existingExpenses = []) => {
    const rows = text.split("\n");
    return rows.map((row) => {
        const cells = row.split("\t");
        const name = cells[0];
        const amount = cells[4];
        const dateParts = cells[1]?.split("/");
        const year = dateParts && `20${dateParts[2]}`;
        const month = dateParts && Number(dateParts[1]) - 1;
        const day = dateParts && dateParts[0];
        const timestamp = new Date(Date.UTC(year, month, day)).getTime();
        const foo = startOfMonth(new Date().getTime()).getTime();
        const isRecurring = isRecurringExpense(name);
        const parsedAmount =
            amount &&
            parseFloat(amount.replace(",", "").replace("₪", "").trim());

        if (!name || !parsedAmount || !timestamp) {
            return {};
        }

        return new Expense({
            name: name,
            timestamp: isRecurring ? foo : timestamp,
            amount: parsedAmount,
            note: cells[5],
        });
    })
        .filter((row) => {
            if (isExistingExpense(row, existingExpenses)) {
                return false;
            }

            return row.name && row.amount && row.timestamp;
        });
};
export const getExpensesSummary = async ({budget, timestamp}) => {
    let totalExpenses = 0;
    let totalIncome = 0;
    const expenses = await getExpenses();
    const date = new Date(timestamp);

    const expensesThisMonth = Object.values(expenses).filter(expense => {
        const expenseDate = new Date(expense.timestamp);

        if (expense.isRecurring)
            return expenseDate.getFullYear() === date.getFullYear();

        return isSameMonth(expenseDate, date);
    });


    const summary = Categories.map(category => {
        const expensesInCategory = expensesThisMonth.filter(expense => expense.mainCategoryId === category.id);
        const totalAmountInCategory = expensesInCategory.reduce((acc, curr) => acc + curr.amount, 0);
        const isIncome = category.id === 8;

        if (isIncome) {
            totalIncome += totalAmountInCategory;
        } else {
            totalExpenses += totalAmountInCategory;
        }

        const subcategories = category.subCategories.map(subcategory => {
            const expensesInSubcategory = expensesInCategory.filter(expense => expense.subcategoryId === subcategory.id);
            const totalAmountInSubcategory = expensesInSubcategory.reduce((acc, curr) => acc + curr.amount, 0);

            return {
                ...subcategory,
                amount: totalAmountInSubcategory,
            };
        });

        const budgetInCategory = getLastBudgetByCategory(budget, category.id);

        return {
            ...category,
            amount: totalAmountInCategory,
            subcategories,
            budget: budgetInCategory,
        };
    });

    return {
        summary: orderBy(summary, 'amount', 'desc'),
        totalExpenses,
        totalIncome,
    };
};

export const getAverageExpenseAmountPerCategoryPerMonth = (expenses) => {
    let expensesByMonthByCategory = {};

    expenses.forEach((expense) => {
        const date = new Date(expense.timestamp);
        const month = date.getMonth();
        const year = date.getFullYear();
        const key = `${year}-${month}`;
        const total = (expensesByMonthByCategory[expense.mainCategoryId]?.[key] || 0) + expense.amount;
        
        expensesByMonthByCategory = {
            ...expensesByMonthByCategory,
            [expense.mainCategoryId]: {
                ...expensesByMonthByCategory[expense.mainCategoryId],
                [key]: total,
            }
        }
    });

    const averages = {};
    Object.entries(expensesByMonthByCategory).forEach(([categoryId, expensesSumByDate]) => {
        averages[categoryId] = Object.values(expensesSumByDate).reduce((acc, curr) => acc + curr, 0) / Object.values(expensesSumByDate).length;
    });

    return averages;
};