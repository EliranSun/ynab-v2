import './App.css';
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {BudgetContextProvider, ExpensesContextProvider, UserProvider} from "./context";
import {Login} from "./components/pages/Login";
import {Root} from "./components/templates/Root";
import {Header} from "./components/molecules/Header/Header";
import {LocaleProvider} from "./context/LocaleContext";
import {CategoriesEdit} from "./features/CategoriesEdit/CategoriesEdit";
import {ToastProvider} from "./context/ToastProvider";
import ExpensesSummary from "./features/LastExpenses/components/ExpensesSummary";
import {BalanceView, ExpenseView, ParseExpensesList, SeeingDoublePage} from "./components";
import FuturePredictionPage from "./components/pages/FuturePredictionPage/FuturePredictionPage";
import {ManageBudget} from "./features/ManageBudget/ManageBudget";
import {CategoriesProvider} from "./context/CategoriesContext";
import {Routes} from "./constants/route";
import {TooltipProvider} from "./context/TooltipContext";
import React from "react";

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
            // {
            //     path: Routes.CATEGORIES_EDIT,
            //     element: <CategoriesEdit/>,
            // },
            {
                path: Routes.IMPORT,
                element: <ParseExpensesList/>,
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
                element: <CategoriesEdit/>,
            },
            {
                path: Routes.PROJECTION,
                element: <FuturePredictionPage/>,
            },
            {
                path: Routes.RESOLVER,
                element: <SeeingDoublePage/>,
            },
            {
                path: Routes.BUDGET,
                element: <ManageBudget/>,
            },
            {
                path: Routes.ROOT,
                element: <Navigate to="/home" replace/>,
            }
        ]
    },
]);

export default App;
