import {ExpensesContext} from "../../context";
import {useContext, useMemo, useState} from "react";
import {differenceInDays, getMonth, subDays, isAfter, isBefore, getYear, subYears, format} from "date-fns";
import {formatCurrency} from "../../utils";
import LastExpensesChart from "./LastExpensesChart";
import {LastExpensesFilters} from "./LastExpensesFilters";

export const Timeframe = {
    WEEK: "WEEK",
    MONTH: "MONTH",
    QUARTER: "QUARTER",
    YEAR: "YEAR",
};

export const LastExpenses = () => {
    const [startDate, setStartDate] = useState(new Date(subDays(new Date(), 4)));
    const [endDate, setEndDate] = useState(new Date());
    const [sortBy, setSortBy] = useState("timestamp");
    const [filteredItems, setFilteredItems] = useState([]);
    const {expensesArray} = useContext(ExpensesContext);
    const [timeframeName, setTimeframeName] = useState(Timeframe.WEEK);
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


    return (
        <section
            className="m-4 md:w-2/5 h-[80vh] md:h-[66vh] overflow-y-auto bg-neutral-50 shadow-md rounded-lg md:border-8 border-gray-500 md:p-4">
            <LastExpensesFilters
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setTimeframeName={setTimeframeName}/>
            <h1 className="text-3xl font-mono">Over {differenceInDays(endDate, startDate)} days I spent</h1>
            <div>
                <h2 className="text-7xl font-mono">{formatCurrency(totalAmount, false, false)}</h2>
                <h3>{formatCurrency(filteredItems.reduce((acc, item) => acc + item.amount, 0), false, false)} filtered</h3>
            </div>
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