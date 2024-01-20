import { noop, orderBy } from "lodash";
import { formatCurrency } from "../../../utils";
import ExpensesChart from "./ExpensesChart";
import { X } from "@phosphor-icons/react";
import { useMemo } from "react";
import { isSameMonth } from "date-fns";
import { Title } from "../../atoms";
import { BUTTON_SIZE } from "../../../constants";

const isMobile = window.innerWidth < 768;

const SubcategoryExpensesList = ({
    onSubcategoryClick = noop,
    expensesPerMonthPerCategory = {},
    timestamp = null,
    title = ''
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
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const sameMonthData = data.filter(item => {
        return isSameMonth(item.timestamp, timestamp);
    });

    return (
        <div
            dir=""
            onClick={() => !isMobile && onSubcategoryClick(null)}
            className="fixed md:absolute z-10 w-full h-[92vh] md:h-fit md:w-fit top-12 md:top-0 left-0 md:left-full bg-white p-4 w-68 drop-shadow-2xl">
            <button
                className="float-right"
                onClick={() => onSubcategoryClick(null)}>
                <X size={BUTTON_SIZE}/>
            </button>
            <Title>{title}</Title>
            <ExpensesChart data={data}/>
            <div className="h-1/2 overflow-y-auto">
                {sameMonthData.map(({ x: date, y: amount, expenses }) => {
                    return (
                        <div className="my-4">
                            <b className="text-xl">{date}: {formatCurrency(amount)}</b>
                            <div className="">
                                {orderBy(expenses, ['timestamp'], ['desc']).map((expense) => {
                                    return (
                                        <div className="my-2">
                                            <div>
                                                {/*<b className="text-lg">{expense.name}</b>*/}
                                                <br/>
                                                <span>{formatCurrency(expense.amount)} • </span>
                                                <span>{expense.date}</span><br/>
                                            </div>
                                            {expense.note &&
                                                <span className="italic">
                                                    {expense.note}
                                                </span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
};

export default SubcategoryExpensesList;