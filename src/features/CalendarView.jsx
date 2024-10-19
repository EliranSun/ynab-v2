import React, { useState, useContext, useMemo } from 'react';
import expenses from '../mocks/expenses.json';
import { CategoriesContext } from '../context/CategoriesContext';

export const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const { categories } = useContext(CategoriesContext);
  const incomeSubcategoriesIds = useMemo(() => {
    return categories.filter(category => category.isIncome).flatMap(category => category.subcategories.map(subcategory => subcategory.id));
  }, [categories]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
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

  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePreviousMonth} className="p-2 bg-gray-200 rounded">
          Previous
        </button>
        <span className="text-lg font-bold">
          {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={handleNextMonth} className="p-2 bg-gray-200 rounded">
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
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
              className="border border-gray-300 p-2 text-center"
            >
              <div>{day}</div>
              {dayExpenses.map((expense, index) => (
                <div key={index} className="text-sm">
                  {expense.name}: {expense.amount}
                </div>
              ))}
              <div className={`text-sm font-bold ${dayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {dayChange >= 0 ? '+' : ''}{dayChange.toFixed(2)}
              </div>
              <div className="text-xs">
                Balance: {runningBalance.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
