import {useEffect, useState} from 'react';
import {onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {auth} from "../utils";
import {setUserDoc} from "../utils";
import translate from "translate";


const useAuthState = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        return onAuthStateChanged(auth, async (user) => {
            const translatedUsername = await translate(user?.displayName?.split(" ")[0], "he");
            setUser({...user, displayName: translatedUsername});
            
            try {
                if (user) {
                    await setUserDoc(user);
                    navigate("/home");
                }
            } catch (e) {
                setIsLoggedIn(false);
                console.error(e);
            } finally {
                setIsLoggedIn(!!user);
                setLoading(false);
            }
        });
    }, []);

    return {user, isLoggedIn, loading};
};

export default useAuthState;