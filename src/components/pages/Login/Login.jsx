import { login } from "../../../utils/auth";
import { Button, Title } from "../../atoms";
import useAuthState from "../../../hooks/useAuth";
import { Spinner } from "@phosphor-icons/react";

const Login = ({ children }) => {
  const [user, setUser] = useAuthState();
  
  if (user === false) {
    return (
      <div className="flex w-screen h-screen flex-col items-center justify-center gap-8 text-center px-8">
        <Spinner className="animate-spin"/>
      </div>
    );
  }
  
  if (user && user.uid) {
    return children;
  }
  
  return (
    <div className="flex w-screen h-screen flex-col items-center justify-center gap-8 text-center px-8">
      <Title>YOU NEED A BALANCE</Title>
      <Button onClick={async () => {
        const user = await login();
        setUser(user);
      }}>
        Login
      </Button>
      <p>
        to start controlling your finance situation.
        We all know you need it.
      </p>
    </div>
  );
};

export default Login;
