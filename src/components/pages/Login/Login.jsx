import {login} from "../../../utils/auth";
import {Button, Title} from "../../atoms";
import {Spinner} from "@phosphor-icons/react";
import {useContext} from "react";
import {UserContext} from "../../../context";

const Login = ({children}) => {
    const [user] = useContext(UserContext);

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
        <div className="flex flex-col items-start justify-center gap-8 text-left px-8">
            <Title>♎ You Need a Balance!</Title>
            <Button onClick={login}>Login</Button>
            <p>Control your financial situation.<br/>Control your future.</p>
        </div>
    );
};

export default Login;
