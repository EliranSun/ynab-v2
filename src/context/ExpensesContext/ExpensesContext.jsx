import {createContext, useCallback, useContext, useState} from "react";
import {noop} from "lodash";
import {addExpenses, deleteExpense, markExpensesAsOriginal, updateExpense} from "../../utils";
import {Categories, getCategoryBySubcategoryId} from "../../constants";
import {BudgetContext, getDateKey} from "../BudgetContext";
import {isSameMonth} from "date-fns";
import {Expense} from "../../models";
import {getExpenses} from "../../utils/db";

export const ExpensesContext = createContext({
    expenses: [],
    changeExpenseCategoryByName: noop,
    refetch: noop,
});

const getExpensesPerMonthPerCategory = (expenses = []) => {
    const expensesPerMonthPerCategory = {};
    expenses.forEach((expense) => {
        const {categoryId} = expense;
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
}

export const ExpensesContextProvider = ({children}) => {
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState({});
    const [categoriesByAmount, setCategoriesByAmount] = useState([]);
    // const [expensesArray, setExpensesArray] = useState([]);
    const [expensesPerMonthPerCategory, setExpensesPerMonthPerCategory] = useState({});
    const [budget] = useContext(BudgetContext);

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
        updateExpense(expenseId, {isIncome});
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

        await updateExpense(expenseId, {note});

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
            ({name}) => name === expense.name
        );
        if (!expense.isThirdParty) {
            allExpensesWithTheSameName.forEach((expense) => {
                updateExpense(expense.id, {categoryId, note});
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

        await updateExpense(expenseId, {categoryId, note});
        setExpenses({
            ...expenses,
            [expenseId]: {
                ...expenses[expenseId],
                categoryId,
            },
        });
    };

    const fetchExpenses = useCallback(async () => {
        const expenses = await getExpenses();
        const modeledExpenses = expenses.map(expense => new Expense(expense));

        console.log({modeledExpenses});

        setExpenses(modeledExpenses);
        // setExpensesArray(Object.values(modeledExpenses));
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

    return (
        <ExpensesContext.Provider
            value={{
                expenses,
                // expensesArray,
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
                setExpenses: async (newExpenses = []) => {
                    const expensesObject = {};
                    newExpenses.forEach((expense) => {
                        expensesObject[expense.id] = expense;
                    });

                    try {
                        await addExpenses(newExpenses);
                        setExpenses(expensesObject);
                    } catch (error) {
                        console.error(`Error adding expenses - ${error.message}`);
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
