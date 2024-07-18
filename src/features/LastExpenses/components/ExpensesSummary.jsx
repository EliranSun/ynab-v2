import {useContext, useMemo, useState} from "react";
import {endOfMonth, getMonth, getYear, isAfter, isBefore, startOfMonth} from "date-fns";
import {formatCurrency} from "../../../utils";
import ExpensesSummaryChart from "./ExpensesSummaryChart";
import {ExpensesSummaryFilters} from "./ExpensesSummaryFilters";
import classNames from "classnames";
import {Trans} from "@lingui/macro";
import {Timeframe, TimeframeNames} from "../constants";
import {BudgetContext, ExpensesContext} from "../../../context";
import {CategoriesContext} from "../../../context/CategoriesContext";
import Expense from "../../../components/pages/ExpenseView/Expense";
import {BottomLine} from "../../../components/molecules/BottomLine/BottomLine";

export const ExpensesSummary = ({budget = {}, expenses = []}) => {
        const currentYear = getYear(new Date());
        const currentMonth = getMonth(new Date());
        const [startDate, setStartDate] = useState(new Date(currentYear, currentMonth, 1));
        const [endDate, setEndDate] = useState(new Date(currentYear, currentMonth + 1, 0));
        const [timeframeName, setTimeframeName] = useState(Timeframe.MONTH);
        const [sortBy, setSortBy] = useState("timestamp");
        const [itemsHiddenByUser, setItemsHiddenByUser] = useState([]);
        const {categories} = useContext(CategoriesContext);
        const incomeSubcategoriesIds = useMemo(() => {
            return categories.filter(category => category.isIncome).flatMap(category => category.subcategories.map(subcategory => subcategory.id));
        }, [categories]);

        const budgetForTimeframe = useMemo(() => {
            if (budget.length === 0) {
                return 0;
            }

            console.log({budget});
            const expensesBudget = budget.filter(({subcategoryId}) => {
                return !incomeSubcategoriesIds.includes(subcategoryId);
            });
            let totalBudget = 0;

            for (const expenseBudget of expensesBudget) {
                totalBudget += expenseBudget.amount;
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
                const itemIsFiltered = itemsHiddenByUser.some(filteredItem => filteredItem.id === item.id);

                if (outOfRange) {
                    continue;
                }

                expensesFoo[item.id] = {
                    ...item,
                    isHidden: itemIsFiltered,
                };
            }

            if (sortBy === "timestamp") {
                return Object.values(expensesFoo).sort((a, b) => b.timestamp - a.timestamp);
            }

            return Object.values(expensesFoo).sort((a, b) => b.amount - a.amount);
        }, [expenses, startDate, endDate, sortBy, itemsHiddenByUser]);

        const incomeForTimeframe = useMemo(() => {
            return expenses
                .filter(item => {
                    const inRange =
                        isAfter(item.timestamp, startOfMonth(startDate)) &&
                        isBefore(item.timestamp, endOfMonth(endDate));

                    return incomeSubcategoriesIds.includes(item.subcategoryId) && inRange;
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

        const totalSpent = useMemo(() => lastItems.reduce((acc, item) => {
            if (item.isHidden) {
                return acc;
            }

            if (incomeSubcategoriesIds.includes(item.subcategoryId)) {
                return acc;
            }
            return acc + item.amount;
        }, 0), [incomeSubcategoriesIds, lastItems]);

        const hiddenItemsAmountSum = useMemo(() => {
            return formatCurrency(itemsHiddenByUser.reduce((acc, item) => {
                return acc + item.amount
            }, 0), false, false)
        }, [itemsHiddenByUser]);

        console.log(lastItems[0]);

        return (
            <div className="p-2 md:p-4 w-full max-w-screen-xl m-auto bg-white/90">
                <h1 className="w-full m-auto text-8xl font-mono mb-8">
                    <Trans>Summary</Trans>
                </h1>
                <section
                    className={classNames({
                        "bg-neutral-50 p-2": true,
                        // "overflow-y-auto": true,
                        "shadow-lg border-2 border-solid rounded-lg": true,
                    })}>
                    <ExpensesSummaryFilters
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setTimeframeName={setTimeframeName}/>
                    <div className="sticky top-0 z-10 bg-white">
                        <BottomLine
                            totalSpent={totalSpent}
                            timeframeName={TimeframeNames[timeframeName]}
                            budgetForTimeframe={budgetForTimeframe}
                            incomeAmountForTimeframe={incomeAmountForTimeframe}/>
                    </div>

                    <div className="flex flex-col md:flex-row overflow-hidden mt-4 gap-4">
                        <div className="w-full h-fit">
                            <h3>{hiddenItemsAmountSum} filtered</h3>
                            <ExpensesSummaryChart
                                expenses={lastItems}
                                budget={budgetForTimeframe}
                                income={incomeForTimeframe}
                                timeframeName={timeframeName}/>
                            <button
                                className="border rounded p-2 shadow-md sticky top-0 bg-white"
                                onClick={() => setSortBy(sortBy === "timestamp" ? "amount" : "timestamp")}>
                                Sorting by {sortBy}
                            </button>
                            <div className="h-fit overflow-y-auto">
                                {lastItems.map(item => {
                                    return (
                                        <Expense
                                            key={item.id}
                                            expense={item}
                                            isListView
                                            isIncome={incomeSubcategoriesIds.includes(item.subcategoryId)}
                                            onHide={() => {
                                                const isHidden = itemsHiddenByUser.some(({id}) => id === item.id);
                                                if (isHidden) {
                                                    setItemsHiddenByUser(itemsHiddenByUser.filter(({id}) => id !== item.id));
                                                    return;
                                                }
                                                
                                                setItemsHiddenByUser([item, ...itemsHiddenByUser]);
                                            }}/>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
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