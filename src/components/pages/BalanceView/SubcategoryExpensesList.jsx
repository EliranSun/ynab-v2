import {noop, orderBy} from "lodash";
import {formatCurrency} from "../../../utils";
import {X} from "@phosphor-icons/react";
import {useContext, useMemo} from "react";
import {isSameMonth} from "date-fns";
import {Title} from "../../atoms";
import {BUTTON_SIZE} from "../../../constants";
import {ExpensesContext} from "../../../context";

const isMobile = window.innerWidth < 768;

const ListBox = ({children, ...rest}) => {
    return (
        <div
            {...rest}
            className="w-full bg-white p-4 drop-shadow-xl">
            {children}
        </div>
    );
}
const SubcategoryExpensesList = ({
                                     timestamp = null,
                                     subcategory = {},
                                     onSubcategoryClick = noop,
                                 }) => {
    const {expensesPerMonthPerCategory} = useContext(ExpensesContext);

    const data = useMemo(() => {
        const subcategoryId = subcategory.id;
        if (!subcategoryId || Object.keys(expensesPerMonthPerCategory).length === 0)
            return [];

        const categoryExpenses = expensesPerMonthPerCategory[subcategoryId];

        if (!categoryExpenses)
            return [];

        return Object.entries(categoryExpenses).map(([date, {amount, expenses, timestamp}]) => ({
            x: date,
            y: amount,
            timestamp,
            expenses
        }))
            .sort((a, b) => {
                return b.timestamp - a.timestamp;
            })
    }, [subcategory, expensesPerMonthPerCategory]);

    const sameMonthData = data.filter(item => {
        return isSameMonth(item.timestamp, timestamp);
    });

    if (Object.keys(expensesPerMonthPerCategory).length === 0) {
        return (
            <ListBox>
                Loading...
            </ListBox>
        );
    }

    if (data.length === 0) {
        return (
            <ListBox>
                No data
            </ListBox>
        );
    }

    return (
        <ListBox onClick={() => !isMobile && onSubcategoryClick(null)}>
            <button
                className="float-right"
                onClick={() => onSubcategoryClick(null)}>
                <X size={BUTTON_SIZE}/>
            </button>
            <Title>{subcategory.icon} {subcategory.name}</Title>
            <div className="max-h-72 overflow-y-auto">
                {sameMonthData.map(({x: date, y: amount, expenses}) => {
                    return (
                        <div className="my-4">
                            <b className="text-xl">{date}: {formatCurrency(amount)}</b>
                            <div className="overflow-y-auto">
                                {orderBy(expenses, ['timestamp'], ['desc']).map((expense) => {
                                    return (
                                        <div className="my-2">
                                            <div>
                                                <b className="">{expense.name}</b>
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
        </ListBox>
    )
};

export default SubcategoryExpensesList;