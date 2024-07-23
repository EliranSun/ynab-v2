import {useState, useEffect, useMemo, useContext} from "react";
import {getAverageSubcategoryAmount, getLastSubcategoryAmount} from "../../utils/expenses";
import {updateBudget} from "../../utils/db";
import {formatCurrency} from "../../utils";
import {Trans} from "@lingui/macro";
import classNames from "classnames";
import {Spinner} from "@phosphor-icons/react";
import {BudgetContext, ExpensesContext} from "../../context";

export const SubcategoryBudget = ({
    subcategory = {},
    budget = {},
    expenses = {},
    cutoffInMonths,
    isLast,
}) => {
    const {fetchBudget} = useContext(BudgetContext);
    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const average = useMemo(() => {
        return getAverageSubcategoryAmount(subcategory.id, expenses, cutoffInMonths);
    }, [subcategory.id, cutoffInMonths, expenses]);

    const last = useMemo(() => {
        return getLastSubcategoryAmount(subcategory.id, expenses);
    }, [subcategory.id, expenses]);

    useEffect(() => {
        if (budget.amount) {
            setAmount(budget.amount);
        }
    }, [budget.amount]);

    if (isLoading) {
        return (
            <div className="w-44 h-12 bg-white flex items-center justify-center">
                <Spinner className="animate-spin"/>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col w-fit justify-center items-start text-right bg-white">
            <span className="flex items-center">                
                <span>₪</span>
            <input
                type="text"
                className="text-3xl font-mono w-40 px-2 text-right"
                value={amount}
                onFocus={() => setIsFocused(true)}
                onChange={event => setAmount(Number(event.target.value))}
                onBlur={async () => {
                    setIsFocused(false);
                    if (amount === 0 || amount === budget.amount) {
                        return;
                    }

                    setIsLoading(true);
                    await updateBudget({
                        amount,
                        id: budget.id,
                        subcategoryId: subcategory.id,
                    });
                    await fetchBudget();
                    setIsLoading(false);
                }}/>
                </span>
            <p>{subcategory.icon} {subcategory.name}</p>
            {isFocused ?
                <div
                    className={classNames({
                        "shadow-xl bg-white mr-4 p-8 border rounded-xl flex flex-col gap-4 max-h-96 overflow-y-auto": true,
                        "absolute z-20 top-0": true,
                        "right-full": !isLast,
                        "left-full": isLast,
                    })}>
                    <div className="flex text-sm gap-2">
                        <div className="flex flex-col items-center bg-gray-100 px-4">
                            <span>{formatCurrency(average.amount, false, false)}</span>
                            <Trans>Average</Trans>
                        </div>
                        <div className="flex flex-col items-center bg-gray-100 px-4">
                            <span>{formatCurrency(last, false, false)}</span>
                            <Trans>Last</Trans>
                        </div>
                    </div>
                    <ol className="text-sm">
                        {average.expenses?.map(expense =>
                            <li key={expense.id}>{expense.name}</li>)}
                    </ol>
                </div> : null}
        </div>
    );
}