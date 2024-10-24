import "./App.css";
import {
	createBrowserRouter,
	Navigate,
	RouterProvider,
} from "react-router-dom";
import {
	BudgetContextProvider,
	ExpensesContextProvider,
	UserProvider,
} from "./context";
import { Login } from "./components/pages/Login";
import { Root } from "./components/templates/Root";
import { Header } from "./components/molecules/Header/Header";
import { LocaleProvider } from "./context/LocaleContext";
import { CategoriesView } from "./features/CategoriesEdit/CategoriesView";
import { ToastProvider } from "./context/ToastProvider";
import ExpensesSummary from "./features/LastExpenses/components/ExpensesSummary";
import {
	BalanceView,
	ExpenseView,
	ParseExpensesList,
	SeeingDoublePage,
} from "./components";
import ProjectionView from "./components/pages/FuturePredictionPage/ProjectionView";
import { BudgetView } from "./features/ManageBudget/BudgetView";
import { CategoriesProvider } from "./context/CategoriesContext";
import { Routes } from "./constants/route";
import { TooltipProvider } from "./context/TooltipContext";
import React from "react";
import { ImportFromFile } from "./components/pages/ParseExpensesList/ImportFromFile";
import { GuageBar } from "./components/atoms/GuageBar";
import { PastMonthsSummary } from "./components/pages/BalanceView/PastMonthsSummary";
import { CalendarView } from "./features/CalendarView";

function App() {
	return (
		<LocaleProvider>
			<ToastProvider>
				<TooltipProvider>
					<RouterProvider router={router} />
				</TooltipProvider>
			</ToastProvider>
		</LocaleProvider>
	);
}

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<UserProvider>
				<BudgetContextProvider>
					<ExpensesContextProvider>
						<CategoriesProvider>
							<Header />
							<Login>
								<Root />
							</Login>
						</CategoriesProvider>
					</ExpensesContextProvider>
				</BudgetContextProvider>
			</UserProvider>
		),
		children: [
			{
				path: Routes.HOME,
				element: <ExpensesSummary />,
			},
			{
				path: Routes.CALENDAR,
				element: <CalendarView />,
			},
			{
				path: Routes.ADD,
				element: <ParseExpensesList />,
			},
			{
				path: Routes.IMPORT,
				element: <ImportFromFile />,
			},
			{
				path: Routes.BALANCE,
				element: <BalanceView />,
			},
			{
				path: Routes.EXPENSES,
				element: <ExpenseView />,
			},
			{
				path: "/past-summary",
				element: <PastMonthsSummary />,
			},
			{
				path: Routes.CATEGORIES,
				element: <CategoriesView />,
			},
			{
				path: Routes.PROJECTION,
				element: <ProjectionView />,
			},
			{
				path: Routes.RESOLVER,
				element: <SeeingDoublePage />,
			},
			{
				path: Routes.BUDGET,
				element: <BudgetView />,
			},
			{
				path: "/test",
				props: { foo: 1 },
				element: (
					<div className="p-10 w-full border flex">
						<GuageBar
							amount={15}
							secondaryAmount={20}
							max={30}
							width={300}
						/>
					</div>
				),
			},
			{
				path: Routes.ROOT,
				element: (
					<Navigate
						to="/home"
						replace
					/>
				),
			},
		],
	},
]);

export default App;
