import {BudgetContext} from "../context";
import {useContext, useEffect, useState} from "react";
import {getExpensesSummary} from "../utils/expenses";
import {CategoriesContext} from "../context/CategoriesContext";

export const useCategories = (timestamp) => {
    const [budget] = useContext(BudgetContext);
    const [categories, setCategories] = useState({summary: [], totalExpenses: 0, totalIncome: 0});
    const {categories: fetchedCategories} = useContext(CategoriesContext);

    useEffect(() => {
        if (!budget || !timestamp)
            return;

        getExpensesSummary({budget, timestamp, categories: fetchedCategories})
            .then((results) => {
                setCategories(results);
            })
            .catch(error => {
                console.error(error);
            });
    }, [budget, timestamp, fetchedCategories]);

    return categories;
};