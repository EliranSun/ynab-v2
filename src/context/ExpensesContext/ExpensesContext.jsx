import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { noop } from "lodash";
import { addExpenses, deleteExpense, getExpenses, markExpensesAsOriginal, updateExpense } from "../../utils";
import { Categories } from "../../constants";
import { BudgetContext, getDateKey } from "../BudgetContext";
import { isSameMonth } from "date-fns";
import { Expense } from "../../models";

export const ExpensesContext = createContext({
    expenses: {},
    changeExpenseCategoryByName: noop,
});

export const ExpensesContextProvider = ({ children }) => {
    const [expenses, setExpenses] = useState({});
    const [categories, setCategories] = useState({});
    const [categoriesByAmount, setCategoriesByAmount] = useState([]);
    const { budget } = useContext(BudgetContext);

    const expensesArray = useMemo(() => {
        return Object.values(expenses) || [];
    }, [expenses]);

    const expensesPerMonthPerCategory = useMemo(() => {
        const expensesPerMonthPerCategory = {};
        expensesArray.forEach((expense) => {
            const { categoryId } = expense;
            // TODO: util
            const dateKey = new Date(expense.timestamp).toLocaleString("en-IL", {
                // day: "numeric",
                month: "short",
                year: "2-digit",
            });

            if (!expensesPerMonthPerCategory[categoryId]) {
                expensesPerMonthPerCategory[categoryId] = {
                    [dateKey]: {
                        amount: expense.amount,
                        expenses: [expense],
                        timestamp: expense.timestamp,
                    },
                };
            } else if (!expensesPerMonthPerCategory[categoryId][dateKey]) {
                expensesPerMonthPerCategory[categoryId][dateKey] = {
                    amount: expense.amount,
                    expenses: [expense],
                    timestamp: expense.timestamp,
                };
            } else {
                expensesPerMonthPerCategory[categoryId][dateKey] = {
                    amount: expensesPerMonthPerCategory[categoryId][dateKey].amount + expense.amount,
                    expenses: [...expensesPerMonthPerCategory[categoryId][dateKey].expenses, expense],
                    timestamp: expense.timestamp,
                };
            }
        });

        return expensesPerMonthPerCategory;
    }, [expensesArray]);

    useEffect(() => {
        (async () => {
            const expenses = await getExpenses();
            setExpenses(expenses);

            const newCategories = {};
            const budgetKey = getDateKey(new Date().getTime());
            const expensesThisMonth = Object.values(expenses).filter(expense => {
                const date = new Date();
                const expenseDate = new Date(expense.timestamp);

                if (expense.isRecurring) {
                    return (
                        expenseDate.getFullYear() === date.getFullYear()
                    );
                }

                return isSameMonth(expenseDate, date);
            });

            Object.values(expensesThisMonth).forEach(expense => {
                if (!newCategories[expense.mainCategoryId]) {
                    const category = Categories.find(category => category.id === expense.mainCategoryId);
                    const subcategory = category?.subCategories.find(subcategory => subcategory.id === expense.subcategoryId);

                    const categoryBudget = budget[budgetKey]?.[category.id];
                    const categoryBudgetValue = categoryBudget && Object.values(categoryBudget).reduce((acc, subcategory) => {
                        return acc + subcategory;
                    }, 0);

                    newCategories[expense.mainCategoryId] = {
                        ...category,
                        budget: categoryBudgetValue,
                        amount: expense.amount,
                        subcategories: {
                            [expense.subcategoryId]: {
                                ...subcategory,
                                amount: expense.amount,
                            }
                        }
                    };

                    delete newCategories[expense.mainCategoryId].subCategories;
                } else if (!newCategories[expense.mainCategoryId].subcategories[expense.subcategoryId]) {
                    const subcategory = Categories
                        .find(category => category.id === expense.mainCategoryId)?.subCategories
                        .find(subcategory => subcategory.id === expense.subcategoryId);

                    newCategories[expense.mainCategoryId].subcategories[expense.subcategoryId] = {
                        name: subcategory?.name,
                        amount: expense.amount,
                    }
                } else {
                    newCategories[expense.mainCategoryId].subcategories[expense.subcategoryId].amount += expense.amount;
                    // newCategories[expense.mainCategoryId].subcategories.amount += expense.amount;
                    newCategories[expense.mainCategoryId].amount += expense.amount;
                }
            });

            setCategories(newCategories);
            const ordered = Object.values(newCategories).sort((a) => {
                return a.budget - a.amount;
            });
            setCategoriesByAmount(ordered);
        })();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const setExpenseAsRecurring = (expenseId, recurring) => {
        new Array(Number(recurring)).fill(0).forEach((_, index) => {
            const newExpense = {
                ...expenses[expenseId],
                timestamp: expenses[expenseId].timestamp + (index + 1) * 30 * 24 * 60 * 60 * 1000,
                isRecurring: true,
                recurring: 0,
            };

            delete newExpense.id;
            addExpenses([new Expense(newExpense)]);
        });

        setExpenses({
            ...expenses,
            [expenseId]: {
                ...expenses[expenseId],
                recurring,
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
                categories,
                categoriesByAmount,
                setExpenseAsRecurring,
                setExpenseAsIncome,
                changeExpenseCategory,
                deleteExpense,
                setExpenseNote,
                expensesArray,
                markExpensesAsOriginal,
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
                refetch: async () => {
                    const expenses = await getExpenses();
                    setExpenses(expenses);
                },
            }}
        >
            {children}
        </ExpensesContext.Provider>
    );
};
