import './App.css';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import { BalanceView, CategoryView, ExpenseView, ParseExpensesList, SeeingDoublePage } from "./components";
import { BudgetContextProvider, ExpensesContextProvider, UserProvider } from "./context";
import FuturePredictionPage from "./components/pages/FuturePredictionPage/FuturePredictionPage";
import { Login } from "./components/pages/Login";
import { Header } from "./components/molecules/Header/Header";

const Root = ({ children, ...rest }) => {
  return (
    <div className="fixed top-0 w-screen h-screen">
      <Header/>
      <div className="max-w-6xl md:mx-auto md:my-8">
        <Outlet/>
      </div>
    </div>
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
        element: <Navigate to="/parse" replace/>,
      }
    ]
  },
]);


function App() {
  return (
    <UserProvider>
      <BudgetContextProvider>
        <ExpensesContextProvider>
          <RouterProvider router={router}/>
        </ExpensesContextProvider>
      </BudgetContextProvider>
    </UserProvider>
  );
}

export default App;
