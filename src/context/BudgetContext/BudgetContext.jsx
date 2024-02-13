import {createContext, useEffect, useMemo, useState} from "react";
import {addBudget, getBudget} from "../../utils";

export const BudgetContext = createContext({
    budget: {},
    setBudget: ({amount, categoryId, subcategoryId, timestamp}) => void 0,
});

export const getDateKey = (timestamp) => {
    return new Date(timestamp).toLocaleString("he-IL", {
        month: "numeric",
        year: "numeric",
    });
};

export const BudgetContextProvider = ({children}) => {
    const [budget, setBudget] = useState({});

    useEffect(() => {
        (async () => {
            const budget = await getBudget();
            console.log({budget});
            setBudget(budget);
        })();
    }, []);

    return (
        <BudgetContext.Provider
            value={{
                budget,
                setBudget: async ({amount, categoryId, subcategoryId, timestamp}) => {
                    console.debug("BudgetContext setBudget", amount, categoryId, timestamp);
                    // TODO: util or date controller
                    const dateKey = "8.2023"// getDateKey(timestamp);
                    await addBudget({
                        dateKey,
                        categoryId,
                        subcategoryId,
                        amount,
                    });

                    setBudget({
                        ...budget,
                        [dateKey]: {
                            ...budget[dateKey],
                            [categoryId]: {
                                [subcategoryId]: amount,
                            },
                        },
                    });
                },
            }}
        >
            {children}
        </BudgetContext.Provider>
    );
};
