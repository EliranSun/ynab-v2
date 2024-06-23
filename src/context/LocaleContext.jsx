import {createContext, useCallback, useState, useEffect} from "react";
import {I18nProvider} from "@lingui/react";
import {i18n} from "@lingui/core";

async function dynamicActivate(locale) {
    try {
        const {messages} = await import(`../locales/${locale}/messages.js`);
        i18n.load(locale, messages);
        i18n.activate(locale);
        console.info(`Locale ${locale} loaded successfully`);
    } catch (error) {
        console.error(`Error loading locale ${locale}:`, error);
    }
}

export const LocaleContext = createContext({
    locale: 'he',
    changeLocale: () => {
    },
});

export const LocaleProvider = ({children}) => {
    const [locale, setLocale] = useState('');

    const changeLocale = useCallback((locale) => {
        console.info('changing locale to', locale);
        dynamicActivate(locale)
            .then(() => {
                setLocale(locale);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        changeLocale('he');
    }, []);

    if (!locale) {
        console.info("locale not set");
        return null;
    }

    return (
        <LocaleContext.Provider value={{
            locale,
            changeLocale,
        }}>
            <I18nProvider i18n={i18n}>
                <div dir={locale === 'he' ? 'rtl' : 'ltr'}>
                    {children}
                </div>
            </I18nProvider>
        </LocaleContext.Provider>
    );
}