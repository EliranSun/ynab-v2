import {BudgetContext, ExpensesContext} from "../../context";
import {useContext, useMemo, useState} from "react";
import {differenceInDays, getMonth, subDays, isAfter, isBefore, getYear, subYears, format} from "date-fns";
import {formatCurrency} from "../../utils";
import LastExpensesChart from "./LastExpensesChart";
import {LastExpensesFilters} from "./LastExpensesFilters";
import classNames from "classnames";

export const Timeframe = {
    WEEK: "WEEK",
    MONTH: "MONTH",
    QUARTER: "QUARTER",
    YEAR: "YEAR",
};

const INCOME_CATEGORY_ID = '8';

export const LastExpenses = () => {
    const {budget} = useContext(BudgetContext);
    const {expensesArray} = useContext(ExpensesContext);
    const [timeframeName, setTimeframeName] = useState(Timeframe.WEEK);
    const [startDate, setStartDate] = useState(subDays(new Date(), 7));
    const [endDate, setEndDate] = useState(new Date());
    const [sortBy, setSortBy] = useState("timestamp");
    const [filteredItems, setFilteredItems] = useState([]);
    const budgetForTimeframe = useMemo(() => {
        if (!budget || Object.keys(budget).length === 0) {
            return 0;
        }

        const budgetObject = budget['8.2023'];
        console.log({budgetObject});
        const relevantCategories = Object.entries(budgetObject).filter(([key]) => {
            console.log({key, INCOME_CATEGORY_ID});
            return key !== INCOME_CATEGORY_ID;
        });
        let totalBudget = 0;

        console.log({relevantCategories});
        for (const [_, subcategoriesObject] of relevantCategories) {
            totalBudget += Object.values(subcategoriesObject).reduce((acc, amount) => acc + amount, 0);
        }

        switch (timeframeName) {
            default:
            case Timeframe.WEEK:
                return totalBudget / 4;

            case Timeframe.MONTH:
                return totalBudget;

            case Timeframe.QUARTER:
                return totalBudget * 3;

            case Timeframe.YEAR:
                return totalBudget * 12;
        }
    }, [timeframeName, budget]);

    console.log({budgetForTimeframe});

    const lastItems = useMemo(() => {
        const aggregatedByNameExpenses = {};
        for (const item of expensesArray) {
            const outOfRange = isBefore(item.timestamp, startDate) || isAfter(item.timestamp, endDate);
            const itemIsFiltered = filteredItems.some(filteredItem => filteredItem.id === item.id);
            if (item.isIncome || itemIsFiltered || outOfRange) {
                continue;
            }

            if (!aggregatedByNameExpenses[item.name]) {
                aggregatedByNameExpenses[item.name] = {
                    ...item,
                    amount: item.amount,
                };
            } else {
                aggregatedByNameExpenses[item.name].amount += item.amount;
            }
        }

        if (sortBy === "timestamp") {
            return Object.values(aggregatedByNameExpenses).sort((a, b) => b.timestamp - a.timestamp);
        }

        return Object.values(aggregatedByNameExpenses).sort((a, b) => b.amount - a.amount);
    }, [expensesArray, startDate, endDate, sortBy, filteredItems]);

    const totalAmount = useMemo(() => lastItems.reduce((acc, item) => acc + item.amount, 0), [lastItems]);
    const differenceAmount = budgetForTimeframe - totalAmount;
    return (
        <section
            className="m-4 md:w-2/5 h-[80vh] md:h-[90vh] overflow-y-auto bg-neutral-50 shadow-md rounded-lg md:border-8 border-gray-500 md:p-4">
            <LastExpensesFilters
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setTimeframeName={setTimeframeName}/>
            <div className="flex flex-col md:flex-row gap-2">
                <div>
                    <h1 className="md:text-3xl font-mono">Spent</h1>
                    <h2 className="text-7xl font-mono">{formatCurrency(totalAmount, false, false)}</h2>
                </div>
                <div>
                    <h1 className="md:text-3xl font-mono">Budget (for a {timeframeName.toLowerCase()})</h1>
                    <h2 className="text-7xl font-mono">{formatCurrency(budgetForTimeframe, false, false)}</h2>
                </div>
                <div>
                    <h1 className="md:text-3xl font-mono">
                        {differenceAmount >= 0 ? "left to spend! 😁" : "over budget... ☹️"}
                    </h1>
                    <h2 className={classNames({
                        "text-7xl font-mono": true,
                        "text-green-500": differenceAmount >= 0,
                        "text-red-500": differenceAmount < 0,
                    })}>
                        {formatCurrency(differenceAmount, false, false)}
                    </h2>
                </div>
            </div>
            <h3>{formatCurrency(filteredItems.reduce((acc, item) => acc + item.amount, 0), false, false)} filtered</h3>
            <LastExpensesChart expenses={lastItems} timeframeName={timeframeName}/>
            <button className="border rounded p-2 shadow-md"
                    onClick={() => setSortBy(sortBy === "timestamp" ? "amount" : "timestamp")}>
                Sorting by {sortBy}
            </button>
            {lastItems.map(item => {
                return (
                    <div
                        key={item.id}
                        className="flex flex-col md:flex-row justify-between md:items-center p-2 border-b border-gray-500"
                        onClick={() => {
                            setFilteredItems([item, ...filteredItems]);
                        }}>
                        <div>
                            <h2 className="text-2xl font-mono">{item.name}</h2>
                            <p className="text-lg font-mono w-72 whitespace-nowrap text-ellipsis overflow-hidden">{item.note}</p>
                        </div>
                        <div>
                            <p className="text-2xl font-mono">{formatCurrency(item.amount, false, false)}</p>
                            <p className="md:text-lg font-mono">
                                {differenceInDays(new Date(), item.timestamp)} days ago<br/>
                                {format(item.timestamp, "d.LL.yy, EEE")}
                            </p>
                        </div>
                    </div>
                )
            })}
        </section>
    )
}