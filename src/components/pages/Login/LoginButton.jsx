import { login, logout } from "../../../utils/auth";
import { Button } from "../../atoms";
import useAuthState from "../../../hooks/useAuth";
import { SignIn, SignOut } from "@phosphor-icons/react";
import { BUTTON_SIZE } from "../../../constants";

export const LoginButton = () => {
  const [user, setUser] = useAuthState();
  const isDesktop = window.innerWidth > 768;
  
  if (user) {
    return (
      <Button type={Button.Types.GHOST} onClick={() => {
        logout();
        setUser(null);
      }}>
        <SignOut size={BUTTON_SIZE}/>
        {isDesktop && "Logout"}
      </Button>
    )
  }
  
  return (
    <Button onClick={async () => {
      const user = await login();
      setUser(user);
    }}>
      
      <SignIn size={BUTTON_SIZE}/>
      {isDesktop && "Login"}
    </Button>
  )
}