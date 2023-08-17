import { Title } from "../atoms";
import { useContext, useMemo } from "react";
import { noop, orderBy } from "lodash";
import { ExpensesContext } from "../../context";
import { isSameMonth } from "date-fns";
import { formatCurrency } from "../../utils";
import SubcategoryExpensesList from "./SubcategoryExpensesList";

const Subcategory = ({
    icon,
    name,
    id,
    onSubcategoryClick = noop,
    isSameDate = noop,
    isPreviousMonth = noop,
    isSelected = false,
    currentTimestamp
}) => {
    const { expensesArray: expenses, expensesPerMonthPerCategory } = useContext(ExpensesContext);
    const expensesInCategory = expenses.filter((expense) => {
        // TODO: same type instead of casting
        return (
            String(expense.categoryId) === String(id)
        );
    });
    const thisMonthExpenses = useMemo(() => expensesInCategory.filter(
        (expense) => {
            const date = new Date(currentTimestamp);
            const expenseDate = new Date(expense.timestamp);
            
            if (expense.isRecurring) {
                return (
                    expenseDate.getFullYear() === date.getFullYear()
                );
            }
            
            return isSameMonth(expenseDate, date);
        }
    ), [currentTimestamp, expensesInCategory]);
    
    const thisMonthAmount = useMemo(() => {
        const amount = thisMonthExpenses.reduce((acc, expense) => {
            return acc + expense.amount;
        }, 0);
        
        return formatCurrency(amount);
    }, [thisMonthExpenses]);
    
    const totalInPreviousMonth = useMemo(() => {
        const amount = expenses.reduce(
            (total, expense) => {
                if (id === expense.categoryId && isPreviousMonth(expense.timestamp)) {
                    return total + expense.amount;
                }
                return total;
            }, 0);
        
        return formatCurrency(amount);
    }, [expenses, id, thisMonthExpenses]);
    
    const getAverageAmount = (id) => {
        if (!expensesPerMonthPerCategory[id]) {
            return 0;
        }
        
        let total = 0;
        let count = 0;
        const months = Object.values(expensesPerMonthPerCategory[id]);
        for (const month of months) {
            total += month.amount;
            count += month.expenses.length;
        }
        
        return formatCurrency(total / count);
    };
    
    const averageAmount = getAverageAmount(String(id));
    
    const expensesInCategoryThisDate = useMemo(() => {
        return orderBy(
            expensesInCategory
                .filter((expense) => isSameDate(expense.timestamp))
                .map((expense) => {
                    return (
                        <li>■ {expense.name.slice(0, 15)} {expense.amount}</li>
                    );
                }),
            "amount",
            "desc"
        );
    }, [expensesInCategory, currentTimestamp]);
    
    if (thisMonthAmount === formatCurrency(0)) {
        return null;
    }
    
    return (
        <div className="relative">
            <div className="bg-gray-300 p-4" onClick={() => onSubcategoryClick(id)}>
                <Title type={Title.Types.H3}>
                    {icon} {thisMonthAmount}
                </Title>
                <div className="text-xs">
                    <div>Previous month: {totalInPreviousMonth}</div>
                    <div>Average: {averageAmount}</div>
                </div>
                {/*<div>Budget: 0</div>*/}
            </div>
            {isSelected && expensesInCategoryThisDate.length > 0 &&
                <SubcategoryExpensesList
                    id={id}
                    expensesPerMonthPerCategory={expensesPerMonthPerCategory[id]}
                    onSubcategoryClick={onSubcategoryClick}
                />}
        </div>
    );
};

export default Subcategory;