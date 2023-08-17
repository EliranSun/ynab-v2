import { useContext, useMemo, useState } from "react";
import { BudgetContext, ExpensesContext } from "./../../context";
import { Categories } from "../../constants";
import { useDate } from "../DateChanger/DateChanger";
import { Title } from "../atoms";
import Subcategory from "./Subcategory";
import { orderBy } from "lodash";
import classNames from "classnames";

const IncomeIds = ["81", "82", "83"];

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("he-IL", {
        style: "currency",
        currency: "ILS",
        currencyDisplay: 'symbol',
        notation: 'compact',
        // notation: 'standard',
    }).format(amount);
};

const BudgetView = () => {
    const { currentTimestamp, NextButton, PreviousButton, isSameDate, isPreviousMonth } = useDate();
    const { expensesArray: expenses } = useContext(ExpensesContext);
    const { setBudget, budget } = useContext(BudgetContext);
    const [selectedId, setSelectedId] = useState(null);
    
    const categoriesWithAmounts = useMemo(() => Categories.map((category) => {
        let expensesInCategorySum = 0;
        category.subCategories.forEach((subcategory) => {
            const expensesInCategory = expenses.filter((expense) => {
                // TODO: same type instead of casting
                return String(expense.categoryId) === String(subcategory.id);
            });
            
            const thisMonthExpenses = expensesInCategory.filter((expense) => {
                const date = new Date(currentTimestamp);
                const expenseDate = new Date(expense.timestamp);
                if (expense.isRecurring) {
                    return expenseDate.getFullYear() === date.getFullYear();
                }
                
                return (
                    expenseDate.getMonth() === date.getMonth() &&
                    expenseDate.getFullYear() === date.getFullYear()
                );
            });
            const thisMonthAmount = thisMonthExpenses.reduce((acc, expense) => {
                return acc + expense.amount;
            }, 0);
            
            expensesInCategorySum += thisMonthAmount;
        });
        
        return {
            ...category,
            totalAmount: expensesInCategorySum,
        };
    }), [expenses, currentTimestamp]);
    
    const totalExpenses = useMemo(() => {
        return Object.values(categoriesWithAmounts)
            .reduce((acc, curr) => {
                if (curr.isIncome) return acc;
                return acc + curr.totalAmount;
            }, 0);
    }, [categoriesWithAmounts]);
    const totalIncome = useMemo(() => {
        return Object.values(categoriesWithAmounts)
            .reduce((acc, curr) => {
                if (!curr.isIncome) return acc;
                return acc + curr.totalAmount;
            }, 0);
    }, [categoriesWithAmounts]);
    
    const bottomLine = totalIncome - totalExpenses;
    
    // const budgetExpenses = Object.entries(budget["11.2022"]).reduce(
    //     (acc, curr) => {
    //         const [categoryId, amount] = curr;
    //         const isIncome = IncomeIds.includes(String(categoryId));
    //         if (isIncome) {
    //             return acc;
    //         }
    //         return acc + Number(amount);
    //     },
    //     0
    // );
    //
    // const budgetIncome = Object.entries(budget["11.2022"]).reduce((acc, curr) => {
    //     const [categoryId, amount] = curr;
    //     const isIncome = IncomeIds.includes(String(categoryId));
    //     if (!isIncome) {
    //         return acc;
    //     }
    //     return acc + Number(amount);
    // }, 0);
    //
    // const budgetBottomLine = budgetIncome - budgetExpenses;
    
    // const handleBudgetChange = (value, subcategoryId, date) => {
    //     setBudget(value, subcategoryId, date);
    // };
    
    return (
        <div>
            <div>
                <div className="flex w-full gap-4 items-center font-mono">
                    <div className="flex justify-center items-center">
                        <div className="flex gap-2 mr-4">
                            <PreviousButton/>
                            <NextButton/>
                        </div>
                        <Title className="h-full">
                            {new Date(currentTimestamp).toLocaleString("en-US", {
                                month: "short",
                                year: "2-digit",
                            })}:
                        </Title>
                    </div>
                    <div className="flex mx-6">
                        <Title className="text-green-400">
                            +{formatCurrency(totalIncome)}
                        </Title>
                        <Title className="text-red-400">
                            -{formatCurrency(totalExpenses)}
                        </Title>
                    </div>
                    <Title>
                        =
                    </Title>
                    <Title className={classNames("text-white", {
                        'bg-green-500': bottomLine > 0,
                        'bg-red-500': bottomLine < 0,
                    })}>
                        {formatCurrency(bottomLine)}
                    </Title>
                </div>
                {/*<h2>Budget this month: {budgetExpenses}</h2>*/}
                {/*<h2>Income Budget this month: {budgetIncome}</h2>*/}
                {/*<h2>Bottom Line: {budgetBottomLine}</h2>*/}
            </div>
            <div className="flex flex-wrap">
                {orderBy(categoriesWithAmounts, ['totalAmount'], ['desc']).map((category) => {
                    const total = Math.round(category.totalAmount);
                    const totalCurrency = new Intl.NumberFormat('he-IL', {
                        style: 'currency',
                        currency: 'ILS',
                        currencyDisplay: 'symbol',
                        notation: 'compact',
                    }).format(total);
                    const subcategories = Categories.find((c) =>
                        c.id === category.id)?.subCategories;
                    
                    if (total === 0) {
                        return null;
                    }
                    
                    return (
                        <div
                            key={category.id}
                            className="bg-gray-200 m-4 p-4 w-fit gap-4 items-center text-center">
                            <Title type={Title.Types.H2}>
                                {category.name} {totalCurrency}
                            </Title>
                            {/*<h3>*/}
                            {/*    Budget:{" "}*/}
                            {/*    {category.subCategories.reduce((acc, curr) => {*/}
                            {/*        if (!budget[curr.id]?.amount) return acc;*/}
                            {/*        return acc + Number(budget[curr.id]?.amount);*/}
                            {/*    }, 0)}{" "}*/}
                            {/*    NIS*/}
                            {/*</h3>*/}
                            <div className="flex gap-4">
                                {subcategories.map((subcategory) => {
                                    if (subcategory.amount === 0) return null;
                                    
                                    return (
                                        <Subcategory
                                            {...subcategory}
                                            key={subcategory.id}
                                            isSelected={selectedId === subcategory.id}
                                            onSubcategoryClick={setSelectedId}
                                            currentTimestamp={currentTimestamp}
                                            isPreviousMonth={isPreviousMonth}
                                            isSameDate={isSameDate}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default BudgetView;
