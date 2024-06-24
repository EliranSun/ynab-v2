import {useContext, useMemo, useState} from "react";
import {orderBy} from "lodash";
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
                                    categoryId,
                                    categoryName,
                                    currentTimestamp,
                                    isSameDate,
                                    isPreviousMonth,
                                    categoryBudget,
                                    subcategoryBudgets,
                                    selectedId,
                                    setSelectedId
                                }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const {expensesArray} = useContext(ExpensesContext);
    const [budget] = useContext(BudgetContext);
    const {totalExpensesSum, averages} = useCategoryExpensesSummary(categoryId, currentTimestamp);

    const subcategories = useMemo(() => {
        const sub = Categories.find((c) => c.id === categoryId)?.subCategories.map((subcategory) => {
            const subcategoryBudget = subcategoryBudgets[subcategory.id];
            const expensesInCategory = expensesArray.filter((expense) => {
                return expense.categoryId === subcategory.id;
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
                budget: subcategoryBudget,
                difference: subcategoryBudget - amount,
                thisMonthExpenses
            };
        })
        // .filter((subcategory) => {
        //     return (subcategory.budget - subcategory.amount) < 0;
        // });


        return orderBy(sub, (subcategory) => subcategory.budget - subcategory.amount, "asc");
    }, [budget, categoryId, currentTimestamp, expensesArray]);

    const diff = useMemo(() => categoryBudget - totalExpensesSum, [categoryBudget, totalExpensesSum]);

    return (
        <div className="bg-gray-200 md:h-fit p-2 md:p-4 box-border relative">
            <div
                className="text-sm md:text-5xl cursor-pointer mb-4 flex md:flex-col items-center justify-between"
                onClick={() => setIsExpanded(!isExpanded)}>
                <Title type={Title.Types.H4}>
                    {categoryName}
                </Title>
                <div className="font-black font-mono text-4xl">
                    {formatCurrency(totalExpensesSum, false, false)}
                </div>
            </div>
            <DataStrip
                categoryId={categoryId}
                categoryBudget={categoryBudget}
                averages={averages}
                diff={diff}/>
            {isExpanded ?
                <div className="flex flex-col gap-2 my-4 w-full md:h-fit overflow-x-hidden overflow-y-auto px-2">
                    {subcategories.map((subcategory) => {
                        return (
                            <Subcategory
                                {...subcategory}
                                key={subcategory.id}
                                subcategoryBudget={subcategoryBudgets ? subcategoryBudgets[subcategory.id] : 0}
                                categoryId={categoryId}
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
