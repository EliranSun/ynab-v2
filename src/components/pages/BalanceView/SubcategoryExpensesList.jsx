import {noop, orderBy} from "lodash";
import {formatCurrency} from "../../../utils";
import {X} from "@phosphor-icons/react";
import {useContext, useMemo} from "react";
import {isSameMonth} from "date-fns";
import {Title} from "../../atoms";
import {BUTTON_SIZE} from "../../../constants";
import {ExpensesContext} from "../../../context";
import ExpensesChart from "./ExpensesChart";
import Expense from "../ExpenseView/Expense";

const isMobile = window.innerWidth < 768;

const ListBox = ({children, ...rest}) => {
    return (
        <div
            {...rest}
            className="w-full bg-white p-4 border-l h-full">
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

        return Object.entries(categoryExpenses)
            .map(([date, {amount, expenses, timestamp}]) => ({
                x: date,
                y: amount || 0,
                timestamp,
                expenses
            }))
            .sort((a, b) => {
                return b.timestamp - a.timestamp;
            })
            .reverse();
    }, [subcategory, expensesPerMonthPerCategory]);

    const sameMonthData = data.filter(item => {
        return isSameMonth(item.timestamp, timestamp);
    })[0];

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

    const amountCurrency = sameMonthData ? formatCurrency(sameMonthData.y, false, false) : 0;

    return (
        <ListBox onClick={() => !isMobile && onSubcategoryClick(null)}>
            <button
                className="float-right"
                onClick={() => onSubcategoryClick(null)}>
                <X size={BUTTON_SIZE}/>
            </button>
            <Title>
                {subcategory.icon} {subcategory.name} - {amountCurrency}
            </Title>
            <ExpensesChart data={data}/>
            <div className="overflow-y-auto max-h-[700px]">
                {sameMonthData ? orderBy(sameMonthData.expenses, ['amount', 'timestamp'], ['desc']).map((expense) => {
                    return (
                        <Expense
                            isListView
                            key={expense.id}
                            expense={expense}/>
                    );
                }) : null}
            </div>
        </ListBox>
    )
};

export default SubcategoryExpensesList;