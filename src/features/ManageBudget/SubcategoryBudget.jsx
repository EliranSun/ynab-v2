import {useState, useEffect} from "react";
import {getAverageSubcategoryAmount, getLastSubcategoryAmount} from "../../utils/expenses";
import {updateBudget} from "../../utils/db";

export const SubcategoryBudget = ({
                                      subcategory = {},
                                      budget = {},
                                      expenses = {},
                                      cutoffInMonths = 3,
                                  }) => {
    const [amount, setAmount] = useState(0);
    // const average = useMemo(() => {
    //     return getAverageSubcategoryAmount(id, expenses, cutoffInMonths);
    // }, [id, cutoffInMonths, expenses]);
    // const last = useMemo(() => {
    //     return getLastSubcategoryAmount(id, expenses);
    // }, [id, expenses]);

    useEffect(() => {
        if (budget.amount) {
            setAmount(budget.amount);
        }
    }, [budget.amount]);

    return (
        <div className="flex flex-col w-fit justify-center items-start text-right bg-white">
            <span className="flex items-center">                
                <span>₪</span>
            <input
                type="text"
                className="text-3xl font-mono w-40 px-2 text-right"
                value={amount}
                onChange={event => setAmount(Number(event.target.value))}
                onBlur={async () => {
                    await updateBudget({
                        amount,
                        id: budget.id,
                        subcategoryId: subcategory.id,
                    });
                }}/>
                </span>
            <p>{subcategory.icon} {subcategory.name}</p>
            {/*<div className="flex gap-2 text-xs">*/}
            {/*    <div className="flex flex-col items-center">*/}
            {/*        <span>{formatCurrency(average, false, false)}</span>*/}
            {/*        <Trans>Average</Trans>*/}
            {/*    </div>*/}
            {/*    <div className="flex flex-col items-center">*/}
            {/*        <span>{formatCurrency(last, false, false)}</span>*/}
            {/*        <Trans>Last</Trans>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
}