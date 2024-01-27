import { Expense } from "../models";
import { startOfMonth } from "date-fns";

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