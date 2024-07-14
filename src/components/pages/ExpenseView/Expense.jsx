import {useContext, useEffect, useMemo, useState} from "react";
import {deleteExpense, getExpenseCategoryName} from "../../../utils";
import classNames from "classnames";
import {ExpensesContext} from "../../../context";
import {ExpenseInputs} from "../../molecules/ExpenseInputs";

const Expense = ({
                     expense,
                     isListView = false,
                 }) => {
    const [isUpdated, setIsUpdated] = useState(false);
    const {refetch} = useContext(ExpensesContext);
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
            <div className={classNames("p-0 md:p-4 w-full", {
                "flex w-full gap-4 mb-4 items-center": isListView,
            })}>
                <ExpenseInputs
                    readonly
                    expense={expense}
                    isVisible={isListView}
                    subcategoryLabel={category.subcategoryName}
                    onRemove={async () => {
                        if (window.confirm(`Are you sure you want to delete ${expense.name}?`)) {
                            await deleteExpense(expense.id);
                            setIsUpdated(true);
                            refetch();
                        }
                    }}/>
            </div>
        </>
    );
};

export default Expense;