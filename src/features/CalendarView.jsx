import React, { useState, useContext, useMemo } from 'react';
import expenses from '../mocks/expenses.json';
import { CategoriesContext } from '../context/CategoriesContext';
import { ExpensesContext } from '../context/ExpensesContext';
import classNames from 'classnames';
import { formatCurrency } from '../utils/currency';
export const CalendarView = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    // const { expenses } = useContext(ExpensesContext);
    const { categories } = useContext(CategoriesContext);
    const incomeSubcategoriesIds = useMemo(() => {
        return categories.filter(category => category.isIncome).flatMap(category => category.subcategories.map(subcategory => subcategory.id));
    }, [categories]);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handlePreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const expensesByDay = expenses.reduce((acc, expense) => {
        const expenseDate = new Date(expense.timestamp);
        if (
            expenseDate.getMonth() === currentMonth &&
            expenseDate.getFullYear() === currentYear
        ) {
            const day = expenseDate.getDate();
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(expense);
        }
        return acc;
    }, {});

    let runningBalance = 0;

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePreviousMonth} className="p-3 bg-gray-200 rounded-lg">
                    Previous
                </button>
                <span className="text-lg font-bold">
                    {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={handleNextMonth} className="p-3 bg-gray-200 rounded-lg">
                    Next
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(dayName => (
                    <div key={dayName} className="text-center font-bold text-xs sm:text-sm">
                        {dayName}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={`empty-${index}`} className="border border-transparent p-3"></div>
                ))}
                {days.map(day => {
                    const dayExpenses = expensesByDay[day] || [];
                    const dayChange = dayExpenses.reduce((sum, expense) => {
                        const isIncome = incomeSubcategoriesIds.includes(expense.subcategoryId);
                        return sum + (isIncome ? expense.amount : -expense.amount);
                    }, 0);
                    runningBalance += dayChange;

                    return (
                        <div
                            key={day}
                            className={classNames({
                                "border border-gray-300 p-3 text-right rounded-lg flex justify-between items-center": true,
                                "bg-red-50": dayChange < 0 && dayChange > -1000,
                                "bg-red-200": dayChange < -1000 && dayChange > -10000,
                                "bg-red-300": dayChange < -10000,
                                "bg-green-50": dayChange > 0 && dayChange < 1000,
                                "bg-green-100": dayChange > 1000 && dayChange < 10000,
                                "bg-green-200": dayChange > 10000,
                            })}
                        >
                            <div className={classNames({
                                "font-bold rounded-full flex items-center justify-center size-7": true,
                                "bg-black text-white": new Date().getDate() === day,
                            })}>{day}</div>
                            <div>
                                <div className={`text-sm  ${dayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {formatCurrency(dayChange, true, true)}
                                </div>
                                {/* <div className={`font-bold ${runningBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {formatCurrency(runningBalance)}
                                </div> */}
                            </div>
                            {/* <div className="h-20 overflow-y-auto">
                                {dayExpenses.map((expense, index) => (
                                    <div key={index} className="text-sm">
                                        {expense.name}: {expense.amount}
                                    </div>
                                ))}
                            </div> */}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
