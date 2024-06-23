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

function App() {
    return (
        <LocaleProvider>
            <UserProvider>
                <BudgetContextProvider>
                    <ExpensesContextProvider>
                        <RouterProvider router={router}/>
                        <div className="opacity-50">
                            <img
                                src={Picture}
                                className="fixed bottom-[50vh] left-32 w-3/12 h-auto z-0"
                                alt="bg-frame"/>
                            <img
                                src={Couch}
                                className="fixed bottom-20 left-20 w-2/3 h-auto z-0"
                                alt="bg-couch"/>
                        </div>
                    </ExpensesContextProvider>
                </BudgetContextProvider>
            </UserProvider>
        </LocaleProvider>
    );
}

const router = createBrowserRouter([
    {
        path: "/",
        element: (

            <UserProvider>
                <Header/>
                <Login>
                    <Root/>
                </Login>
            </UserProvider>
        ),
        children: [
            {
                path: ":page",
                element: <PageRouter/>,
            },
            {
                path: "/",
                element: <Navigate to="/home" replace/>,
            }
        ]
    },
]);

export default App;
