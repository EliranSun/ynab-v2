import {createContext, useEffect, useMemo, useState} from "react";
import {addBudget, getBudget} from "../../utils";
import {InitBudget} from "../../constants/init-budget";

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
    const [budget, setBudget] = useState(InitBudget);

    useEffect(() => {
        (async () => {
            const budget = await getBudget();
            if (budget['8.2023']) {
                console.info("Fetched budget is using old structure, using hardcoded budget instead")
                return;
            }

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
                    await addBudget({
                        // dateKey,
                        categoryId,
                        subcategoryId,
                        amount,
                    });

                    setBudget({
                        ...budget,
                        [categoryId]: {
                            [subcategoryId]: amount,
                        },
                    });
                },
            }}
        >
            {children}
        </BudgetContext.Provider>
    );
};
