import './App.css';
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {BudgetContextProvider, ExpensesContextProvider, UserProvider} from "./context";
import {Login} from "./components/pages/Login";
import {i18n} from "@lingui/core";
import {I18nProvider} from "@lingui/react";
import {messages as enMessages} from "./locales/en/messages";
import {messages as heMessages} from "./locales/he/messages";
import {Root} from "./components/templates/Root";
import {PageRouter} from "./components/templates/PageRouter";
import {Header} from "./components/molecules/Header/Header";
import {createExpensesByDateCollection} from "./utils";

i18n.load({
    en: enMessages,
    he: heMessages,
});
i18n.activate("en");

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
                path: "*",
                element: <Navigate to="/parse" replace/>,
            }
        ]
    },
]);

function App() {
    return (
        <I18nProvider i18n={i18n}>
            <UserProvider>
                <BudgetContextProvider>
                    <ExpensesContextProvider>
                        <RouterProvider router={router}/>
                        <button onClick={async () => {
                            try {
                                await createExpensesByDateCollection();
                                alert("Success");
                            } catch (e) {
                                console.error(e);
                                alert("Error");
                            }
                        }}>
                            TEST
                        </button>
                    </ExpensesContextProvider>
                </BudgetContextProvider>
            </UserProvider>
        </I18nProvider>
    );
}

export default App;
