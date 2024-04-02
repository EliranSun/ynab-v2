import { useContext, useEffect, useMemo, useState } from "react";
import { deleteExpense, getExpenseCategoryName, updateCategory } from "../../../utils";
import classNames from "classnames";
import { Button } from "../../atoms";
import { CategoriesDropdownMenu } from "./CategoriesDropdownMenu";
import { ExpensesContext } from "../../../context";
import { Trash } from "@phosphor-icons/react";

const Expense = ({
    expense,
    isListView = false,
}) => {
    const [note, setNote] = useState(expense.note);
    const [isUpdated, setIsUpdated] = useState(false);
    const { refetch, setExpenseAsRecurring, setExpenseNote } = useContext(ExpensesContext);
    const category = useMemo(() => getExpenseCategoryName(expense.categoryId), [expense]);

    useEffect(() => {
        if (isUpdated) {
            setTimeout(() => {
                setIsUpdated(false);
            }, 3000);
        }
    }, [isUpdated]);

    return (
        <>
            <div
                id={expense.id}
                className={classNames("p-0 md:p-4 w-full bg-gray-100", {
                    "flex flex-col md:flex-row w-full gap-4 items-center": isListView,
                })}
            >
                <div className={classNames("w-2/12 min-w-fit whitespace-nowrap text-ellipsis overflow-hidden", {
                    "border-r border-black": isListView,
                })}>
                    {expense.date}
                </div>
                <h1 className="w-2/12 font-bold text-xl min-w-fit whitespace-nowrap text-ellipsis overflow-hidden">
                    {expense.name},{expense.amountCurrency}
                </h1>
                <CategoriesDropdownMenu
                    defaultValueId={category.subcategoryId}
                    onCategoryChange={async (categoryId) => {
                        await updateCategory(expense.id, categoryId)
                        setIsUpdated(true);
                    }}/>
                <textarea
                    value={note.toString()}
                    className="border border-black"
                    onBlur={async () => {
                        await setExpenseNote(expense.id, note);
                        setIsUpdated(true);
                    }}
                    onInput={(event) => {
                        setNote(event.target.value);
                    }}
                />
                <div className="hidden lg:block">
                    <label className="p-2">Recurring?</label>
                    <input
                        type="number"
                        value={expense.recurring}
                        className="border"
                        onChange={async (event) => {
                            const value = event.target.value;
                            await setExpenseAsRecurring(expense.id, value)
                            setIsUpdated(true);
                            refetch();
                        }}
                    />
                </div>
                <Button
                    type={Button.Types.DANGER}
                    onClick={async () => {
                        if (window.confirm(`Are you sure you want to delete ${expense.name}?`)) {
                            await deleteExpense(expense.id);
                            setIsUpdated(true);
                            refetch();
                        }
                    }}>
                    <Trash size={21} weight="duotone"/>
                </Button>
            </div>

            <div role="status" className={classNames({
                "hidden": !isUpdated,
                "fixed bottom-10 m-auto bg-white shadow-xl p-2": true
            })}>
                Expense updated!
            </div>
        </>
    );
};

export default Expense;