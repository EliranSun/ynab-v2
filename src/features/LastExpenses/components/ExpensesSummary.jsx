import {useContext, useMemo, useState} from "react";
import {
    isAfter,
    isBefore,
    startOfMonth,
    endOfMonth,
    getYear,
    getMonth
} from "date-fns";
import {formatCurrency} from "../../../utils";
import ExpensesSummaryChart from "./ExpensesSummaryChart";
import {ExpensesSummaryFilters} from "./ExpensesSummaryFilters";
import classNames from "classnames";
import {Trans} from "@lingui/macro";
import {INCOME_CATEGORY_ID, Timeframe, TimeframeNames} from "../constants";
import {BudgetContext, ExpensesContext} from "../../../context";
import Expense from "../../../components/pages/ExpenseView/Expense";
import {Button} from "../../CategoriesEdit/Button";
import {EyeSlash} from "@phosphor-icons/react";
import {useLingui} from "@lingui/react";
import {round} from "lodash";

const Item = ({children}) => {
    return (
        <div className="flex flex-col md:items-start">
            {children}
        </div>
    );
};

const Amount = ({children, withRounding = false, isDifference, size = Amount.Size.MEDIUM}) => {
    const value = (children);
    if (isNaN(value)) {
        return value;
    }

    return (
        <h2 className={classNames({
            "font-mono": true,
            "text-xs md:text-sm": size === Amount.Size.SMALL,
            "text-3xl md:text-5xl": size === Amount.Size.MEDIUM,
            "text-4xl md:text-8xl": size === Amount.Size.LARGE,
            "text-green-500": isDifference && (value >= 0),
            "text-red-500": isDifference && (value < 0),
        })}>
            {formatCurrency(round(value, withRounding ? -1 : 0), false, true)}
        < /h2>
    );
};

Amount.Size = {
    SMALL: "small",
    MEDIUM: "medium",
    LARGE: "large",
}

