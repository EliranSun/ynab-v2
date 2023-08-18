import { Categories } from "../../constants";
import classNames from "classnames";
import { noop } from "lodash"
import { LeanCategorySelection } from "../CategorySelection";
import { Button, Spinner } from "../atoms";
import { useMemo, useState } from "react";
import { isSameMonth } from "date-fns"
import { X } from "@phosphor-icons/react";

const SimilarExpenses = ({ expense, existingExpenses = [] }) => {
    const [isSameMonthCheck, setIsSameMonthCheck] = useState(true);

    return (
        <div className="flex gap-1 overflow-x-auto">
            <div className="text-sm">
                <span>Similar expenses</span>
                <input type="checkbox"
                       checked={isSameMonthCheck}
                       onChange={(event) => {
                           setIsSameMonthCheck(event.target.checked);
                       }}
                />same month?
            </div>
            {existingExpenses.filter((existingExpense) => {
                const sameName = existingExpense.name === expense.name;
                const sameMonth = isSameMonth(new Date(existingExpense.timestamp), new Date(expense.timestamp));

                if (isSameMonthCheck) {
                    return sameName && sameMonth;
                }

                return sameName;
            }).sort((a, b) => {
                return b.timestamp - a.timestamp;
            }).map(item => {
                return (
                    <div className="bg-blue-300 rounded p-1 text-xs flex flex-col">
                        <span>{item.name}</span>
                        <span><b>{item.amountCurrency}</b></span>
                        <span>{item.date}</span>
                        <span>{item.note}</span>
                    </div>
                );
            })}
        </div>
    )
}
export const ExpensesList = ({
        expenses = [],
        existingExpenses = [],
        setExpenses = noop,
        submitExpenses = noop
    }) => {
        const [isCategorySelectionVisible, setIsCategorySelectionVisible] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const expensesWithCategory = useMemo(() => expenses.filter((expense) => {
            return !!expense.categoryId;
        }), [expenses]);

        if (expenses.length === 0) {
            return null;
        }

        return (
            <div className="w-full border-none lg:border-l border-black xl:px-8 xl:w-2/3">
                <div className="mb-4 h-96 snap-y overflow-y-auto xl:p-4">
                    {expenses.map((expense, index) => {
                        let subcategory;
                        Categories.forEach((category) => {
                            category.subCategories.forEach((sub) => {
                                if (sub.id === expense.categoryId) {
                                    subcategory = sub;
                                }
                            });
                        });
                        return (
                            <div className="snap-start">
                                <div className={classNames("flex gap-4 py-2 items-center", {
                                    "": !isCategorySelectionVisible,
                                    "bg-gray-200": index % 2 === 0 || isCategorySelectionVisible,
                                })}>
                                <span className="w-2/6">
                                  <b>{expense.name}</b>
                                </span>
                                    <input
                                        type="text"
                                        placeholder="note"
                                        value={expense.note}
                                        onChange={(event) => {
                                            setExpenses((prev) => {
                                                const newExpenses = [...prev];
                                                newExpenses[index].note = event.target.value;
                                                return newExpenses;
                                            });
                                        }}
                                        className="w-1/6 border border-gray-500 px-2"/>
                                    <span className="cursor-pointer w-1/6" onClick={() => {
                                        setExpenses((prev) => {
                                            const newExpenses = [...prev];
                                            newExpenses[index].categoryId = null;
                                            return newExpenses;
                                        });
                                    }}>
                              {subcategory?.icon} {subcategory?.name}
                                </span>
                                    <span className="w-1/6">
                                  {expense.amountCurrency}
                                </span>
                                    <span className="w-1/6">
                                  {expense.date}
                                </span>
                                    <span className="px-4 cursor-pointer">
                                    <X color="red" size={20}/>
                                </span>
                                </div>
                                {isCategorySelectionVisible &&
                                    <SimilarExpenses
                                        expense={expense}
                                        existingExpenses={existingExpenses}/>}
                                {isCategorySelectionVisible && !expense.categoryId &&
                                    <LeanCategorySelection
                                        onCategorySelect={(categoryId) => {
                                            setExpenses((prev) => {
                                                const newExpenses = [...prev];
                                                newExpenses[index].categoryId = categoryId;
                                                return newExpenses;
                                            });
                                        }}/>}
                            </div>
                        )
                    })}
                </div>
                <div className="flex justify-between">
                    <Button onClick={() => {
                        setIsCategorySelectionVisible(!isCategorySelectionVisible);
                    }}>
                        {isCategorySelectionVisible ? "Hide" : "Show"} category selection
                    </Button>
                    <Button
                        isDisabled={isLoading || expensesWithCategory.length === 0}
                        className="flex items-center gap-2"
                        onClick={async () => {
                            console.log({ expensesWithCategory });
                            setIsLoading(true);
                            await submitExpenses(expensesWithCategory);
                            setIsLoading(false);
                        }}>
                        <Spinner className={isLoading && "animate-spin"}/>
                        <span>Submit {expensesWithCategory.length}</span>
                    </Button>
                </div>
            </div>
        );
    }
;
