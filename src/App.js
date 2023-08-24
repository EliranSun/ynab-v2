import './App.css';
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { BalanceView, CategoryView, ExpenseView, ParseExpensesList, SeeingDoublePage } from "./components";
import { BudgetContextProvider, ExpensesContextProvider } from "./context";
import FuturePredictionPage from "./components/pages/FuturePredictionPage/FuturePredictionPage";
import { Login } from "./components/pages/Login";
import { Header } from "./components/molecules/Header/Header";

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
      },
      {
        path: "*",
        element: <ParseExpensesList/>,
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
