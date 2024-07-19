import {Trans} from "@lingui/macro";
import {ExpenseCategorySelection} from "../../organisms/ExpenseCategorySelection";
import {addExpenses, Expense} from "../../../utils/db";
import {Button} from "../../atoms";
import React from "react";
import classNames from "classnames";

export const ImportExpensesByCategory = ({expensesByCategory = [], expenses = []}) => {
    const [handledExpenses, setHandledExpenses] = React.useState([]);

    return (
        <div className="w-full overflow-y-auto flex flex-col gap-1 mt-8 mb-4 pb-60">
            {expensesByCategory.map(subcategory => {
                return (
                    <div key={subcategory.currentId}
                         className="w-full flex justify-start items-center px-4 bg-gray-100 rounded">
                        <p className="w-1/6">
                            {subcategory.icon} {subcategory.name.slice(0, 12)}
                        </p>
                        <p className="w-1/4">
                            {subcategory.expenses.length}{' '}
                            <Trans>Expenses in subcategory</Trans>
                        </p>
                        <div className="w-1/2">
                            <ExpenseCategorySelection
                                onCategorySelect={newId => {
                                    setHandledExpenses(prevState => {
                                        return {
                                            ...prevState,
                                            [subcategory.currentId]: subcategory.expenses.map(item => {
                                                const data = {
                                                    ...item,
                                                    subcategoryId: newId,
                                                };

                                                return new Expense(data);
                                            }),
                                        }
                                    });
                                }}
                            />
                        </div>
                        <button className={classNames({
                            "bg-blue-500": true,
                            "grayscale opacity-50 pointer-events-none": handledExpenses[subcategory.currentId]?.length === 0,
                        })}>
                            TEST
                        </button>
                        <Button
                            // isDisabled={handledExpenses[subcategory.currentId]?.length === 0}
                            className={classNames({
                                "grayscale opacity-50 pointer-events-none": handledExpenses[subcategory.currentId]?.length === 0,
                            })}
                            onClick={async () => {
                                const expensesWithCategoryId = expenses.map(expense => {
                                    const subcategory = expensesByCategory[expense.subcategoryId];
                                    return {
                                        ...expense,
                                        subcategoryId: subcategory?.newId || null,
                                    };
                                });

                                const missing = expensesWithCategoryId.find(expense => !expense.subcategoryId);
                                if (missing) {
                                    console.info("Please map all subcategories before parsing", {missing});
                                }

                                localStorage.setItem("mappedExpenses", JSON.stringify(handledExpenses));
                                setHandledExpenses(expensesWithCategoryId);

                                try {
                                    await addExpenses(expensesWithCategoryId);
                                    alert("SUCCESS");
                                } catch (error) {
                                    console.error(error);
                                    alert("ERROR");
                                }
                            }}>
                            <Trans>Parse</Trans>{' '}
                            {handledExpenses[subcategory.currentId]?.length}{' '}
                            <Trans>Transactions</Trans>{' '}
                        </Button>
                    </div>
                )
            })}
        </div>
    );
};
