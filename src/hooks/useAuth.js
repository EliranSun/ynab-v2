import {useEffect, useState} from 'react';
import {onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {auth} from "../utils";


const useAuthState = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        displayName: "Guest",
    });

    useEffect(() => {
        return onAuthStateChanged(auth, (nextUser) => {
            if (!nextUser)
                return;

            setUser(nextUser);
            navigate("/home");
        });
    }, []);

    return [user, setUser];
};

export default useAuthState;