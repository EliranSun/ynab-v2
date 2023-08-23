import './App.css';
import { createBrowserRouter, Link, Outlet, RouterProvider } from "react-router-dom";
import { BalanceView, CategoryView, ExpenseView, ParseExpensesList, SeeingDoublePage } from "./components";
import { BudgetContextProvider, ExpensesContextProvider } from "./context";
import FuturePredictionPage from "./components/pages/FuturePredictionPage/FuturePredictionPage";
import { Login } from "./components/pages/Login";

const Header = () => {
  return (
    <div className="flex gap-8 p-4 border-b border-gray-200">
      <Link to="/parse">
        PARSE
      </Link>
      <Link to="/balance">
        BALANCE
      </Link>
      <Link to="/expenses">
        EXPENSES
      </Link>
      <Link to="/categories">
        CATEGORIES
      </Link>
      <Link to="/projection">
        PROJECTION
      </Link>
      <Link to="/resolver">
        RESOLVER
      </Link>
    </div>
  )
};

const Root = ({ children, ...rest }) => {
  return (
    <>
      <Header/>
      <div className="max-w-6xl m-8 md:mx-auto md:my-8">
        <Outlet/>
      </div>
    </>
  )
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Login>
        <Root/>
      </Login>
    ),
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
        element: <BalanceView/>,
      },
      {
        path: "projection",
        element: <FuturePredictionPage/>,
      },
      {
        path: "resolver",
        element: <SeeingDoublePage/>,
      },
      {
        path: "categories",
        element: <CategoryView/>,
      }
    ]
  },
]);


function App() {
  return (
    <BudgetContextProvider>
      <ExpensesContextProvider>
        <RouterProvider router={router}/>
      </ExpensesContextProvider>
    </BudgetContextProvider>
  );
}

export default App;
