import './App.css';
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {BudgetContextProvider, ExpensesContextProvider, UserProvider} from "./context";
import {Login} from "./components/pages/Login";
import {i18n} from "@lingui/core";
import {I18nProvider} from "@lingui/react";
// import {messages as enMessages} from "./locales/en/messages";
// import {messages as heMessages} from "./locales/he/messages";
import {Root} from "./components/templates/Root";
import {PageRouter} from "./components/templates/PageRouter";
import {Header} from "./components/molecules/Header/Header";
import {useEffect, useState, useCallback} from "react";

// i18n.load({
//     he: heMessages,
//     en: enMessages,
// });
//
// i18n.activate("he");

export async function dynamicActivate(locale) {
    try {
        const {messages} = await import(`./locales/${locale}/messages.js`);
        i18n.load(locale, messages);
        i18n.activate(locale);
        console.info(`Locale ${locale} loaded successfully`);
    } catch (error) {
        console.error(`Error loading locale ${locale}:`, error);
    }
}

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
    const [locale, setLocale] = useState('he');
    const [isLocaleActivated, setIsLocaleActivated] = useState(false);

    const changeLocale = useCallback((locale) => {
        dynamicActivate(locale)
            .then(() => {
                setIsLocaleActivated(true);
                setLocale(locale);
            })
            .catch(() => setIsLocaleActivated(false));
    }, []);

    useEffect(() => {
        changeLocale('he');
    }, []);

    if (!isLocaleActivated) {
        return null;
    }

    return (
        <I18nProvider i18n={i18n}>
            <UserProvider>
                <BudgetContextProvider>
                    <ExpensesContextProvider>
                        <button onClick={() => changeLocale('he')}>HE</button>
                        <button onClick={() => changeLocale('en')}>EN</button>
                        <div dir={locale === 'he' ? 'rtl' : 'ltr'}>
                            <RouterProvider router={router}/>
                        </div>
                    </ExpensesContextProvider>
                </BudgetContextProvider>
            </UserProvider>
        </I18nProvider>
    );
}

export default App;
