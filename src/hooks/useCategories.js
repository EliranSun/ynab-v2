import {BudgetContext} from "../context";
import {useContext, useEffect, useState} from "react";
import {getExpensesSummary} from "../utils/expenses";

export const useCategories = (timestamp) => {
    const [budget] = useContext(BudgetContext);
    const [categories, setCategories] = useState({summary: [], totalExpenses: 0, totalIncome: 0});

    useEffect(() => {
        if (!budget || !timestamp)
            return;

        getExpensesSummary({budget, timestamp})
            .then((results) => {
                setCategories(results);
            })
            .catch(error => {
                console.error(error);
            });
    }, [budget, timestamp]);

    return categories;
};