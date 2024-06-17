import {getMonth, getYear, subDays, subYears} from "date-fns";
import {Timeframe} from "./LastExpenses";

const getLastMonthName = (monthNumber) => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthNumber];
};

const generateButton = (label, startDate, endDate, timeframe, setStartDate, setEndDate, setTimeframeName) => (
    <button
        className="p-2 border border-gray-500 rounded"
        onClick={() => {
            setStartDate(startDate);
            setEndDate(endDate);
            setTimeframeName(timeframe);
        }}>
        {label}
    </button>
);

export const LastExpensesFilters = ({setStartDate, setEndDate, setTimeframeName}) => {
    const currentMonth = getMonth(new Date());
    const currentYear = getYear(new Date());

    return (
        <>
            <h1 className="text-2xl font-bold">Filters</h1>
            <div className="flex justify-between p=2">
                <div className="flex flex-col gap-2">
                    <b>Recent</b>
                    {generateButton("Last day", new Date(subDays(new Date(), 1)), new Date(), Timeframe.WEEK, setStartDate, setEndDate, setTimeframeName)}
                    {generateButton("Last 4 days", new Date(subDays(new Date(), 4)), new Date(), Timeframe.WEEK, setStartDate, setEndDate, setTimeframeName)}
                    {generateButton("Last week", new Date(subDays(new Date(), 7)), new Date(), Timeframe.WEEK, setStartDate, setEndDate, setTimeframeName)}
                </div>
                <div className="flex flex-col gap-2">
                    <b>Month</b>
                    {generateButton(getLastMonthName(currentMonth), new Date(subDays(new Date(), 30)), new Date(), Timeframe.MONTH, setStartDate, setEndDate, setTimeframeName)}
                    {generateButton(`${getLastMonthName(currentMonth)} last year`, subYears(new Date(subDays(new Date(), 30)), 1), subYears(new Date(), 1), Timeframe.YEAR, setStartDate, setEndDate, setTimeframeName)}
                    {generateButton(`${getLastMonthName(currentMonth)} 2 years ago`, subYears(new Date(subDays(new Date(), 30)), 2), subYears(new Date(), 2), Timeframe.YEAR, setStartDate, setEndDate, setTimeframeName)}
                </div>
                <div className="flex flex-col gap-2">
                    <b>Month</b>
                    {generateButton(getLastMonthName(currentMonth - 1), new Date(new Date().setMonth(currentMonth - 1, 1)), new Date(new Date().setMonth(currentMonth, 0)), Timeframe.MONTH, setStartDate, setEndDate, setTimeframeName)}
                    {generateButton("February 2023", new Date("2023-01-01"), new Date("2023-02-28"), Timeframe.MONTH, setStartDate, setEndDate, setTimeframeName)}
                    {generateButton(getLastMonthName(currentMonth - 2), new Date(new Date().setMonth(currentMonth - 2, 1)), new Date(new Date().setMonth(currentMonth - 1, 0)), Timeframe.MONTH, setStartDate, setEndDate, setTimeframeName)}
                </div>
                <div className="flex flex-col gap-2">
                    <b>Year</b>
                    {generateButton("Last quarter", new Date(subDays(new Date(), 120)), new Date(subDays(new Date(), 30)), Timeframe.QUARTER, setStartDate, setEndDate, setTimeframeName)}
                    {generateButton(currentYear, new Date(new Date().setMonth(0, 1)), new Date(new Date().setMonth(11, 31)), Timeframe.YEAR, setStartDate, setEndDate, setTimeframeName)}
                    {generateButton(currentYear - 1, subYears(new Date(), 2), subYears(new Date(), 1), Timeframe.YEAR, setStartDate, setEndDate, setTimeframeName)}
                </div>
            </div>
        </>
    );
};