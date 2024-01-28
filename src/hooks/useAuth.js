import {useEffect, useState} from 'react';
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../utils/auth";


const useAuthState = () => {
    const [user, setUser] = useState({
        displayName: "Guest",
    });

    useEffect(() => {
        return onAuthStateChanged(auth, (nextUser) => {
            if (!nextUser)
                return;
            
            setUser(nextUser);
        });
    }, []);

    return [user, setUser];
};

export default useAuthState;