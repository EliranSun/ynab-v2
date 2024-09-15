import { useContext, useMemo, useState } from "react";
import { endOfMonth, getMonth, getYear, isAfter, isBefore, startOfMonth } from "date-fns";
import { formatCurrency } from "../../../utils";
import ExpensesSummaryChart from "./ExpensesSummaryChart";
import { ExpensesSummaryFilters } from "./ExpensesSummaryFilters";
import classNames from "classnames";
import { Trans } from "@lingui/macro";
import { Timeframe, TimeframeNames } from "../constants";
import { BudgetContext, ExpensesContext } from "../../../context";
import { CategoriesContext } from "../../../context/CategoriesContext";
import Expense from "../../../components/pages/ExpenseView/Expense";
import { BottomLine } from "../../../components/molecules/BottomLine/BottomLine";
import { useLingui } from "@lingui/react";
import Title from "../../../components/atoms/Title";
import { Banner } from "../../../components/atoms/Banner";

const SortButton = ({ children, onClick, isSelected }) => {
    return (
        <button
            onClick={onClick}
            className={classNames({
                "border rounded p-2": true,
                "bg-gray-100 shadow-none": isSelected,
                "bg-white shadow-md": !isSelected,
            })}>
            {children}
        </button>
    );
};

export const ExpensesSummary = ({ budget = {}, expenses = [] }) => {
    const { _ } = useLingui();
    const currentYear = getYear(new Date());
    const currentMonth = getMonth(new Date());
    const [startDate, setStartDate] = useState(new Date(currentYear, currentMonth, 1));
    const [endDate, setEndDate] = useState(new Date(currentYear, currentMonth + 1, 0));
    const [timeframeName, setTimeframeName] = useState(Timeframe.MONTH);
    const [sortBy, setSortBy] = useState("timestamp");
    const [itemsHiddenByUser, setItemsHiddenByUser] = useState([]);
    const { categories } = useContext(CategoriesContext);
    const incomeSubcategoriesIds = useMemo(() => {
        return categories.filter(category => category.isIncome).flatMap(category => category.subcategories.map(subcategory => subcategory.id));
    }, [categories]);

    const expensesBudget = budget.filter(({ subcategoryId }) => {
        return !incomeSubcategoriesIds.includes(subcategoryId);
    });

    console.log({ budget });

    const budgetForTimeframe = useMemo(() => {
        if (budget.length === 0) {
            return 0;
        }

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
    
    const lastItemsBudgets = useMemo(() => {
        const foo = {};
        lastItems.forEach(item => {
            foo[item.subcategoryId] = (foo[item.subcategoryId] || 0) + item.amount;
        });
        
        return foo;
    }, [lastItems]);

    return (
        <div className="w-full max-w-screen-2xl m-auto p-4 flex flex-col md:flex-row gap-4">
            {/*<h1 className="w-full m-auto text-8xl font-mono my-8">*/}
            {/*    <Trans>Summary</Trans>*/}
            {/*</h1>*/}

            <div className="w-full md:w-1/4 bg-gray-100 h-[calc(100vh-120px)] shadow-md rounded-md p-4 border order-2 md:order-1">
                <ExpensesSummaryFilters
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    setTimeframeName={setTimeframeName} />
            </div>
            <div className="w-full md:w-3/4">
                <Title className="mb-4">☕ {_(TimeframeNames[timeframeName])}</Title>
                <div className="static md:sticky top-20 z-10">
                    <BottomLine
                        totalSpent={totalSpent}
                        budgetForTimeframe={budgetForTimeframe}
                        incomeAmountForTimeframe={incomeAmountForTimeframe} />
                </div>

                <div className="flex flex-col md:flex-row mt-4 gap-4">
                    <div className="flex flex-col w-full">
                        <Banner className="w-full h-fit">
                            <div className="flex">
                                <h1 className="text-2xl"><Trans>Transactions</Trans></h1>
                                <div className="flex gap-2 mb-2 justify-end w-full">
                                    <SortButton
                                        isSelected={sortBy === "timestamp"}
                                        onClick={() => setSortBy("timestamp")}>
                                        <Trans>Sort by timestamp</Trans>
                                    </SortButton>
                                    <SortButton
                                        isSelected={sortBy === "amount"}
                                        onClick={() => setSortBy("amount")}>
                                        <Trans>Sort by amount</Trans>
                                    </SortButton>
                                </div>
                            </div>
                            <div className="h-96 overflow-y-auto">
                                {lastItems.map(item => {
                                    return (
                                        <div key={item.id} className="border-b py-2 flex items-center">
                                            <Expense
                                                expense={item}
                                                budgetAmount={lastItemsBudgets[item.subcategoryId]}
                                                isListView
                                                isLean
                                                budget={budget.find(b => b.subcategoryId === item.subcategoryId)?.amount}
                                                isIncome={incomeSubcategoriesIds.includes(item.subcategoryId)}
                                                onHide={() => {
                                                    const isHidden = itemsHiddenByUser.some(({ id }) => id === item.id);
                                                    if (isHidden) {
                                                        setItemsHiddenByUser(itemsHiddenByUser.filter(({ id }) => id !== item.id));
                                                        return;
                                                    }

                                                    setItemsHiddenByUser([item, ...itemsHiddenByUser]);
                                                }} />
                                        </div>
                                    )
                                })}
                            </div>
                        </Banner>
                        <div className="w-full h-2/3 px-4">
                            <ExpensesSummaryChart
                                expenses={lastItems}
                                budget={budgetForTimeframe}
                                income={incomeForTimeframe}
                                timeframeName={timeframeName} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
    ;

const ProvidedLastExpenses = () => {
    const { budget } = useContext(BudgetContext);
    const { expenses } = useContext(ExpensesContext);

    return <ExpensesSummary budget={budget} expenses={expenses} />
}

export default ProvidedLastExpenses;