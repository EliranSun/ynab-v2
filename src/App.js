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

i18n.load({
    en: enMessages,
    he: heMessages,
});
i18n.activate("en");


function App() {
    return (
        <I18nProvider i18n={i18n}>
            <BudgetContextProvider>
                <ExpensesContextProvider>
                    <RouterProvider router={router}/>
                </ExpensesContextProvider>
            </BudgetContextProvider>
        </I18nProvider>
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
            }
        ]
    },
]);

export default App;
