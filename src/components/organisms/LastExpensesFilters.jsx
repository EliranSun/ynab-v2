import {getMonth, getYear, subDays, subYears} from "date-fns";
import {Timeframe} from "./LastExpenses";
import {useState} from "react";
import classNames from "classnames";

const getLastMonthName = (monthNumber) => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthNumber];
};

const Button = ({
                    label,
                    startDate,
                    endDate,
                    timeframe,
                    setStartDate,
                    setEndDate,
                    setTimeframeName,
                    isSelected,
                    onClick
                }) => (
    <button
        className={classNames({
            "p-2 border border-gray-200 rounded shadow-md": true,
            "bg-black text-white": isSelected,
            "text-xs md:text-sm": true,
        })}
        onClick={() => {
            setStartDate(startDate);
            setEndDate(endDate);
            setTimeframeName(timeframe);
            onClick();
        }}>
        {label}
    </button>
);

export const LastExpensesFilters = ({setStartDate, setEndDate, setTimeframeName}) => {
    const [selectedFilterId, setSelectedFilterId] = useState(2);
    const currentMonth = getMonth(new Date());
    const currentYear = getYear(new Date());

    return (
        <>
            <h1 className="text-2xl font-bold">Filters</h1>
            <div className="grid grid-cols-4 gap-6 p-2">
                <div className="flex flex-col gap-2">
                    <b>Recent</b>
                    <Button
                        id={1}
                        isSelected={selectedFilterId === 1}
                        onClick={() => setSelectedFilterId(1)}
                        label="Last day"
                        startDate={subDays(new Date(), 1)}
                        endDate={new Date()}
                        timeframe={Timeframe.WEEK}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                    <Button
                        id={2}
                        isSelected={selectedFilterId === 2}
                        onClick={() => setSelectedFilterId(2)}
                        label="Last 4 days"
                        startDate={subDays(new Date(), 4)}
                        endDate={new Date()}
                        timeframe={Timeframe.WEEK}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                    <Button
                        id={3}
                        isSelected={selectedFilterId === 3}
                        onClick={() => setSelectedFilterId(3)}
                        label="Last week"
                        startDate={subDays(new Date(), 7)}
                        endDate={new Date()}
                        timeframe={Timeframe.WEEK}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                </div>
                <div className="flex flex-col gap-2">
                    <b>Last Months</b>
                    <Button
                        id={4}
                        isSelected={selectedFilterId === 4}
                        onClick={() => setSelectedFilterId(4)}
                        label={getLastMonthName(currentMonth)}
                        startDate={new Date(new Date().setMonth(currentMonth, 0))}
                        endDate={new Date()}
                        timeframe={Timeframe.MONTH}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                    <Button
                        id={5}
                        isSelected={selectedFilterId === 5}
                        onClick={() => setSelectedFilterId(5)}
                        label={getLastMonthName(currentMonth - 1)}
                        startDate={new Date(new Date().setMonth(currentMonth - 1, 0))}
                        endDate={new Date(new Date().setMonth(currentMonth, 0))}
                        timeframe={Timeframe.MONTH}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                    <Button
                        id={6}
                        isSelected={selectedFilterId === 6}
                        onClick={() => setSelectedFilterId(6)}
                        label={getLastMonthName(1)}
                        startDate={new Date("2023-01-01")}
                        endDate={new Date("2023-02-28")}
                        timeframe={Timeframe.MONTH}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                </div>
                <div className="flex flex-col gap-2">
                    <b>Month</b>
                    <Button
                        id={7}
                        isSelected={selectedFilterId === 7}
                        onClick={() => setSelectedFilterId(7)}
                        label="May 2024"
                        startDate={new Date("2024-05-01")}
                        endDate={new Date("2024-05-31")}
                        timeframe={Timeframe.MONTH}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                    <Button
                        id={8}
                        isSelected={selectedFilterId === 8}
                        onClick={() => setSelectedFilterId(8)}
                        label="April 2024"
                        startDate={new Date("2024-04-01")}
                        endDate={new Date("2024-04-30")}
                        timeframe={Timeframe.MONTH}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                    <Button
                        id={13}
                        isSelected={selectedFilterId === 13}
                        onClick={() => setSelectedFilterId(13)}
                        label="February 2024"
                        startDate={new Date("2024-02-01")}
                        endDate={new Date("2024-02-28")}
                        timeframe={Timeframe.MONTH}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                    <Button
                        id={9}
                        label="February 2023"
                        isSelected={selectedFilterId === 9}
                        onClick={() => setSelectedFilterId(9)}
                        startDate={new Date("2023-02-01")}
                        endDate={new Date("2023-02-28")}
                        timeframe={Timeframe.MONTH}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                </div>
                <div className="flex flex-col gap-2">
                    <b>Year</b>
                    <Button
                        id={10}
                        isSelected={selectedFilterId === 10}
                        onClick={() => setSelectedFilterId(10)}
                        label="Last quarter"
                        startDate={subDays(new Date(), 120)}
                        endDate={subDays(new Date(), 30)}
                        timeframe={Timeframe.QUARTER}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                    <Button
                        id={11}
                        isSelected={selectedFilterId === 11}
                        onClick={() => setSelectedFilterId(11)}
                        label="2024"
                        startDate={new Date("2024-01-01")}
                        endDate={new Date("2024-12-31")}
                        timeframe={Timeframe.YEAR}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                    <Button
                        id={12}
                        isSelected={selectedFilterId === 12}
                        onClick={() => setSelectedFilterId(12)}
                        label="2023"
                        startDate={new Date("2023-01-01")}
                        endDate={new Date("2023-12-31")}
                        timeframe={Timeframe.YEAR}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                </div>
            </div>
        </>
    );
};