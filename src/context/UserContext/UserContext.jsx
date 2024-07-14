import {createContext, useState, useEffect} from 'react';
import {get, noop} from 'lodash';
import {login, supabase} from "../../utils/db";
import {SignIn, SignOut} from "@phosphor-icons/react";
import {Trans} from "@lingui/macro";
import {BUTTON_SIZE} from "../../constants";
import translate from "translate";

export const UserContext = createContext({
    user: {},
    AuthButton: noop,
});

export const UserProvider = ({children}) => {
    const [user, setUser] = useState({});

    useEffect(() => {
        supabase.auth.getUser().then(async (response) => {
            if (response.error || !response.data) {
                alert('Error fetching user data');
                return;
            }

            const user = response.data.user;
            const userFirstName = get(user, 'user_metadata.name', '').split(" ")[0];
            const translatedUsername = await translate(userFirstName, "he");
            
            setUser({
                ...user,
                translatedUsername,
                userFirstName,
            });
        });
    }, []);

    return (
        <UserContext.Provider value={{
            user,
            AuthButton: () => {
                if (user.email) {
                    return (
                        <button
                            className="flex flex-col items-center"
                            onClick={async () => {
                                await supabase.auth.signOut();
                            }}>
                            <SignOut size={BUTTON_SIZE}/>
                            <Trans>Logout</Trans>
                        </button>
                    )
                }

                return (
                    <button onClick={login}>
                        <SignIn/>
                        <Trans>Login</Trans>
                    </button>
                )
            }
        }}>
            {children}
        </UserContext.Provider>
    );
};
