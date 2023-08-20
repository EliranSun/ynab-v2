import { useMemo, useState } from "react";
import { deleteExpense, getExpenseCategoryName, updateCategory } from "../../utils";
import { noop } from "lodash";
import classNames from "classnames";
import { Button } from "../atoms";
import { CategoriesDropdownMenu } from "./CategoriesDropdownMenu";

const Expense = ({
    expense,
    onIsIncomeChange = noop,
    onCategoryClick = noop,
    onIsRecurringChange = noop,
    onNoteChange = noop,
    onAmountClick = noop,
    isListView = false,
    onDelete = noop
}) => {
    const [note, setNote] = useState(expense.note);
    const category = useMemo(
        () => getExpenseCategoryName(expense.categoryId),
        [expense]
    );

    return (
        <div id={expense.id}
             className={classNames("border border-black w-full", {
                 "flex flex-row w-full gap-4 items-center": isListView,
             })}
        >
            <div className="w-2/12 min-w-fit border-r border-black whitespace-nowrap text-ellipsis overflow-hidden px-4">
                {new Date(expense.timestamp).toLocaleString("en-GB", {
                    month: "short",
                    year: "numeric",
                    day: "numeric",
                })}
            </div>
            <h1 className="w-2/12 min-w-fit whitespace-nowrap text-ellipsis overflow-hidden">
                {expense.name}
            </h1>
            <span>{expense.categoryId}</span>
            <CategoriesDropdownMenu
                onCategoryChange={async (categoryId) => {
                    const results = await updateCategory(expense.id, categoryId)
                    alert("Updated category to " + results.categoryId);
                }}
                defaultValueId={category.subcategoryId}/>
            <div
                className="w-20"
                onClick={() => onAmountClick(expense.id, expense.amount)}>
                {expense.amount} NIS
            </div>
            <textarea
                value={note.toString()}
                className="border border-black"
                onBlur={() => {
                    onNoteChange(expense.id, note);
                }}
                onInput={(event) => {
                    setNote(event.target.value);
                }}
            />
            <div className="hidden lg:inline">
                <label>Is recurring?</label>
                <input
                    checked={expense.isRecurring}
                    type="checkbox"
                    onChange={() => {
                        onIsRecurringChange(expense.id, !expense.isRecurring);
                    }}
                />
            </div>
            <Button
                type={Button.Types.Danger}
                onClick={async () => {
                    if (window.confirm(`Are you sure you want to delete ${expense.name}?`)) {
                        await deleteExpense(expense.id);
                        onDelete();
                    }
                }}>
                DELETE!
            </Button>
        </div>
    );
};

export default Expense;