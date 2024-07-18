import {useContext, useMemo, useState} from "react";
import {orderBy, round} from "lodash";
import {isSameMonth} from "date-fns";
import {Exclude, Faders, PiggyBank} from "@phosphor-icons/react";
import {Categories} from "../../../constants";
import {formatCurrency} from "../../../utils";
import Subcategory from "../Subcategory/Subcategory";
import {BudgetContext, ExpensesContext, getDateKey} from "../../../context";
import {useCategoryExpensesSummary} from "../../../hooks/useCategoryExpensesSummary";
import classNames from "classnames";
import {Title} from "../../atoms";
import {Trans} from "@lingui/macro";
import {CategoriesContext} from "../../../context/CategoriesContext";

const DataStrip = ({categoryId, categoryBudget, averages, diff}) => {
    return (
        <div className="flex justify-between">
            <div className="flex flex-col items-center">
                <div className={classNames({
                    "font-bold font-mono text-lg": true,
                    "text-green-500": diff > 0,
                    "text-red-500": diff < 0
                })}>
                    {formatCurrency(diff)}
                </div>
                <div className="flex gap-1 items-center text-xs">
                    <Exclude/> {diff > 0 ? <Trans>left to spend</Trans> : <Trans>over budget</Trans>}
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="font-mono text-lg">
                    {formatCurrency(categoryBudget, false, false)}
                </div>
                <div className="flex gap-1 items-center text-xs">
                    <PiggyBank/> <Trans>budget</Trans>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="font-mono text-lg">
                    {formatCurrency(averages[categoryId], false, false)}
                </div>
                <div className="flex gap-1 items-center text-xs">
                    <Faders/>
                    <Trans>average</Trans>
                </div>
            </div>
        </div>
    )
};

export const CategoryBalance = ({
                                    isNsfw,
                                    categoryId,
                                    subcategories,
                                    categoryName,
                                    currentTimestamp,
                                    isSameDate,
                                    isPreviousMonth,
                                    categoryBudget,
                                    selectedId,
                                    setSelectedId
                                }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const {expenses} = useContext(ExpensesContext);
    const {categories} = useContext(CategoriesContext);
    const {totalExpensesSum, averages} = useCategoryExpensesSummary(subcategories, currentTimestamp);

    const subcategoriesSummary = useMemo(() => {
        const sub = subcategories.map((subcategory) => {
            const expensesInCategory = expenses.filter((expense) => {
                return expense.subcategoryId === subcategory.id;
            });

            const thisMonthExpenses = expensesInCategory.filter((expense) => {
                    const date = new Date(currentTimestamp);
                    const expenseDate = new Date(expense.timestamp);

                    if (expense.isRecurring) {
                        return (
                            expenseDate.getFullYear() === date.getFullYear()
                        );
                    }

                    return isSameMonth(expenseDate, date);
                }
            );

            const amount = thisMonthExpenses.reduce((acc, expense) => {
                return acc + expense.amount;
            }, 0);

            return {
                ...subcategory,
                amount,
                difference: subcategory.budget - amount,
                thisMonthExpenses
            };
        })
        // .filter((subcategory) => {
        //     return (subcategory.budget - subcategory.amount) < 0;
        // });

        return orderBy(sub, ['amount'], "desc");
    }, [currentTimestamp, expenses, subcategories]);

    const diff = useMemo(() => categoryBudget - totalExpensesSum, [categoryBudget, totalExpensesSum]);

    if (totalExpensesSum === 0) {
        return null;
    }

    return (
        <div className={classNames({
            "md:h-fit p-2 md:p-4 box-border relative flex-grow shadow": true,
            "bg-gray-200": !isNsfw,
        })}>
            <div
                className="cursor-pointer mb-4 flex md:flex-col items-start justify-between bg-gray-100"
                onClick={() => setIsExpanded(!isExpanded)}>
                <div className="font-black font-mono text-3xl">
                    {formatCurrency(round(totalExpensesSum, -1), false, false)}
                </div>
                <Title type={Title.Types.H4}>
                    {categoryName}
                </Title>
            </div>
            {/*<DataStrip*/}
            {/*    categoryId={categoryId}*/}
            {/*    categoryBudget={categoryBudget}*/}
            {/*    averages={averages}*/}
            {/*    diff={diff}/>*/}
            {isExpanded ?
                <div className="flex flex-col gap-4 w-full md:h-fit overflow-y-auto">
                    {subcategoriesSummary.map((subcategory) => {
                        return (
                            <Subcategory
                                {...subcategory}
                                key={subcategory.id}
                                budget={subcategory.budget}
                                isSelected={selectedId === subcategory.id}
                                onSubcategoryClick={setSelectedId}
                                currentTimestamp={currentTimestamp}
                                isPreviousMonth={isPreviousMonth}
                                isSameDate={isSameDate}
                            />
                        );
                    })}
                </div> : null}
        </div>
    )
};
