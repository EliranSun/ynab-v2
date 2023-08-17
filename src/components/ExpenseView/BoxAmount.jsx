import { useMemo } from "react";

export const BoxAmount = ({ expenses = [], min = 1000, max = 7500 }) => {
    let count = 0;
    const totalAmount = useMemo(() => {
        return expenses
            .reduce((acc, curr) => {
                if (max === -1 && curr.amount >= min && !curr.isIncome) {
                    count++;
                    return acc + curr.amount;
                }
                
                if (min === -1 && curr.amount < max && !curr.isIncome) {
                    count++;
                    return acc + curr.amount;
                }
                
                if (curr.amount < max && curr.amount >= min && !curr.isIncome) {
                    count++;
                    return acc + curr.amount;
                }
                return acc;
            }, 0)
            .toFixed(2);
    }, [expenses, max, min, count]);
    
    // TODO: a pie chart here
    return (
        <div className="bg-gray-200 w-48 h-48 flex flex-col items-center justify-center">
            <span>
                {min === -1 ? "∞" : min} - {max === -1 ? "∞" : max}
            </span>
            <span>{totalAmount} NIS</span>
            <span>({count} Items)</span>
        </div>
    );
};