import { noop, orderBy } from "lodash";
import { formatCurrency } from "../../utils";
import ExpensesChart from "./ExpensesChart";
import { X } from "@phosphor-icons/react";

const SubcategoryExpensesList = ({
  id = null,
  onSubcategoryClick = noop,
  expensesPerMonthPerCategory = {}
}) => {
  return (
      <ul
          dir="rtl"
          onClick={() => onSubcategoryClick(null)}
          className="absolute z-10 top-0 left-full bg-white p-4 w-68 drop-shadow-2xl text-right">
        <button>
          <X/>
        </button>
        <ExpensesChart
            data={Object.entries(expensesPerMonthPerCategory).map(([date, { amount }]) => ({
              x: date,
              y: amount
            })).sort((a, b) => {
              return new Date(a.x).getTime() - new Date(b.x).getTime();
            })}/>
        {orderBy(Object.entries(expensesPerMonthPerCategory), ([date]) => {
          const day = date.split('.')[0];
          const month = date.split('.')[1];
          const year = date.split('.')[2];
          return new Date(year, month, day).getTime();
        }, ['desc'])
            .map(([monthName, { expenses, amount }], index) => {
              return (
                  <>
                    {index > 0 && <hr/>}
                    <div className="my-4">
                      <b className="">{monthName}: {formatCurrency(amount)}</b>
                      <div>
                        {expenses.map((expense) => {
                          return (
                              <div>
                                ▪ {expense.name} {expense.amount}
                              </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
              );
            })}
      </ul>
  )
};

export default SubcategoryExpensesList;