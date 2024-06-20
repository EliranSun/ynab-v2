import {useContext, useMemo, useState} from "react";
import {differenceInDays, format, isAfter, isBefore, subDays, startOfMonth, endOfMonth} from "date-fns";
import {formatCurrency} from "../../../utils";
import LastExpensesChart from "./LastExpensesChart";
import {LastExpensesFilters} from "./LastExpensesFilters";
import classNames from "classnames";
import {Trans} from "@lingui/macro";
import {INCOME_CATEGORY_ID, Timeframe} from "../constants";
import {BudgetContext, ExpensesContext} from "../../../context";

const Item = ({children}) => {
    return (
        <div className="flex flex-col-reverse md:items-center">
            {children}
        </div>
    );
};

const Amount = ({children, isDifference}) => {
    const value = parseFloat(children);
    if (isNaN(value)) {
        return value;
    }

    return (
        <h2 className={classNames({
            "text-7xl md:text-6xl font-mono": true,
            "text-green-500": isDifference && value >= 0,
            "text-red-500": isDifference && value < 0,
        })}>
            {formatCurrency(value, false, false)}
        < /h2>
    );
};

export const LastExpenses = ({budget = {}, expensesArray = []}) => {
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
            const relevantCategories = Object.entries(budgetObject).filter(([key]) => {
                return key !== INCOME_CATEGORY_ID;
            });
            let totalBudget = 0;

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

        const incomeForTimeframe = useMemo(() => {
            const incomeInRange = expensesArray
                .filter(item => {
                    const inRange =
                        isAfter(item.timestamp, startOfMonth(startDate)) &&
                        isBefore(item.timestamp, endOfMonth(endDate));
                    return item.isIncome && inRange;
                });

            const total = incomeInRange.reduce((acc, item) => acc + item.amount, 0);

            switch (timeframeName) {
                default:
                case Timeframe.WEEK:
                    return total / 4;

                case Timeframe.MONTH:
                    return total;

                case Timeframe.QUARTER:
                    return total * 3;

                case Timeframe.YEAR:
                    return total * 12;
            }
        }, [expensesArray, startDate, endDate]);

        console.log({incomeForTimeframe});

        const totalAmount = useMemo(() => lastItems.reduce((acc, item) => acc + item.amount, 0), [lastItems]);
        const removedAmounts = useMemo(() => formatCurrency(filteredItems.reduce((acc, item) => acc + item.amount, 0), false, false), [filteredItems]);
        const differenceBudgetAmount = budgetForTimeframe - totalAmount;
        const differenceAmount = incomeForTimeframe - totalAmount;

        return (
            <section
                className={classNames({
                    "bg-neutral-50 m-4 md:p-4": true,
                    "h-[80vh] md:h-fit overflow-y-auto": true,
                    "shadow-md rounded-lg md:border-4 border-gray-500": true,
                    "max-w-[1000px] w-full md:w-1/2": true,
                })}>
                <LastExpensesFilters
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    setTimeframeName={setTimeframeName}/>
                <div className="flex flex-col flex-wrap justify-evenly md:flex-row gap-2 my-4">
                    <Item>
                        <h1 className="font-mono"><Trans>Spent</Trans></h1>
                        <Amount>{totalAmount}</Amount>
                    </Item>
                    <Item>
                        <h1 className="font-mono"><Trans>Income</Trans></h1>
                        <Amount>{incomeForTimeframe}</Amount>
                    </Item>
                    <Item>
                        <h1 className="font-mono">
                            <Trans>Budget</Trans>
                        </h1>
                        <Amount>{budgetForTimeframe}</Amount>
                    </Item>
                    <Item>
                        <h1 className="font-mono">
                            <Trans>Budget diff</Trans>
                        </h1>
                        <Amount isDifference>{differenceBudgetAmount}</Amount>
                    </Item>
                    <Item>
                        <h1 className="font-mono">
                            <Trans>Actual diff</Trans>
                        </h1>
                        <Amount isDifference>{differenceAmount}</Amount>
                    </Item>
                </div>
                <h3>{removedAmounts} filtered</h3>
                <LastExpensesChart
                    expenses={lastItems}
                    timeframeName={timeframeName}/>
                <button
                    className="border rounded p-2 shadow-md"
                    onClick={() => setSortBy(sortBy === "timestamp" ? "amount" : "timestamp")}>
                    Sorting by {sortBy}
                </button>
                {lastItems.map(item => {
                    return (
                        <div
                            key={item.id}
                            className={classNames({
                                "p-2 border-b border-gray-500": true,
                                "flex flex-col md:flex-row justify-between md:items-center": true,
                            })}
                            onClick={() => {
                                setFilteredItems([item, ...filteredItems]);
                            }}>
                            <div>
                                <h2 className="text-2xl font-mono">{item.name}</h2>
                                <p className="text-lg font-mono w-72 whitespace-nowrap text-ellipsis overflow-hidden">
                                    {item.note}
                                </p>
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
;

const ProvidedLastExpenses = () => {
    const {budget} = useContext(BudgetContext);
    const {expensesArray} = useContext(ExpensesContext);

    return <LastExpenses budget={budget} expensesArray={expensesArray}/>
}

export default ProvidedLastExpenses;