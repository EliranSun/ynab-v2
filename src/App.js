import './App.css';
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {BudgetContextProvider, ExpensesContextProvider, UserProvider} from "./context";
import {Login} from "./components/pages/Login";
import {Root} from "./components/templates/Root";
import {PageRouter} from "./components/templates/PageRouter";
import {Header} from "./components/molecules/Header/Header";
import {LocaleProvider} from "./context/LocaleContext";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <>
                <Header/>
                <Login>
                    <Root/>
                </Login>
            </>
        ),
        children: [
            {
                path: ":page",
                element: <PageRouter/>,
            },
            {
                path: "/",
                element: <Navigate to="/parse" replace/>,
            }
        ]
    },
]);

function App() {
    return (
        <LocaleProvider>
            <UserProvider>
                <BudgetContextProvider>
                    <ExpensesContextProvider>
                        <RouterProvider router={router}/>
                    </ExpensesContextProvider>
                </BudgetContextProvider>
            </UserProvider>
        </LocaleProvider>
    );
}

export default App;
