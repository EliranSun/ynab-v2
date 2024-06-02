import {createContext} from 'react';
import useAuthState from "../../hooks/useAuth";

export const UserContext = createContext(null);

export const UserProvider = ({children}) => {
    const {user, loading} = useAuthState();

    return (
        <UserContext.Provider value={[user]}>
            {children}
        </UserContext.Provider>
    );
};
