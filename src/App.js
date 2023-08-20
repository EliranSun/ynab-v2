import './App.css';
import { createBrowserRouter, Link, Outlet, RouterProvider } from "react-router-dom";
import { BudgetView, ExpenseView, ParseExpensesList, SeeingDoublePage } from "./components";
import { ExpensesContextProvider } from "./context";
import FuturePredictionPage from "./components/FuturePredictionPage/FuturePredictionPage";
import { Login } from "./components/Login";

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
        <Link to="/seeing-double">
          SEEING DOUBLE
        </Link>
      </div>
  )
};

const Root = ({ children, ...rest }) => {
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
        element: <BudgetView/>,
      },
      {
        path: "projection",
        element: <FuturePredictionPage/>,
      },
      {
        path: "seeing-double",
        element: <SeeingDoublePage/>,
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
