import './App.css';
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {BudgetContextProvider, ExpensesContextProvider, UserProvider} from "./context";
import {Login} from "./components/pages/Login";
import {Root} from "./components/templates/Root";
import {Header} from "./components/molecules/Header/Header";
import {LocaleProvider} from "./context/LocaleContext";
import {CategoriesView} from "./features/CategoriesEdit/CategoriesView";
import {ToastProvider} from "./context/ToastProvider";
import ExpensesSummary from "./features/LastExpenses/components/ExpensesSummary";
import {BalanceView, ExpenseView, ParseExpensesList, SeeingDoublePage} from "./components";
import ProjectionView from "./components/pages/FuturePredictionPage/ProjectionView";
import {BudgetView} from "./features/ManageBudget/BudgetView";
import {CategoriesProvider} from "./context/CategoriesContext";
import {Routes} from "./constants/route";
import {TooltipProvider} from "./context/TooltipContext";
import React from "react";
import {ImportFromFile} from "./components/pages/ParseExpensesList/ImportFromFile";

function App() {
    return (
        <LocaleProvider>
            <ToastProvider>
                <TooltipProvider>
                    <RouterProvider router={router}/>
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
                            <Header/>
                            <Login>
                                <Root/>
                            </Login>
                        </CategoriesProvider>
                    </ExpensesContextProvider>
                </BudgetContextProvider>
            </UserProvider>
        ),
        children: [
            {
                path: Routes.HOME,
                element: <ExpensesSummary/>,
            },
            {
                path: Routes.ADD,
                element: <ParseExpensesList/>,
            },
            {
                path: Routes.IMPORT,
                element: <ImportFromFile/>,
            },
            {
                path: Routes.BALANCE,
                element: <BalanceView/>,
            },
            {
                path: Routes.EXPENSES,
                element: <ExpenseView/>,
            },
            {
                path: Routes.CATEGORIES,
                element: <CategoriesView/>,
            },
            {
                path: Routes.PROJECTION,
                element: <ProjectionView/>,
            },
            {
                path: Routes.RESOLVER,
                element: <SeeingDoublePage/>,
            },
            {
                path: Routes.BUDGET,
                element: <BudgetView/>,
            },
            {
                path: Routes.ROOT,
                element: <Navigate to="/home" replace/>,
            }
        ]
    },
]);

export default App;
