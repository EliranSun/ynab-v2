import { login, logout } from "../../utils/auth";
import { Button, Title } from "../atoms";
import useAuthState from "../../hooks/useAuth";

const Login = ({ children }) => {
    const [user, setUser] = useAuthState();
    
    if (user && user.uid) {
        return children;
    }
    
    return (
        <div>
            <Title>Login</Title>
            <Button
                onClick={async () => {
                    const user = await login();
                    setUser(user);
                }}
            >
                Login
            </Button>
            <Button
                onClick={() => {
                    logout();
                    setUser(null);
                }}
            >
                Logout
            </Button>
        </div>
    );
};

export default Login;
