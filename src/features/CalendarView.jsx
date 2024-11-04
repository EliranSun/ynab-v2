import React, { useState, useContext, useMemo } from "react";
import { CategoriesContext } from "../context/CategoriesContext";
import { ExpensesContext } from "../context/ExpensesContext";
import classNames from "classnames";
import { formatCurrency } from "../utils/currency";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/macro";

const isMobile = window.innerWidth < 768;

export const CalendarView = () => {
	const { _ } = useLingui();
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
	const [selectedTimestamp, setSelectedTimestamp] = useState(
		new Date().getTime()
	);
	const { expenses } = useContext(ExpensesContext);
	const { categories } = useContext(CategoriesContext);
	const incomeSubcategoriesIds = useMemo(() => {
		return categories
			.filter((category) => category.isIncome)
			.flatMap((category) =>
				category.subcategories.map((subcategory) => subcategory.id)
			);
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

		setSelectedTimestamp(new Date(currentYear, currentMonth, 1).getTime());
	};

	const handleNextMonth = () => {
		if (currentMonth === 11) {
			setCurrentMonth(0);
			setCurrentYear(currentYear + 1);
		} else {
			setCurrentMonth(currentMonth + 1);
		}

		setSelectedTimestamp(new Date(currentYear, currentMonth + 1, 1).getTime());
	};

	let totalIncomeThisMonth = 0;
	let totalExpensesThisMonth = 0;

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

			console.log({
				incomeSubcategoriesIds,
				expenseSubId: expense.subcategoryId,
			});
			if (incomeSubcategoriesIds.includes(expense.subcategoryId)) {
				totalIncomeThisMonth += expense.amount;
			} else {
				totalExpensesThisMonth += expense.amount;
			}
		}
		return acc;
	}, {});

	let runningBalance = 0;

	const dayNames = [
		_(msg`Sun`),
		_(msg`Mon`),
		_(msg`Tue`),
		_(msg`Wed`),
		_(msg`Thu`),
		_(msg`Fri`),
		_(msg`Sat`),
	];
	const selectedDayExpenses =
		expensesByDay[new Date(selectedTimestamp).getDate()];

	const [tooltipPosition, setTooltipPosition] = useState({});

	// Function to calculate tooltip position
	const calculateTooltipPosition = (dayElement) => {
		const rect = dayElement.getBoundingClientRect();
		const tooltipWidth = 200; // Assume a fixed width for the tooltip
		const tooltipHeight = 100; // Assume a fixed height for the tooltip
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;

		let left = rect.left + window.scrollX;
		let top = rect.bottom + window.scrollY;

		// Adjust if the tooltip overflows the right edge
		if (left + tooltipWidth > screenWidth) {
			left = screenWidth - tooltipWidth - 10; // 10px padding
		}

		// Adjust if the tooltip overflows the bottom edge
		if (top + tooltipHeight > screenHeight) {
			top = rect.top + window.scrollY - tooltipHeight - 10; // 10px padding
		}

		setTooltipPosition({ left, top });
	};

	return (
		<div className="md:p-4 relative w-full">
			<div className="p-4 md:p-0 flex justify-between items-center mb-4">
				<span className="text-lg font-bold">
					{new Date(currentYear, currentMonth).toLocaleString("he-IL", {
						month: "long",
						year: "numeric",
					})}
				</span>
				<div className="flex gap-2">
					<button
						onClick={handlePreviousMonth}
						className="p-1 md:p-3 bg-gray-200 rounded-lg">
						Prev
					</button>
					<button
						onClick={handleNextMonth}
						className="p-1 md:p-3 bg-gray-200 rounded-lg">
						Next
					</button>
				</div>
			</div>
			<div className="p-1 md:p-0 flex flex-col md:flex-row w-full gap-8">
				<div className="mb-4 w-full md:w-2/3">
					<div className="grid grid-cols-7 gap-px sm:gap-1 mb-2 w-full">
						{dayNames.map((dayName) => (
							<div
								key={dayName}
								className="text-center font-bold text-xs sm:text-sm">
								{dayName}
							</div>
						))}
					</div>
					<div className="grid grid-cols-7 gap-px md:gap-1 w-full">
						{Array.from({ length: firstDayOfMonth }).map((_, index) => (
							<div
								key={`empty-${index}`}
								className="border border-transparent p-3"></div>
						))}
						{days.map((day) => {
							const dayExpenses = expensesByDay[day] || [];
							const dayChange = dayExpenses.reduce((sum, expense) => {
								const isIncome = incomeSubcategoriesIds.includes(
									expense.subcategoryId
								);
								return sum + (isIncome ? expense.amount : -expense.amount);
							}, 0);
							runningBalance += dayChange;
							const isSelectedDay =
								selectedTimestamp ===
								new Date(currentYear, currentMonth, day).getTime();

							return (
								<div
									key={day}
									onClick={(event) => {
										setSelectedTimestamp(
											new Date(currentYear, currentMonth, day).getTime()
										);
										calculateTooltipPosition(event.target);
									}}
									className={classNames({
										"p-1 py-3 md:p-3 text-right rounded-lg": true,
										"flex flex-col justify-between items-start relative": true,
										"outline outline-2 outline-amber-500": isSelectedDay,
										"border border-gray-300": !isSelectedDay,
										"bg-red-50": dayChange < 0 && dayChange > -1000,
										"bg-red-200": dayChange < -1000 && dayChange > -10000,
										"bg-red-300": dayChange < -10000,
										"bg-green-50": dayChange > 0 && dayChange < 1000,
										"bg-green-100": dayChange > 1000 && dayChange < 10000,
										"bg-green-200": dayChange > 10000,
									})}>
									<div className="font-bold w-full flex items-center justify-center h-5 md:mb-4">
										<span
											className={classNames({
												"text-sm font-mono rounded-full px-2 md:py-1": true,
												"bg-black text-white": new Date().getDate() === day,
											})}>
											{day}
										</span>
									</div>
									<div className="">
										<div
											className={`text-xs md:text-sm ${
												dayChange >= 0 ? "text-green-800" : "text-red-800"
											}`}>
											{formatCurrency(dayChange, isMobile, true)}
										</div>
										<div
											className={`text-xs md:text-sm font-bold ${
												runningBalance >= 0 ? "text-green-900" : "text-red-900"
											}`}>
											{formatCurrency(runningBalance, true)}
										</div>
									</div>
									<div
										style={{
											position: "fixed",
											left: tooltipPosition.left,
											top: tooltipPosition.top,
											visibility:
												selectedDayExpenses && isSelectedDay
													? "visible"
													: "hidden",
										}}
										className={classNames({
											"translate-y-full w-[50vw]  inset-x-0 m-auto": false,
											"z-10": true,
											"md:hidden": true,
											"max-h-40 md:h-fit": true,
											"overflow-y-auto": true,
											"shadow-lg rounded-lg": true,
											"p-4 bg-white": true,
											"w-fit md:w-2/3": true,
										})}>
										{selectedDayExpenses?.map((expense, index) => (
											<div
												key={index}
												className="text-xs md:text-sm flex justify-between gap-2">
												<span>{expense.name}</span>
												<span>
													{formatCurrency(expense.amount, isMobile, false)}
												</span>
											</div>
										))}
									</div>
								</div>
							);
						})}
					</div>
				</div>
				<div className="flex flex-col gap-1">
					<h1>+{formatCurrency(totalIncomeThisMonth, false, false)}</h1>
					<h1>-{formatCurrency(totalExpensesThisMonth, false, false)}</h1>
					<span className="">=</span>
					<h1
						className={classNames({
							"font-bold": true,
							"text-red-500": totalIncomeThisMonth - totalExpensesThisMonth < 0,
							"text-green-500":
								totalIncomeThisMonth - totalExpensesThisMonth > 0,
						})}>
						{formatCurrency(totalIncomeThisMonth - totalExpensesThisMonth)}
					</h1>
				</div>
				<div className="hidden md:block md:h-fit overflow-y-auto p-4 w-1/3">
					{selectedDayExpenses?.map((expense, index) => (
						<div
							key={index}
							className="text-sm flex justify-between bg-gray-100 p-2 px-4 m-1 rounded-lg">
							<div className="flex flex-col">
								<span>{expense.name}</span>
								<span className="text-xs text-gray-500">
									{expense.subcategory?.icon}
									{expense.subcategory?.name} - {expense.note}
								</span>
							</div>
							<span>{formatCurrency(expense.amount, isMobile, false)}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
