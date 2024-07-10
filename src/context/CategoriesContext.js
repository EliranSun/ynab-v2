import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {getCategories} from "../utils/db";
import {orderBy} from "lodash";
import {UserContext} from "./UserContext";
import {Trans} from "@lingui/macro";
import {Button} from "../components";
import classNames from "classnames";

export const CategoriesContext = createContext({
    categories: [],
    setCategories: () => {
    },
});

export const CategoriesProvider = ({children}) => {
    const {user} = useContext(UserContext);
    const [categories, setCategories] = useState([]);
    const [isWalkthroughView, setIsWalkthroughView] = useState(false);
    const fetch = useCallback(() => {
    }, [user]);

    useEffect(() => {
        if (!user || !user.uid) {
            return;
        }


        getCategories(user.uid).then(results => {
            if (!results || !results.length) {
                setIsWalkthroughView(true);
                return;
            }

            setCategories(orderBy(results, ['id'], ['asc']))
        });
    }, [user]);

    console.log({user});

    if (isWalkthroughView) {
        return (
            <div
                className={classNames({
                    "max-w-screen-lg m-auto fixed inset-0 m-auto": true,
                    "flex flex-col justify-center items-center rounded-3xl": true,
                    "text-xl p-4 shadow-lg text-right": true,
                })}>
                <p className="mb-16">
                    <Trans>Hey</Trans>, {user.displayName}<br/>
                    <Trans>Just wanted to say, welcome!</Trans><br/><br/>
                    <Trans>In order to use the app, you have got to set up categories.</Trans>.<br/>
                    <Trans>Categories are your way to make order, out of the chaos.</Trans>.<br/>
                    <Trans>Let us take you there</Trans>.<br/>
                </p>
                <Button>
                    <Trans>OK</Trans>
                </Button>
            </div>
        );
    }

    return (
        <CategoriesContext.Provider value={[categories]}>
            {children}
        </CategoriesContext.Provider>
    );
}