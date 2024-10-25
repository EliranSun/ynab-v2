import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { noop } from "lodash";
import { deleteExpense, markExpensesAsOriginal, updateExpense } from "../../utils";
import { Categories, getCategoryBySubcategoryId } from "../../constants";
import { BudgetContext } from "../BudgetContext";
import { isSameMonth } from "date-fns";
import { Expense } from "../../models";
import { getAllExpensesWithPagination, addExpenses } from "../../utils/db";
import { UserContext } from "../UserContext";
import expensesMock from '../../mocks/expenses.json';

export const ExpensesContext = createContext({
    expenses: [],
    changeExpenseCategoryByName: noop,
    refetch: noop,
    setExpenses: noop,
});

const getExpensesPerMonthPerCategory = (expenses = []) => {
    const expensesPerMonthPerCategory = {};
    expenses.forEach((expense) => {
        const { subcategoryId } = expense;
        // TODO: util
        const dateKey = new Date(expense.timestamp).toLocaleString("en-IL", {
            // day: "numeric",
            month: "short",
            year: "2-digit",
        });

        if (!expensesPerMonthPerCategory[subcategoryId]) {
            expensesPerMonthPerCategory[subcategoryId] = {
                [dateKey]: {
                    amount: expense.amount,
                    expenses: [expense],
                    timestamp: expense.timestamp,
                },
            };
        } else if (!expensesPerMonthPerCategory[subcategoryId][dateKey]) {
            expensesPerMonthPerCategory[subcategoryId][dateKey] = {
                amount: expense.amount,
                expenses: [expense],
                timestamp: expense.timestamp,
            };
        } else {
            expensesPerMonthPerCategory[subcategoryId][dateKey] = {
                amount: expensesPerMonthPerCategory[subcategoryId][dateKey].amount + expense.amount,
                expenses: [...expensesPerMonthPerCategory[subcategoryId][dateKey].expenses, expense],
                timestamp: expense.timestamp,
            };
        }
    });

    return expensesPerMonthPerCategory;
}

export const ExpensesContextProvider = ({ children }) => {
    const [expenses, setExpenses] = useState(process.env.NODE_ENV === "development" ? expensesMock : []);
    const [categories, setCategories] = useState({});
    const [categoriesByAmount, setCategoriesByAmount] = useState([]);
    const [expensesPerMonthPerCategory, setExpensesPerMonthPerCategory] = useState(process.env.NODE_ENV === "development" ? {
        18: {
            [new Date(2024, 10, 16).toLocaleString("en-IL", {
                month: "short",
                year: "2-digit",
            })]: {
                amount: 147,
                expenses: expensesMock,
                timestamp: 1720040400000,
            }
        }
    } : {});
    const { budget } = useContext(BudgetContext);
    const { user } = useContext(UserContext);

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
        const allExpensesWithTheSameName = expenses.filter(
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

    const fetchExpenses = useCallback(async () => {
        const expenses = await getAllExpensesWithPagination();
        const modeledExpenses = expenses.map(expense => new Expense(expense));

        setExpenses(modeledExpenses);
        setExpensesPerMonthPerCategory(getExpensesPerMonthPerCategory(Object.values(modeledExpenses)));

        const newCategories = {};
        const expensesThisMonth = Object.values(modeledExpenses).filter(expense => {
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
                const category = getCategoryBySubcategoryId(expense.subcategoryId)
                const subcategory = category?.subCategories.find(subcategory => subcategory.id === expense.subcategoryId);
                // const categoryBudget = budget?.[category.id];
                // const categoryBudgetValue = categoryBudget && Object.values(categoryBudget).reduce((acc, subcategory) => {
                //     return acc + subcategory;
                // }, 0);

                newCategories[expense.mainCategoryId] = {
                    ...category,
                    // budget: categoryBudgetValue,
                    budget: 0,
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
    }, []);

    useEffect(() => {
        if (!user || !user.id) {
            return;
        }

        fetchExpenses();
    }, [user]);

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
                markExpensesAsOriginal,
                fetchExpenses,
                refetch: fetchExpenses,
                setExpenses: async (newExpenses = []) => {
                    const expensesObject = {};
                    newExpenses.forEach((expense) => {
                        expensesObject[expense.id] = expense;
                    });

                    try {
                        await addExpenses(newExpenses);
                        // setExpenses(expensesObject);
                    } catch (error) {
                        console.error(`Error adding expenses - ${error.message}`);
                    }
                },
            }}
        >
            {children}
        </ExpensesContext.Provider>
    );
};
