import {useContext, useMemo} from "react";
import {BudgetContext} from "../context";
import {getLastBudgetByCategory} from "../utils/budget";

export const useCategoryBudget = (categoryId) => {
    const [budget] = useContext(BudgetContext);

    return useMemo(() => {
        return getLastBudgetByCategory(budget, categoryId);
    }, [budget, categoryId]);
};