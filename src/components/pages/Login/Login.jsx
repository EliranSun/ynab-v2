import { login } from "../../../utils/auth";
import { Button, Title } from "../../atoms";
import { Spinner } from "@phosphor-icons/react";
import { useContext } from "react";
import { UserContext } from "../../../context";

const Login = ({ children }) => {
  const [user, setUser] = useContext(UserContext);

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
    <div className="fixed top-0 flex w-screen h-screen flex-col items-center justify-center gap-8 text-center px-8">
      <Title>YOU NEED BALANCE</Title>
      <Button
        onClick={async () => {
          const user = await login();
          setUser(user);
        }}>
        Login
      </Button>
      <p>
        to start controlling your finance situation.<br/>
        We all know you need it.
      </p>
    </div>
  );
};

export default Login;