const BottomLine = ({
                        totalSpent,
                        timeframeName,
                        budgetForTimeframe,
                        incomeAmountForTimeframe,
                    }) => {
    const {_} = useLingui();
    const differenceBudgetAmount = budgetForTimeframe - totalSpent;
    const differenceAmount = incomeAmountForTimeframe - totalSpent;

    return (
        <div>
            <h1>{_(timeframeName)}</h1>
            <div className="flex items-center justify-evenly gap-2 my-4 m-auto">
                <Item>
                    <Amount size={Amount.Size.LARGE}>{-totalSpent}</Amount>
                    <h1 className="text-sm">
                        <Trans>Spent</Trans>
                    </h1>
                </Item>
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 bg-white py-2 shadow rounded-2xl gap-8">
                        <Item>
                            <Amount withRounding>{budgetForTimeframe}</Amount>
                            <h1 className="font-mono">
                                <Trans>Budget</Trans>
                            </h1>
                        </Item>
                        <Item>
                            <Amount isDifference>{differenceBudgetAmount}</Amount>
                            <h1 className="font-mono">
                                <Trans>left</Trans>
                            </h1>
                        </Item>
                    </div>
                    <div className="grid grid-cols-2 bg-white p-2 shadow rounded-2xl gap-8">
                        <Item>
                            <Amount withRounding>{incomeAmountForTimeframe}</Amount>
                            <h1 className="font-mono"><Trans>Income</Trans></h1>
                        </Item>
                        <Item>
                            <Amount isDifference>{differenceAmount}</Amount>
                            <h1 className="font-mono">
                                <Trans>left</Trans>
                            </h1>
                        </Item>
                    </div>
                </div>
            </div>
        </div>
    )
}
export const ExpensesSummary = ({budget = {}, expenses = []}) => {
        const currentYear = getYear(new Date());
        const currentMonth = getMonth(new Date());
        const [startDate, setStartDate] = useState(new Date(currentYear, currentMonth, 1));
        const [endDate, setEndDate] = useState(new Date(currentYear, currentMonth + 1, 0));
        const [timeframeName, setTimeframeName] = useState(Timeframe.MONTH);
        const [sortBy, setSortBy] = useState("timestamp");
        const [filteredItems, setFilteredItems] = useState([]);
        const budgetForTimeframe = useMemo(() => {
            if (!budget || Object.keys(budget).length === 0) {
                return 0;
            }

            const relevantCategories = Object.entries(budget).filter(([key]) => {
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
            const expensesFoo = {};
            for (const item of expenses) {
                const outOfRange = isBefore(item.timestamp, startDate) || isAfter(item.timestamp, endDate);
                const itemIsFiltered = filteredItems.some(filteredItem => filteredItem.id === item.id);
                if (item.isIncome || itemIsFiltered || outOfRange) {
                    continue;
                }

                expensesFoo[item.id] = item;
            }

            if (sortBy === "timestamp") {
                return Object.values(expensesFoo).sort((a, b) => b.timestamp - a.timestamp);
            }

            return Object.values(expensesFoo).sort((a, b) => b.amount - a.amount);
        }, [expenses, startDate, endDate, sortBy, filteredItems]);

        const incomeForTimeframe = useMemo(() => {
            return expenses
                .filter(item => {
                    const inRange =
                        isAfter(item.timestamp, startOfMonth(startDate)) &&
                        isBefore(item.timestamp, endOfMonth(endDate));
                    return item.isIncome && inRange;
                });


        }, [expenses, startDate, endDate]);

        const incomeAmountForTimeframe = useMemo(() => {
            const total = incomeForTimeframe.reduce((acc, item) => acc + item.amount, 0);

            switch (timeframeName) {
                default:
                case Timeframe.WEEK:
                    return total / 4;

                case Timeframe.MONTH:
                    return total;

                case Timeframe.QUARTER:
                    return total;

                case Timeframe.YEAR:
                    return total;
            }
        }, [incomeForTimeframe, timeframeName]);

        const totalSpent = useMemo(() => lastItems.reduce((acc, item) => acc + item.amount, 0), [lastItems]);
        const removedAmounts = useMemo(() => formatCurrency(filteredItems.reduce((acc, item) => acc + item.amount, 0), false, false), [filteredItems]);

        return (
            <div className="p-2 md:p-4 w-full max-w-screen-xl m-auto bg-white/90">
                <h1 className="w-full m-auto text-8xl font-mono mb-8">
                    <Trans>Summary</Trans>
                </h1>
                <section
                    className={classNames({
                        "bg-neutral-50 p-2": true,
                        "overflow-y-auto": true,
                        "shadow-lg border-2 border-solid rounded-lg": true,
                    })}>
                    <BottomLine
                        totalSpent={totalSpent}
                        timeframeName={TimeframeNames[timeframeName]}
                        budgetForTimeframe={budgetForTimeframe}
                        incomeAmountForTimeframe={incomeAmountForTimeframe}/>

                    <div className="flex flex-col md:flex-row overflow-hidden mt-4 gap-4">
                        <div className="md:w-1/2 h-fit">
                            <h3>{removedAmounts} filtered</h3>
                            <ExpensesSummaryChart
                                expenses={lastItems}
                                budget={budgetForTimeframe}
                                income={incomeForTimeframe}
                                timeframeName={timeframeName}/>
                        </div>
                        <div className="md:w-1/2">
                            <button
                                className="border rounded p-2 shadow-md sticky top-0 bg-white"
                                onClick={() => setSortBy(sortBy === "timestamp" ? "amount" : "timestamp")}>
                                Sorting by {sortBy}
                            </button>
                            <div className="h-96 overflow-y-auto">
                                {lastItems.map(item => {
                                    return (
                                        <div key={item.id} className="flex">
                                            <Expense
                                                key={item.id}
                                                isListView
                                                expense={item}/>
                                            <Button
                                                variation={Button.Variation.ADD}
                                                className=""
                                                onClick={() => {
                                                    setFilteredItems([item, ...filteredItems]);
                                                }}>
                                                <EyeSlash/>
                                            </Button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <ExpensesSummaryFilters
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                </section>
            </div>
        )
    }
;

const ProvidedLastExpenses = () => {
    const [budget] = useContext(BudgetContext);
    const {expenses} = useContext(ExpensesContext);

    return <ExpensesSummary budget={budget} expenses={expenses}/>
}

export default ProvidedLastExpenses;