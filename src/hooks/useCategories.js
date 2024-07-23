import {BudgetContext, ExpensesContext} from "../context";
import {useContext, useEffect, useState} from "react";
import {getExpensesSummary} from "../utils/expenses";
import {CategoriesContext} from "../context/CategoriesContext";

export const useCategories = (timestamp) => {
    const {budget} = useContext(BudgetContext);
    const {expenses} = useContext(ExpensesContext);
    const {categories: fetchedCategories} = useContext(CategoriesContext);
    const [categories, setCategories] = useState({summary: [], totalExpenses: 0, totalIncome: 0});

    useEffect(() => {
        if (!budget || !timestamp)
            return;

        getExpensesSummary({
            budget,
            timestamp,
            categories: fetchedCategories,
            expenses,
        })
            .then((results) => {
                setCategories(results);
            })
            .catch(error => {
                console.error(error);
            });
    }, [expenses, budget, timestamp, fetchedCategories]);

    return categories;
};