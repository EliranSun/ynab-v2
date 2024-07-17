import {createContext, useEffect, useState} from "react";
import {getBudget} from "../../utils/db";

export const BudgetContext = createContext({
    budget: [],
    setBudget: ({amount, categoryId, subcategoryId, timestamp}) => void 0,
});

export const getDateKey = (timestamp) => {
    return new Date(timestamp).toLocaleString("he-IL", {
        month: "numeric",
        year: "numeric",
    });
};
export const BudgetContextProvider = ({children}) => {
    const [budget, setBudget] = useState([]);

    useEffect(() => {
        (async () => {
            const budget = await getBudget();
            setBudget(budget);
        })();
    }, []);

    return (
        <BudgetContext.Provider
            value={[
                budget,
                setBudget,
            ]}
        >
            {children}
        </BudgetContext.Provider>
    );
};
