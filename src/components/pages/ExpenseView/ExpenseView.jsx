import {useContext, useMemo, useState} from "react";
import {noop, orderBy} from "lodash";
import {ExpensesContext} from "../../../context";
import Expense from "./Expense";
import {isExpenseInMonth} from "../../../utils";
import TopExpensesView from "./TopExpensesView";
import {useDate} from "../../molecules";
import {Button, Title} from "../../atoms";
import {SearchInput} from "./SearchInput";
import {BoxAmount} from "./BoxAmount";
import {SortBy} from "./constants";

const ExpenseView = ({onCategoryClick = noop}) => {
    const {
        expensesArray: expenses = []
    } = useContext(ExpensesContext);
    const [sort, setSort] = useState(SortBy.DATE);
    const {
        isSameDate,
        currentTimestamp,
        toDate,
        formattedDate,
        NextButton,
        PreviousButton
    } = useDate();

    const thisMonthExpenses = useMemo(() => {
        const thisMonth = expenses.filter((expense) => {
            return isExpenseInMonth(expense.timestamp, currentTimestamp);
        });

        return orderBy(thisMonth, sort, "desc");
    }, [expenses, currentTimestamp, sort]);

    return (
        <div className="pb-96">
            <Title>Expenses</Title>
            <h2>Sort by</h2>
            <div className="flex gap-4">
                <Button onClick={() => setSort(SortBy.DATE)}>Date</Button>
                <Button onClick={() => setSort(SortBy.AMOUNT)}>Amount</Button>
                <Button onClick={() => setSort(SortBy.CATEGORY)}>Category</Button>
                <Button onClick={() => setSort(SortBy.NAME)}>Name</Button>
            </div>
            <div className="fixed bottom-5 flex gap-2 md:bottom-10 right-5 md:right-20 bg-white shadow-xl p-2">
                <PreviousButton/>
                <NextButton/>
            </div>
            <TopExpensesView
                date={formattedDate}
                expenses={expenses}
                isSameDate={isSameDate}
                toDate={toDate}
            />
            <div>
                <h2 className="text-2xl my-4 bg-gray-200">Stats for {formattedDate}</h2>
                <h3>Sums</h3>
                <div className="flex gap-4">
                    <BoxAmount expenses={thisMonthExpenses} min={-1} max={-1}/>
                    <BoxAmount expenses={thisMonthExpenses} min={-1} max={100}/>
                    <BoxAmount expenses={thisMonthExpenses} min={100} max={-1}/>
                    <BoxAmount expenses={thisMonthExpenses} min={100} max={1000}/>
                    <BoxAmount expenses={thisMonthExpenses} min={1000} max={10000}/>
                </div>
            </div>
        </div>
    );
};

export default ExpenseView;
