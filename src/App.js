import './App.css';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import { PasteExpensesList } from "./components";
import { ExpensesContextProvider } from "./context";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PasteExpensesList/>,
  },
  {
    path: "/parse",
    element: <PasteExpensesList/>,
  },
]);


function App() {
  return (
      <ExpensesContextProvider>
        <RouterProvider router={router} />
      </ExpensesContextProvider>
  );
}

export default App;
