import { noop, orderBy } from "lodash";
import { formatCurrency } from "../../../utils";
import { X } from "@phosphor-icons/react";
import { useContext, useMemo } from "react";
import { isSameMonth } from "date-fns";
import { Title } from "../../atoms";
import { BUTTON_SIZE } from "../../../constants";
import { ExpensesContext } from "../../../context";
import ExpensesChart from "./ExpensesChart";
import Expense from "../ExpenseView/Expense";
import { formatDate } from "../../../utils/date";

const isMobile = window.innerWidth < 768;

const ListBox = ({ children, ...rest }) => {
    return (
        <div
            {...rest}
            className="w-full bg-white p-4 h-full">
            {children}
        </div>
    );
}
const SubcategoryExpensesList = ({
    timestamp = null,
    subcategory = {},
    isLean = false,
    selectedSubcategoryId,
    onSubcategoryClick = noop,
}) => {
    const { expensesPerMonthPerCategory } = useContext(ExpensesContext);
    const data = useMemo(() => {
        if (!selectedSubcategoryId || Object.keys(expensesPerMonthPerCategory).length === 0)
            return [];

        const categoryExpenses = expensesPerMonthPerCategory[selectedSubcategoryId];

        if (!categoryExpenses)
            return [];

        return Object.entries(categoryExpenses)
            .map(([date, { amount, expenses, timestamp }]) => ({
                x: date,
                y: amount || 0,
                timestamp,
                expenses
            }))
            .sort((a, b) => {
                return b.timestamp - a.timestamp;
            })
            .reverse();
    }, [selectedSubcategoryId, expensesPerMonthPerCategory]);


    const sameMonthData = useMemo(() => {
        return data.filter(item => {
            console.debug({
                itemName: item.x,
                itemDate: new Date(item.timestamp),
                currentDate: new Date(timestamp),
            });
            return isSameMonth(item.timestamp, timestamp);
        })[0];
    }, [data, timestamp]);

    const formattedDate = useMemo(() => formatDate(timestamp), [timestamp]);

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
                No data for {formattedDate}
            </ListBox>
        );
    }

    const amountCurrency = sameMonthData ? formatCurrency(sameMonthData.y, false, false) : 0;

    if (isLean) {
        return (
            <div>
                {sameMonthData ? orderBy(sameMonthData.expenses, ['amount', 'timestamp'], ['desc'])
                    .map((expense) => {
                        return (
                            <Expense
                                isListView
                                isLean
                                key={expense.id}
                                expense={expense} />
                        );
                    }) : null}
                <ExpensesChart data={data} isLean />
            </div>
        )
    }

    return (
        <ListBox onClick={() => !isMobile && onSubcategoryClick(null)}>
            <ExpensesChart data={data} />
            <div className="overflow-y-auto h-60 shadow-lg p-8 rounded-xl">
                <button
                    className="float-right"
                    onClick={() => onSubcategoryClick(null)}>
                    <X size={BUTTON_SIZE} />
                </button>
                <Title>
                    {subcategory.icon} {subcategory.name} - {amountCurrency}
                </Title>
                {sameMonthData ? orderBy(sameMonthData.expenses, ['amount', 'timestamp'], ['desc'])
                    .map((expense) => {
                        return (
                            <Expense
                                isListView
                                key={expense.id}
                                expense={expense} />
                        );
                    }) : null}
            </div>
        </ListBox>
    )
};

export default SubcategoryExpensesList;