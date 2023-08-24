import { createContext } from 'react';
import useAuthState from "../../hooks/useAuth";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useAuthState();
  
  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};
