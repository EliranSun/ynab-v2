import {Categories} from "../../../constants";
import {noop} from "lodash"
import {LeanCategorySelection} from "../../organisms/CategorySelection";
import {Button, Spinner} from "../../atoms";
import {useEffect, useMemo, useState} from "react";
import {SimilarExpenses} from "../../organisms/SimilarExpenses";
import {ExpenseInputs} from "../../molecules/ExpenseInputs";
import classNames from "classnames";

export const ExpensesList = ({
                                 expenses = [],
                                 existingExpenses = [],
                                 setExpenses = noop,
                                 submitExpenses = noop
                             }) => {
        const [isCategorySelectionVisible, setIsCategorySelectionVisible] = useState(true);
        const [isLoading, setIsLoading] = useState(false);
        const expensesWithCategory = useMemo(() => expenses.filter((expense) => {
            return !!expense.categoryId;
        }), [expenses]);

        const [activeId, setActiveId] = useState(expenses.find((expense) => {
            return !expense.categoryId;
        })?.id || null);

        useEffect(() => {
            if (!activeId) {
                return;
            }

            const element = document.getElementById(String(activeId));
            if (!element) {
                return;
            }

            element.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center"
            });
        }, [activeId]);

        useEffect(() => {
            const nextExpense = expenses.find((expense) => {
                return !expense.categoryId;
            });

            if (nextExpense?.id === activeId) {
                return;
            }

            setActiveId(nextExpense?.id || null);
            // we do not want to update based on activeId
        }, [expenses]); // eslint-disable-line react-hooks/exhaustive-deps

        if (expenses.length === 0) {
            return null;
        }

        return (
            <div
                className={classNames({
                    "fixed inset-0 z-30 flex flex-col items-center justify-center": true,
                    "size-screen border-none backdrop-brightness-50": true,
                })}>
                <div className="max-w-screen-xl border-2 border-gray-500 bg-white p-8 h-[90vh] overflow-y-auto">
                    <div className="flex justify-between bg-white">
                        <Button
                            type={Button.Types.GHOST_BORDERED}
                            onClick={() => {
                                setIsCategorySelectionVisible(!isCategorySelectionVisible);
                            }}>
                            {isCategorySelectionVisible ? "Hide" : "Show"} category selection
                        </Button>
                        <Button
                            isDisabled={isLoading || expensesWithCategory.length === 0}
                            className="flex items-center gap-2"
                            onClick={async () => {
                                setIsLoading(true);
                                console.info({expensesWithCategory});
                                await submitExpenses(expensesWithCategory);
                                setIsLoading(false);
                            }}>
                            <Spinner className={isLoading ? "animate-spin" : ''}/>
                            <span>Submit {expensesWithCategory.length}!</span>
                        </Button>
                    </div>
                    <div className="mb-4 snap-y overflow-y-auto xl:p-4">
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
                                <div
                                    key={expense.id}
                                    className="snap-start"
                                    id={expense.id}
                                    onClick={() => setActiveId(expense.id)}>
                                    <ExpenseInputs
                                        index={index}
                                        name={expense.name}
                                        note={expense.note}
                                        amount={expense.amountCurrency}
                                        date={expense.date}
                                        timestamp={expense.timestamp}
                                        isVisible={isCategorySelectionVisible}
                                        setExpenses={setExpenses}
                                        subcategory={subcategory}
                                    />
                                    {isCategorySelectionVisible && activeId === expense.id &&
                                        <>
                                            <SimilarExpenses
                                                expense={expense}
                                                existingExpenses={existingExpenses}/>
                                            <LeanCategorySelection
                                                onCategorySelect={(categoryId) => {
                                                    setExpenses((prev) => {
                                                        const newExpenses = [...prev];
                                                        newExpenses[index].categoryId = categoryId;
                                                        return newExpenses;
                                                    });
                                                }}/>
                                        </>}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    }
;
