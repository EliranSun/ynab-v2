import {useState, useEffect, useMemo} from "react";
import {getAverageSubcategoryAmount, getLastSubcategoryAmount} from "../../utils/expenses";
import {updateBudget} from "../../utils/db";
import {formatCurrency} from "../../utils";
import {Trans} from "@lingui/macro";

export const SubcategoryBudget = ({
                                      subcategory = {},
                                      budget = {},
                                      expenses = {},
                                      cutoffInMonths,
                                  }) => {
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

    console.log({average});

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
                    if (amount === budget.amount) {
                        return;
                    }

                    await updateBudget({
                        amount,
                        id: budget.id,
                        subcategoryId: subcategory.id,
                    });
                }}/>
                </span>
            <p>{subcategory.icon} {subcategory.name}</p>
            {isFocused ?
                <div
                    className="absolute shadow-xl z-20 bg-white right-full mr-4 p-8 border rounded-xl flex flex-col">
                    <div className="flex gap-2 text-sm">
                        <div className="flex flex-col items-center">
                            <span>{formatCurrency(average.amount, false, false)}</span>
                            <Trans>Average</Trans>
                        </div>
                        <div className="flex flex-col items-center">
                            <span>{formatCurrency(last, false, false)}</span>
                            <Trans>Last</Trans>
                        </div>
                    </div>
                    <ol className="text-xs">
                        {average.expenses?.map(expense => <li key={expense.name}>{expense.name}</li>)}
                    </ol>
                </div> : null}
        </div>
    );
}