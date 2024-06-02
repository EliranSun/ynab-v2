import {useEffect, useState} from 'react';
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../utils/auth";
import {setUserDoc} from "../utils";


const useAuthState = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(auth, async (user) => {
            setUser(user);

            try {
                if (user) {
                    await setUserDoc(user);
                }
            } catch (e) {
                console.error(e);
            }

            setLoading(false);
        });
    }, []);

    return {user, loading};
};

export default useAuthState;