import {ExpensesContext} from "../../context";
import {useContext, useMemo, useState} from "react";
import {differenceInDays, getMonth, subDays, isAfter, isBefore, getYear, subYears} from "date-fns";
import {formatCurrency} from "../../utils";

export const LastExpenses = () => {
    const [startDate, setStartDate] = useState(new Date(subDays(new Date(), 4)));
    const [endDate, setEndDate] = useState(new Date());
    const [sortBy, setSortBy] = useState("timestamp");
    const [filteredItems, setFilteredItems] = useState([]);
    const {expensesArray} = useContext(ExpensesContext);
    const lastItems = useMemo(() => {
        // const filtered = expensesArray
        //     .filter(item => !item.isIncome)
        //     .filter(item => {
        //         return !filteredItems.some(filteredItem => filteredItem.id === item.id);
        //     })
        //     .filter(item => {
        //         return isAfter(item.timestamp, startDate) && isBefore(item.timestamp, endDate);
        //     })

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
    const getLastMonthName = (monthNumber) => {
        switch (monthNumber) {
            case 0:
                return "January";
            case 1:
                return "February";
            case 2:
                return "March";
            case 3:
                return "April";
            case 4:
                return "May";
            case 5:
                return "June";
            case 6:
                return "July";
            case 7:
                return "August";
            case 8:
                return "September";
            case 9:
                return "October";
            case 10:
                return "November";
            case 11:
                return "December";
        }
    };

    return (
        <section className="m-4 w-2/5 h-[66vh] overflow-y-auto bg-white border-8 border-gray-500 shadow p-4">
            <button className="float-right" onClick={() => setSortBy(sortBy === "timestamp" ? "amount" : "timestamp")}>
                Sorting by {sortBy}
            </button>
            <div className="p-2">
                <div className="flex gap-2">
                    <button
                        className="p-2 border border-gray-500 rounded"
                        onClick={() => {
                            setStartDate(new Date(subDays(new Date(), 1)));
                            setEndDate(new Date());
                        }}>
                        Last day
                    </button>
                    <button
                        className="p-2 border border-gray-500 rounded"
                        onClick={() => {
                            setStartDate(new Date(subDays(new Date(), 7)));
                            setEndDate(new Date());
                        }}>
                        Last week
                    </button>
                </div>
                <div className="flex gap-2">
                    <button
                        className="p-2 border border-gray-500 rounded"
                        onClick={() => {
                            setStartDate(new Date(subDays(new Date(), 30)));
                            setEndDate(new Date());
                        }}>
                        {getLastMonthName(getMonth(new Date()))}
                    </button>
                    <button
                        className="p-2 border border-gray-500 rounded"
                        onClick={() => {
                            setStartDate(subYears(new Date(subDays(new Date(), 30)), 1));
                            setEndDate(subYears(new Date(), 1));
                        }}>
                        {getLastMonthName(getMonth(new Date()))} last year
                    </button>
                    <button
                        className="p-2 border border-gray-500 rounded"
                        onClick={() => {
                            setStartDate(subYears(new Date(subDays(new Date(), 30)), 2));
                            setEndDate(subYears(new Date(), 2));
                        }}>
                        {getLastMonthName(getMonth(new Date()))} 2 years ago
                    </button>
                </div>
                <div className="flex gap-2">
                    <button
                        className="p-2 border border-gray-500 rounded"
                        onClick={() => {
                            const monthNumber = getMonth(new Date()) - 1;
                            setStartDate(new Date(new Date().setMonth(monthNumber, 1)));
                            setEndDate(new Date(new Date().setMonth(monthNumber + 1, 0)));
                        }}>
                        {getLastMonthName(getMonth(new Date()) - 1)}
                    </button>
                    <button
                        className="p-2 border border-gray-500 rounded"
                        onClick={() => {
                            const monthNumber = getMonth(new Date()) - 2;
                            setStartDate(new Date(new Date().setMonth(monthNumber, 1)));
                            setEndDate(new Date(new Date().setMonth(monthNumber + 1, 0)));
                        }}>
                        {getLastMonthName(getMonth(new Date()) - 2)}
                    </button>
                </div>
                <div className="flex gap-2">
                    <button
                        className="p-2 border border-gray-500 rounded"
                        onClick={() => {
                            setStartDate(new Date(subDays(new Date(), 120)));
                            setEndDate(new Date(subDays(new Date(), 30)));
                        }}>
                        Last quarter
                    </button>
                    <button
                        className="p-2 border border-gray-500 rounded"
                        onClick={() => {
                            setStartDate(new Date(new Date().setMonth(0, 1)));
                            setEndDate(new Date(new Date().setMonth(11, 31)));
                        }}>
                        {getYear(new Date())}
                    </button>
                    <button
                        className="p-2 border border-gray-500 rounded"
                        onClick={() => {
                            setStartDate(subYears(new Date(), 2));
                            setEndDate(subYears(new Date(), 1));
                        }}>
                        {getYear(new Date()) - 1}
                    </button>
                </div>
            </div>
            <h1 className="text-3xl font-mono">Over {differenceInDays(endDate, startDate)} days I spent</h1>
            <div>
                <h2 className="text-7xl font-mono">{formatCurrency(totalAmount, false, false)}</h2>
                <h3>{formatCurrency(filteredItems.reduce((acc, item) => acc + item.amount, 0), false, false)} filtered</h3>
            </div>
            {lastItems.map(item => {
                return (
                    <div
                        key={item.id}
                        className="flex justify-between items-center p-2 border-b border-gray-500"
                        onClick={() => {
                            setFilteredItems([item, ...filteredItems]);
                        }}>
                        <div>
                            <h2 className="text-2xl font-mono">{item.name}</h2>
                            <p className="text-lg font-mono w-72 whitespace-nowrap text-ellipsis overflow-hidden">{item.note}</p>
                        </div>
                        <div>
                            <p className="text-2xl font-mono">{formatCurrency(item.amount, false, false)}</p>
                            <p className="text-lg font-mono">{differenceInDays(new Date(), item.timestamp)} days ago</p>
                        </div>
                    </div>
                )
            })}
        </section>
    )
}