import React, { useState, useContext, useMemo } from 'react';
import { CategoriesContext } from '../context/CategoriesContext';
import { ExpensesContext } from '../context/ExpensesContext';
import classNames from 'classnames';
import { formatCurrency } from '../utils/currency';
import { ExpensesPopover } from '../components/organisms/ExpensesPopover';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/macro';

export const CalendarView = () => {
    const { _ } = useLingui();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedTimestamp, setSelectedTimestamp] = useState(new Date().getTime());
    const { expenses } = useContext(ExpensesContext);
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

    const dayNames = [_(msg`Sun`), _(msg`Mon`), _(msg`Tue`), _(msg`Wed`), _(msg`Thu`), _(msg`Fri`), _(msg`Sat`)];
    const selectedDayExpenses = expensesByDay[new Date(selectedTimestamp).getDate()];

    console.log({ selectedDayExpenses });

    return (
        <div className="p-4 relative w-full">
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
            <div className="flex w-full gap-8">
                <div className="mb-4 w-2/3">
                    <div className="grid grid-cols-7 gap-px sm:gap-1 mb-2 w-full">
                        {dayNames.map(dayName => (
                            <div key={dayName} className="text-center font-bold text-xs sm:text-sm">
                                {dayName}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-px md:gap-1 w-full">
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
                            const isSelectedDay = selectedTimestamp === new Date(currentYear, currentMonth, day).getTime();

                            return (
                                <div
                                    key={day}
                                    onClick={() => setSelectedTimestamp(new Date(currentYear, currentMonth, day).getTime())}
                                    className={classNames({
                                        "p-3 text-right rounded-lg": true,
                                        "flex flex-col justify-between items-start relative": true,
                                        "outline outline-2 outline-amber-500": isSelectedDay,
                                        "border border-gray-300": !isSelectedDay,
                                        "bg-red-50": dayChange < 0 && dayChange > -1000,
                                        "bg-red-200": dayChange < -1000 && dayChange > -10000,
                                        "bg-red-300": dayChange < -10000,
                                        "bg-green-50": dayChange > 0 && dayChange < 1000,
                                        "bg-green-100": dayChange > 1000 && dayChange < 10000,
                                        "bg-green-200": dayChange > 10000,
                                    })}
                                >
                                    <div className="font-bold w-full flex items-center justify-center h-5 mb-4">
                                        <span className={classNames({
                                            "font-mono rounded-full px-2 py-1": true,
                                            "bg-black text-white": new Date().getDate() === day
                                        })}>{day}</span>
                                    </div>
                                    <div className="">
                                        <div className={`text-sm ${dayChange >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                                            {formatCurrency(dayChange, false, true)}
                                        </div>
                                        <div className={`text-sm font-bold ${runningBalance >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                                            {formatCurrency(runningBalance, true)}
                                        </div>
                                    </div>
                                    {/* */}
                                    <div className={classNames({
                                        "absolute z-10 bottom-0 translate-y-2/3 left-3": true,
                                        "md:hidden": true,
                                        "max-h-40 md:h-fit": true,
                                        "overflow-y-auto": true,
                                        "shadow-lg rounded-lg": true,
                                        "p-4 bg-white": true,
                                        "w-2/3": true,
                                        "hidden":
                                            !selectedDayExpenses ||
                                            !isSelectedDay,
                                    })}>
                                        {selectedDayExpenses?.map((expense, index) => (
                                            <div key={index} className="text-sm flex justify-between">
                                                <span>{expense.name}</span>
                                                <span>{formatCurrency(expense.amount, false, false)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="hidden md:block md:h-fit overflow-y-auto p-4 w-1/3">
                    {selectedDayExpenses?.map((expense, index) => (
                        <div key={index} className="text-sm flex justify-between bg-gray-100 p-2 px-4 m-1 rounded-lg">
                            <div className="flex flex-col">
                                <span>{expense.name}</span>
                                <span className="text-xs text-gray-500">
                                    {expense.subcategory?.icon}{expense.subcategory?.name} - {expense.note}
                                </span>
                            </div>
                            <span>{formatCurrency(expense.amount, false, false)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
