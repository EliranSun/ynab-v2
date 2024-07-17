import {useMemo, useState} from "react";
import {isSameMonth} from "date-fns";
import {Trans} from "@lingui/macro";

export const SimilarExpenses = ({expense, existingExpenses = []}) => {
    const [isSameMonthCheck, setIsSameMonthCheck] = useState(false);
    const similarExpenses = useMemo(() => {
        if (!expense.name) {
            return [];
        }

        return existingExpenses.filter((existingExpense) => {
            const sameName = existingExpense.name === expense.name;
            const sameMonth = isSameMonth(new Date(existingExpense.timestamp), new Date(expense.timestamp));

            if (isSameMonthCheck) {
                return sameName && sameMonth;
            }

            return sameName;
        }).sort((a, b) => {
            return b.timestamp - a.timestamp;
        })
    }, [expense, existingExpenses, isSameMonthCheck]);

    return (
        <div className="m-4">
            <div className="text-sm flex gap-2">
                <input
                    type="checkbox"
                    checked={isSameMonthCheck}
                    onChange={(event) => {
                        setIsSameMonthCheck(event.target.checked);
                    }}
                />
                <Trans>Show same month only</Trans>
            </div>
            <div className="flex overflow-x-auto w-full gap-2">
                {similarExpenses.map(item => {
                    return (
                        <div
                            key={item.id}
                            className="bg-blue-300 rounded p-1 text-xs flex flex-col min-w-fit">
                            <span>{item.name}</span>
                            <span><b>{item.amountCurrency}</b></span>
                            {/*<span>{item.date}</span>*/}
                            <span>{item.note}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}