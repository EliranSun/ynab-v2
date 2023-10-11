import { useMemo, useState } from "react";
import { isSameMonth } from "date-fns";

export const SimilarExpenses = ({ expense, existingExpenses = [] }) => {
  const [isSameMonthCheck, setIsSameMonthCheck] = useState(false);
  const similarExpenses = useMemo(() => {
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
    <div className="flex gap-1 overflow-x-auto">
      <div className="text-sm">
        <span>Similar expenses</span>
        <input type="checkbox"
               checked={isSameMonthCheck}
               onChange={(event) => {
                 setIsSameMonthCheck(event.target.checked);
               }}
        />same month?
      </div>
      <div className="flex overflow-x-scroll max-w-3xl gap-2">
        {similarExpenses.map(item => {
          return (
            <div className="w-40 bg-blue-300 rounded p-1 text-xs flex flex-col">
              <span>{item.name}</span>
              <span><b>{item.amountCurrency}</b></span>
              <span>{item.date}</span>
              <span>{item.note}</span>
            </div>
          );
        })}
      </div>
    </div>
  )
}