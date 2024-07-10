import './App.css';
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {BudgetContextProvider, ExpensesContextProvider, UserProvider} from "./context";
import {Login} from "./components/pages/Login";
import {Root} from "./components/templates/Root";
import {PageRouter} from "./components/templates/PageRouter";
import {Header} from "./components/molecules/Header/Header";
import {LocaleProvider} from "./context/LocaleContext";
import Couch from "./assets/couch.png";
// import Picture from "./assets/picture.png";
import {useEffect} from "react";

// import {createCategory, getCategories, signIn} from "./utils/db";

function App() {
    useEffect(() => {
        // signIn();
        // getCategories();
    }, []);

    return (
        <LocaleProvider>
            <BudgetContextProvider>
                <ExpensesContextProvider>
                    <button
                        onClick={() => createCategory({
                            name: "test",
                            icon: "😚",
                        })}
                        className="bg-blue-500 p-4 m-4">CREATE
                    </button>
                    <RouterProvider router={router}/>
                    <div className="fixed -z-10">
                        {/*<img*/}
                        {/*    src={Picture}*/}
                        {/*    className="fixed -z-10 bottom-[50vh] left-32 w-3/12 md:w-1/12 h-auto"*/}
                        {/*    alt="bg-frame"/>*/}
                        <img
                            src={Couch}
                            className="fixed bottom-20 left-20 w-2/3 md:w-1/4 h-auto"
                            alt="bg-couch"/>
                    </div>
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
