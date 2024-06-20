import {startOfWeek, getYear, subDays} from "date-fns";
import {useState} from "react";
import {MonthNames, Timeframe} from "../constants";
import {Trans} from "@lingui/macro";
import {Filters} from "./Filters";
import {FilterGroup} from "./FilterGroup";
import {Filter} from "./Filter";

export const LastExpensesFilters = ({setStartDate, setEndDate, setTimeframeName}) => {
    const [selectedLabel, setSelectedLabel] = useState("Last week");
    const currentYear = getYear(new Date());

    return (
        <div className="">
            <h1 className="text-2xl font-bold mb-2">
                <Trans>Filters</Trans>
            </h1>
            <Filters>
                <FilterGroup>
                    <Filter
                        id={3}
                        isSelected={selectedLabel === "Last week"}
                        onClick={setSelectedLabel}
                        label="Last week"
                        startDate={startOfWeek(new Date(), {weekStartsOn: 1})}
                        endDate={new Date()}
                        timeframe={Timeframe.WEEK}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                </FilterGroup>
                <FilterGroup>
                    {MonthNames.map((month, index) => {
                        return (
                            <Filter
                                key={index}
                                id={index}
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
                    })}
                </FilterGroup>
                <FilterGroup>
                    <Filter
                        id={7}
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
                        id={8}
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
                        id={13}
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
                        id={9}
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
                        id={10}
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
                        id={11}
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
                        id={12}
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