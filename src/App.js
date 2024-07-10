import './App.css';
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {BudgetContextProvider, ExpensesContextProvider, UserProvider} from "./context";
import {Login} from "./components/pages/Login";
import {Root} from "./components/templates/Root";
import {PageRouter} from "./components/templates/PageRouter";
import {Header} from "./components/molecules/Header/Header";
import {LocaleProvider} from "./context/LocaleContext";
import Couch from "./assets/couch.png";
import {CategoriesEdit} from "./features/CategoriesEdit/CategoriesEdit";
import {ToastProvider} from "./context/ToastProvider";
import {ExpensesSummary} from "./features/LastExpenses/components/ExpensesSummary";
import {BalanceView, CategoryView, ExpenseView, ParseExpensesList, SeeingDoublePage} from "./components";
import FuturePredictionPage from "./components/pages/FuturePredictionPage/FuturePredictionPage";
import {ManageBudget} from "./features/ManageBudget/ManageBudget";
import {CategoriesProvider} from "./context/CategoriesContext";

function App() {
    return (
        <LocaleProvider>
            <BudgetContextProvider>
                <ExpensesContextProvider>
                    <ToastProvider>
                        <RouterProvider router={router}/>
                        <div className="fixed -z-10">
                            <img
                                src={Couch}
                                className="fixed bottom-20 left-20 w-2/3 md:w-1/4 h-auto"
                                alt="bg-couch"/>
                        </div>
                    </ToastProvider>
                </ExpensesContextProvider>
            </BudgetContextProvider>
        </LocaleProvider>
    );
}

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <UserProvider>
                <CategoriesProvider>
                    <Header/>
                    <Login>
                        <Root/>
                    </Login>
                </CategoriesProvider>
            </UserProvider>
        ),
        children: [
            {
                path: "/home",
                element: <ExpensesSummary/>,
            },
            {
                path: "/categories-edit",
                element: <CategoriesEdit/>,
            },
            {
                path: "/import",
                element: <ParseExpensesList/>,
            },
            {
                path: "/balance",
                element: <BalanceView/>,
            },
            {
                path: "/expenses",
                element: <ExpenseView/>,
            },
            {
                path: "/categories",
                element: <CategoryView/>,
            },
            {
                path: "/projection",
                element: <FuturePredictionPage/>,
            },
            {
                path: "/resolver",
                element: <SeeingDoublePage/>,
            },
            {
                path: "/budget",
                element: <ManageBudget/>,
            },
            {
                path: "/",
                element: <Navigate to="/home" replace/>,
            }
        ]
    },
]);

export default App;
