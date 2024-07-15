import './App.css';
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {BudgetContextProvider, ExpensesContextProvider, UserProvider} from "./context";
import {Login} from "./components/pages/Login";
import {Root} from "./components/templates/Root";
import {Header} from "./components/molecules/Header/Header";
import {LocaleProvider} from "./context/LocaleContext";
import Couch from "./assets/couch.png";
import {CategoriesEdit} from "./features/CategoriesEdit/CategoriesEdit";
import {ToastProvider} from "./context/ToastProvider";
import ExpensesSummary from "./features/LastExpenses/components/ExpensesSummary";
import {BalanceView, CategoryView, ExpenseView, ParseExpensesList, SeeingDoublePage} from "./components";
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
                    <div id="modal-root"/>
                    <RouterProvider router={router}/>
                    <div className="fixed -z-10">
                        <img
                            src={Couch}
                            className="fixed bottom-20 left-20 w-2/3 md:w-1/4 h-auto"
                            alt="bg-couch"/>
                    </div>
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
