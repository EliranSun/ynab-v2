import { createContext, useEffect, useMemo, useState } from "react";
import { noop } from "lodash";
import { addExpenses, getExpenses, updateExpense } from "../../utils";

export const ExpensesContext = createContext({
    expenses: {},
    changeExpenseCategoryByName: noop,
});

export const ExpensesContextProvider = ({ children }) => {
    const [expenses, setExpenses] = useState({});
    const expensesArray = useMemo(() => {
        return Object.values(expenses);
    }, [expenses]);
    const expensesPerMonthPerCategory = useMemo(() => {
        const expensesPerMonthPerCategory = {};
        
        expensesArray.forEach((expense) => {
            const { categoryId } = expense;
            // TODO: util
            const dateKey = new Date(expense.timestamp).toLocaleString("he-IL", {
                month: "numeric",
                year: "numeric",
            });
            
            if (!expensesPerMonthPerCategory[categoryId]) {
                expensesPerMonthPerCategory[categoryId] = {
                    [dateKey]: {
                        amount: expense.amount,
                        expenses: [expense],
                    },
                };
            } else if (!expensesPerMonthPerCategory[categoryId][dateKey]) {
                expensesPerMonthPerCategory[categoryId][dateKey] = {
                    amount: expense.amount,
                    expenses: [expense],
                };
            } else {
                expensesPerMonthPerCategory[categoryId][dateKey] = {
                    amount: expensesPerMonthPerCategory[categoryId][dateKey].amount + expense.amount,
                    expenses: [...expensesPerMonthPerCategory[categoryId][dateKey].expenses, expense],
                };
            }
        });
        
        return expensesPerMonthPerCategory;
    }, [expensesArray]);
    
    useEffect(() => {
        (async () => {
            const expenses = await getExpenses();
            setExpenses(expenses);
        })();
    }, []);
    
    const setExpenseAsRecurring = (expenseId, isRecurring) => {
        updateExpense(expenseId, { isRecurring });
        setExpenses({
            ...expenses,
            [expenseId]: {
                ...expenses[expenseId],
                isRecurring,
            },
        });
    };
    
    const setExpenseAsIncome = (expenseId, isIncome) => {
        updateExpense(expenseId, { isIncome });
        setExpenses({
            ...expenses,
            [expenseId]: {
                ...expenses[expenseId],
                isIncome,
            },
        });
    };
    
    const setExpenseNote = async (expenseId, note) => {
        if (note === expenses[expenseId].note) {
            return;
        }
        
        await updateExpense(expenseId, { note });
        
        alert('Note updated successfully!');
        
        setExpenses({
            ...expenses,
            [expenseId]: {
                ...expenses[expenseId],
                note,
            },
        });
    };
    
    const changeExpenseCategory = async (expenseId, categoryId, note = "") => {
        const expense = expenses[expenseId];
        const allExpensesWithTheSameName = expensesArray.filter(
            ({ name }) => name === expense.name
        );
        if (!expense.isThirdParty) {
            allExpensesWithTheSameName.forEach((expense) => {
                updateExpense(expense.id, { categoryId, note });
                setExpenses({
                    ...expenses,
                    [expense.id]: {
                        ...expenses[expense.id],
                        categoryId,
                    },
                });
            });
            
            return;
        }
        
        await updateExpense(expenseId, { categoryId, note });
        setExpenses({
            ...expenses,
            [expenseId]: {
                ...expenses[expenseId],
                categoryId,
            },
        });
    };
    
    return (
        <ExpensesContext.Provider
            value={{
                expenses,
                expensesPerMonthPerCategory,
                refetch: async () => {
                    const expenses = await getExpenses();
                    setExpenses(expenses);
                },
                setExpenseAsRecurring,
                setExpenseAsIncome,
                changeExpenseCategory,
                setExpenseNote,
                expensesArray,
                setExpenses: async (newExpenses = []) => {
                    const expensesObject = {};
                    newExpenses.forEach((expense) => {
                        expensesObject[expense.id] = expense;
                    });
                    
                    try {
                        await addExpenses(newExpenses);
                        setExpenses(expensesObject);
                    } catch (error) {
                        alert(`Error adding expenses - ${error.message}`);
                    }
                },
            }}
        >
            {children}
        </ExpensesContext.Provider>
    );
};
