import {getExpenses} from "../utils";
import {BudgetContext, getDateKey} from "../context";
import {isSameMonth} from "date-fns";
import {Categories} from "../constants";
import {useContext, useEffect, useState} from "react";
import {orderBy} from "lodash";

const fetch = async (budget, timestamp) => {
    if (!budget || !timestamp) return [];

    const expenses = await getExpenses();

    const newCategories = {};
    const date = new Date(timestamp);
    const budgetKey = getDateKey(timestamp);
    const expensesThisMonth = Object.values(expenses).filter(expense => {
        const expenseDate = new Date(expense.timestamp);

        if (expense.isRecurring)
            return expenseDate.getFullYear() === date.getFullYear();

        return isSameMonth(expenseDate, date);
    });

    let totalExpenses = 0;
    let totalIncome = 0;

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

        return {
            ...category,
            amount: totalAmountInCategory,
            subcategories,
        };
    });

    // Object.values(expensesThisMonth).forEach(expense => {
    //     console.log(expense.mainCategoryId);
    //     if (!newCategories[expense.mainCategoryId]) {
    //         const category = Categories.find(category => category.id === expense.mainCategoryId);
    //         const subcategory = category?.subCategories.find(subcategory => subcategory.id === expense.subcategoryId);
    //         const categoryBudget = budget[budgetKey]?.[category.id];
    //         const categoryBudgetValue = categoryBudget && Object.values(categoryBudget).reduce((acc, subcategory) => {
    //             return acc + subcategory;
    //         }, 0);
    //
    //         newCategories[expense.mainCategoryId] = {
    //             ...category,
    //             budget: categoryBudgetValue,
    //             amount: expense.amount,
    //             subcategories: {
    //                 [expense.subcategoryId]: {
    //                     ...subcategory,
    //                     amount: expense.amount,
    //                 }
    //             }
    //         };
    //
    //         delete newCategories[expense.mainCategoryId].subCategories;
    //     } else if (!newCategories[expense.mainCategoryId].subcategories[expense.subcategoryId]) {
    //         const subcategory = Categories
    //             .find(category => category.id === expense.mainCategoryId)?.subCategories
    //             .find(subcategory => subcategory.id === expense.subcategoryId);
    //
    //         newCategories[expense.mainCategoryId].subcategories[expense.subcategoryId] = {
    //             name: subcategory?.name,
    //             amount: expense.amount,
    //         }
    //     } else {
    //         newCategories[expense.mainCategoryId].subcategories[expense.subcategoryId].amount += expense.amount;
    //         newCategories[expense.mainCategoryId].amount += expense.amount;
    //     }
    // });

    // console.log({newCategories});
    // return orderBy(Object.values(newCategories), 'amount', 'desc');
    return {
        summary: orderBy(summary, 'amount', 'desc'),
        totalExpenses,
        totalIncome,
    };
};

export const useCategories = (timestamp) => {
    const {budget} = useContext(BudgetContext);
    const [categories, setCategories] = useState({summary: [], totalExpenses: 0, totalIncome: 0});

    useEffect(() => {
        fetch(budget, timestamp)
            .then((results) => {
                setCategories(results);
            })
            .catch(error => {
                console.error(error);
            });
    }, [budget, timestamp]);

    return categories;
};