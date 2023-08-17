import { noop, orderBy } from "lodash";
import { formatCurrency } from "../../utils";
import ExpensesChart from "./ExpensesChart";

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
            <button>✖️</button>
            <ExpensesChart
                data={Object.entries(expensesPerMonthPerCategory).map(([monthYear, { amount }]) => ({
                    x: monthYear,
                    y: amount
                }))}/>
            {orderBy(Object.entries(expensesPerMonthPerCategory), ([monthYear]) => {
                const day = '1';
                const month = monthYear.split('.')[0];
                const year = monthYear.split('.')[1];
                
                const date = new Date(year, month, day);
                return date.getTime();
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