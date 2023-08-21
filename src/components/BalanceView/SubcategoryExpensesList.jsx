import { noop } from "lodash";
import { formatCurrency } from "../../utils";
import ExpensesChart from "./ExpensesChart";
import { X } from "@phosphor-icons/react";
import { useMemo } from "react";

const SubcategoryExpensesList = ({
  id = null,
  onSubcategoryClick = noop,
  expensesPerMonthPerCategory = {}
}) => {
  const data = useMemo(() => {
    return Object.entries(expensesPerMonthPerCategory).map(([date, { amount, expenses, timestamp }]) => ({
      x: date,
      y: amount,
      timestamp,
      expenses
    }))
      .sort((a, b) => {
        return b.timestamp - a.timestamp;
      })
  }, []);

  console.log({ data });

  return (
    <ul
      dir="rtl"
      onClick={() => onSubcategoryClick(null)}
      className="absolute z-10 top-0 left-full bg-white p-4 w-68 drop-shadow-2xl text-right">
      <button>
        <X/>
      </button>
      <ExpensesChart data={data}/>
      {data.map(({ x: date, y: amount, expenses }, index) => {
        return (
          <div className="my-4">
            <b className="">{date}: {formatCurrency(amount)}</b>
            <div className="">
              {expenses.map((expense) => {
                return (
                  <div className="">
                    - {expense.name} {expense.amount}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </ul>
  )
};

export default SubcategoryExpensesList;