import './App.css';
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {BudgetContextProvider, ExpensesContextProvider, UserProvider} from "./context";
import {Login} from "./components/pages/Login";
import {Root} from "./components/templates/Root";
import {PageRouter} from "./components/templates/PageRouter";
import {Header} from "./components/molecules/Header/Header";
import {LocaleProvider} from "./context/LocaleContext";
import Couch from "./assets/couch.png";
import Picture from "./assets/picture.png";

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
                        <div className="opacity-50">
                            <img src={Picture} className="fixed bottom-[50vh] left-32 w-3/12 h-auto z-0"
                                 alt="Picture"/>
                            <img src={Couch} className="fixed bottom-20 left-20 w-2/3 h-auto z-0" alt="Couch"/>
                        </div>
                        <RouterProvider router={router}/>
                    </ExpensesContextProvider>
                </BudgetContextProvider>
            </UserProvider>
        </LocaleProvider>
    );
}

export default App;
