import {createContext, useState, useEffect} from 'react';
// import useAuthState from "../../hooks/useAuth";
import {login, supabase} from "../../utils/db";

export const UserContext = createContext(null);

export const UserProvider = ({children}) => {
    // const {user, isLoggedIn} = useAuthState();
    const [user, setUser] = useState({});

    useEffect(() => {
        supabase.auth.getUser().then((data) => {
            console.log({data});
            setUser(data);
        });
    }, []);

    return (
        <UserContext.Provider value={{user}}>
            {/*<button onClick={async () => {*/}
            {/*    const {userData} = await login();*/}
            {/*    console.log({userData});*/}
            {/*    setUser(userData.user);*/}
            {/*}}>*/}
            {/*    LOGIN*/}
            {/*</button>*/}
            {children}
        </UserContext.Provider>
    );
};
