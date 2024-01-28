import {login, logout} from "../../../utils/auth";
import {Button} from "../../atoms";
import useAuthState from "../../../hooks/useAuth";
import {SignIn, SignOut, ArrowClockwise} from "@phosphor-icons/react";
import {BUTTON_SIZE} from "../../../constants";

export const LoginButton = () => {
    const [user, setUser] = useAuthState();
    const isDesktop = window.innerWidth > 768;

    return (
        <div className="flex items-center">
            <ArrowClockwise size={BUTTON_SIZE} onClick={() => window.location.reload()}/>
            {user ?
                <Button type={Button.Types.GHOST} onClick={() => {
                    logout();
                    setUser(null);
                }}>
                    <SignOut size={BUTTON_SIZE}/>
                    {isDesktop && "Logout"}
                </Button> :
                <Button onClick={async () => {
                    const user = await login();
                    setUser(user);
                }}>

                    <SignIn size={BUTTON_SIZE}/>
                    {isDesktop && "Login"}
                </Button>}
        </div>
    )
}