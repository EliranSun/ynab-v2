import {endOfWeek, endOfMonth, startOfMonth, getYear, startOfWeek, subDays, getMonth} from "date-fns";
import {useState} from "react";
import {FilterName, MonthNames, Timeframe} from "../constants";
import {Trans} from "@lingui/macro";
import {Filters} from "./Filters";
import {FilterGroup} from "./FilterGroup";
import {Filter} from "./Filter";

export const ExpensesSummaryFilters = ({setStartDate, setEndDate, setTimeframeName}) => {
    const [selectedLabel, setSelectedLabel] = useState("Last week");
    const currentYear = getYear(new Date());
    const currentMonth = getMonth(new Date());

    return (
        <div className="">
            <h1 className="text-2xl font-bold mb-2">
                <Trans>Filters</Trans>
            </h1>
            <Filters>
                <FilterGroup>
                    <Filter
                        onClick={setSelectedLabel}
                        timeframe={Timeframe.WEEK}
                        label={FilterName.THIS_WEEK}
                        isSelected={selectedLabel === FilterName.THIS_WEEK}
                        startDate={startOfWeek(new Date(), {weekStartsOn: 1})}
                        endDate={endOfWeek(new Date(), {weekStartsOn: 1})}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                    <Filter
                        onClick={setSelectedLabel}
                        timeframe={Timeframe.WEEK}
                        label={FilterName.LAST_WEEK}
                        isSelected={selectedLabel === FilterName.LAST_WEEK}
                        startDate={startOfWeek(subDays(new Date(), 7), {weekStartsOn: 1})}
                        endDate={endOfWeek(subDays(new Date(), 7), {weekStartsOn: 1})}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                </FilterGroup>
                <FilterGroup>
                    {MonthNames.map((month, index) => {
                        if (index > currentMonth) {
                            return null;
                        }

                        return (
                            <Filter
                                key={index}
                                isSelected={selectedLabel === month}
                                onClick={setSelectedLabel}
                                label={month}
                                startDate={new Date(currentYear, index, 1)}
                                endDate={new Date(currentYear, index + 1, 0)}
                                timeframe={Timeframe.MONTH}
                                setStartDate={setStartDate}
                                setEndDate={setEndDate}
                                setTimeframeName={setTimeframeName}/>
                        );
                    }).reverse()}
                </FilterGroup>
                <FilterGroup>
                    <Filter
                        isSelected={selectedLabel === "May 2024"}
                        onClick={setSelectedLabel}
                        label="May 2024"
                        startDate={new Date("2024-05-01")}
                        endDate={new Date("2024-05-31")}
                        timeframe={Timeframe.MONTH}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                    <Filter
                        isSelected={selectedLabel === "April 2024"}
                        onClick={setSelectedLabel}
                        label="April 2024"
                        startDate={new Date("2024-04-01")}
                        endDate={new Date("2024-04-30")}
                        timeframe={Timeframe.MONTH}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                    <Filter
                        isSelected={selectedLabel === "February 2024"}
                        onClick={setSelectedLabel}
                        label="February 2024"
                        startDate={new Date("2024-02-01")}
                        endDate={new Date("2024-02-28")}
                        timeframe={Timeframe.MONTH}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                    <Filter
                        label="February 2023"
                        isSelected={selectedLabel === "February 2023"}
                        onClick={setSelectedLabel}
                        startDate={new Date("2023-02-01")}
                        endDate={new Date("2023-02-28")}
                        timeframe={Timeframe.MONTH}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                </FilterGroup>
                <FilterGroup>
                    <Filter
                        isSelected={selectedLabel === "Last quarter"}
                        onClick={setSelectedLabel}
                        label="Last quarter"
                        startDate={subDays(new Date(), 120)}
                        endDate={subDays(new Date(), 30)}
                        timeframe={Timeframe.QUARTER}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                    <Filter
                        isSelected={selectedLabel === "2024"}
                        onClick={setSelectedLabel}
                        label="2024"
                        startDate={new Date("2024-01-01")}
                        endDate={new Date("2024-12-31")}
                        timeframe={Timeframe.YEAR}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                    <Filter
                        label="2023"
                        isSelected={selectedLabel === "2023"}
                        onClick={setSelectedLabel}
                        startDate={new Date("2023-01-01")}
                        endDate={new Date("2023-12-31")}
                        timeframe={Timeframe.YEAR}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                </FilterGroup>
            </Filters>
        </div>
    );
};