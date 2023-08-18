import './App.css';
import { createBrowserRouter, Link, Outlet, RouterProvider } from "react-router-dom";
import { BudgetView, ExpenseView, ParseExpensesList } from "./components";
import { ExpensesContextProvider } from "./context";
import FuturePredictionPage from "./components/FuturePredictionPage/FuturePredictionPage";

const Header = () => {
    return (
        <div className="flex gap-8 p-4">
            <Link to="/parse">
                PARSE
            </Link>
            <Link to="/expenses">
                EXPENSES
            </Link>
            <Link to="/balance">
                BALANCE
            </Link>
            <Link to="/projection">
                PROJECTION
            </Link>
        </div>
    )
};

const Root = ({ children, ...rest }) => {
    console.log(rest);
    return (
        <>
            <Header/>
            <Outlet/>
        </>
    )
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        children: [
            {
                path: "parse",
                element: <ParseExpensesList/>,
            },
            {
                path: "expenses",
                element: <ExpenseView/>,
            },
            {
                path: "balance",
                element: <BudgetView/>,
            },
            {
                path: "projection",
                element: <FuturePredictionPage/>,
            }
        ]
    },
]);


function App() {
    return (
        <ExpensesContextProvider>
            <RouterProvider router={router}/>
        </ExpensesContextProvider>
    );
}

export default App;
