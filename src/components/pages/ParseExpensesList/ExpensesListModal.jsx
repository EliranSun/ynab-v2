import {noop} from "lodash"
import {Button, Spinner} from "../../atoms";
import {useContext, useEffect, useMemo, useState} from "react";
import {ExpenseInputs} from "../../molecules/ExpenseInputs";
import classNames from "classnames";
import {CategoriesContext} from "../../../context/CategoriesContext";
import {X} from "@phosphor-icons/react";

export const ExpensesListModal = ({
                                      expenses = [],
                                      existingExpenses = [],
                                      setExpenses = noop,
                                      submitExpenses = noop,
                                      deleteExpense = noop,
                                  }) => {
        const {categories} = useContext(CategoriesContext);
        const [isOpen, setIsOpen] = useState(true);
        const [isLoading, setIsLoading] = useState(false);
        const expensesWithCategory = useMemo(() => expenses.filter((expense) => {
            return !!expense.subcategoryId;
        }), [expenses]);

        const [activeId, setActiveId] = useState(expenses.find((expense) => {
            return !expense.subcategoryId;
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

        if (expenses.length === 0 || !isOpen) {
            return (
                <div className="fixed top-20 left-20 z-30 shadow-xl" onClick={() => setIsOpen(true)}>
                    <Button>OPEN</Button>
                </div>
            );
        }

        return (
            <div
                className={classNames({
                    "fixed inset-0 z-30 flex flex-col items-center justify-center": true,
                    "size-screen border-none backdrop-brightness-50": true,
                })}>
                <div className="mb-4 rounded-full bg-white p-8" onClick={() => {
                    setIsOpen(false);
                }}>
                    <X size={32} color="black"/>
                </div>
                <div className="max-w-screen-xl border-2 border-gray-500 bg-white p-8 h-[90vh] overflow-y-auto">
                    <div className="flex justify-between bg-white">
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
                            categories.forEach((category) => {
                                category.subcategories.forEach((sub) => {
                                    if (sub.id === expense.subcategoryId) {
                                        subcategory = sub;
                                    }
                                });
                            });

                            return (
                                <div
                                    id={expense.id}
                                    key={expense.id}
                                    onClick={() => setActiveId(expense.id)}>
                                    <ExpenseInputs
                                        index={index}
                                        expense={expense}
                                        isVisible
                                        subcategory={subcategory}
                                        onRemove={() => {
                                            setExpenses((prev) => {
                                                const newExpenses = [...prev];
                                                newExpenses.splice(index, 1);
                                                return newExpenses;
                                            });

                                            deleteExpense(expense);
                                        }}
                                        onInputChange={(type, value) => {
                                            setExpenses((prev) => {
                                                const newExpenses = [...prev];
                                                newExpenses[index][type] = value;
                                                return newExpenses;
                                            });
                                        }}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    }
;
