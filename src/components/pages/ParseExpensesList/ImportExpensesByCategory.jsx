import {Trans} from "@lingui/macro";
import {ExpenseCategorySelection} from "../../organisms/ExpenseCategorySelection";
import {addExpenses, Expense} from "../../../utils/db";
import {Button} from "../../atoms";
import {useState} from "react";
import classNames from "classnames";
import {Trash, X} from "@phosphor-icons/react";
import {noop} from "lodash";
import {AddExpenseEntry} from "./AddExpenseEntry";

const Subcategory = ({subcategory, onRemove = noop, onRemoveExpense = noop}) => {
    const [handledExpenses, setHandledExpenses] = useState([]);
    const [isExpensesListOpen, setIsExpensesListOpen] = useState(false);

    return (
        <div key={subcategory.currentId}
             className="w-full flex justify-start items-center px-4 bg-gray-100 rounded">
            <p className="w-1/6">
                {subcategory.icon} {subcategory.name.slice(0, 12)}
            </p>
            <div className="w-1/4 cursor-pointer" onClick={() => setIsExpensesListOpen(true)}>
                {subcategory.expenses.length}{' '}
                <Trans>Expenses in subcategory</Trans>
                <div className={classNames({
                    "absolute z-10 bg-white shadow-md p-4 rounded h-[66vh] overflow-y-auto": true,
                    "hidden": !isExpensesListOpen,
                })}>
                    <Button onClick={(event) => {
                        event.stopPropagation();
                        setIsExpensesListOpen(false)
                    }}>
                        <X/>
                    </Button>
                    {subcategory.expenses.map(expense =>
                        <AddExpenseEntry
                            key={expense.id}
                            onRemove={() => onRemoveExpense(expense.id)}
                            onSuccess={() => onRemoveExpense(expense.id)}
                            expense={expense}/>
                    )}
                </div>
            </div>
            <div className="w-1/2">
                <ExpenseCategorySelection
                    onCategorySelect={newId => {
                        setHandledExpenses(subcategory.expenses.map(item => {
                            const data = {
                                ...item,
                                subcategoryId: newId,
                            };

                            return new Expense(data);
                        }));
                    }}
                />
            </div>
            <Button
                isDisabled={handledExpenses.length === 0}
                className={classNames({
                    "grayscale opacity-30 pointer-events-none": handledExpenses.length === 0,
                })}
                onClick={async () => {
                    const missing = handledExpenses.find(expense => !expense.subcategoryId);
                    if (missing) {
                        console.info("Please map all subcategories before parsing", {missing});
                        return;
                    }

                    console.info("All subcategories mapped, parsing", {
                        handledExpenses: handledExpenses.map(item => item.name)
                    });

                    if (window.confirm("Are you sure you want to parse these transactions?")) {
                        try {
                            await addExpenses(handledExpenses);
                            alert("SUCCESS");
                            onRemove();
                        } catch (error) {
                            console.error(error);
                            alert("ERROR");
                        }
                    }
                }}>
                <Trans>Parse</Trans>{' '}
                {handledExpenses[subcategory.currentId]?.length}{' '}
                <Trans>Transactions</Trans>{' '}
            </Button>
            <Button type={Button.Types.DANGER} onClick={() => {
                if (window.confirm(`Are you sure you want to remove all expenses in ${subcategory.name}?`)) {
                    onRemove();
                }
            }}>
                <Trash/>
            </Button>
        </div>
    )
}
export const ImportExpensesByCategory = ({expensesByCategory = [], onRemove = noop, onRemoveExpense = noop}) => {

    return (
        <div className="w-full overflow-y-auto flex flex-col gap-1 mt-8 mb-4 pb-60">
            {expensesByCategory.map(subcategory => {
                return (
                    <Subcategory
                        key={subcategory.currentId}
                        onRemoveExpense={onRemoveExpense}
                        onRemove={() => onRemove(subcategory.currentId)}
                        subcategory={subcategory}/>
                );
            })}
        </div>
    );
};
