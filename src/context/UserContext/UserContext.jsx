import {createContext} from 'react';
import useAuthState from "../../hooks/useAuth";

export const UserContext = createContext(null);

export const UserProvider = ({children}) => {
    const {user, isLoggedIn} = useAuthState();

    return (
        <UserContext.Provider value={{user, isLoggedIn}}>
            {children}
        </UserContext.Provider>
    );
};
