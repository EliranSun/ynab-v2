import { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/auth";


const useAuthState = () => {
  const [user, setUser] = useState(false);
  
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);
  
  return [user, setUser];
};

export default useAuthState;