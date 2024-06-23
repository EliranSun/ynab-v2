import {login, logout} from "../../../utils/auth";
import {Button} from "../../atoms";
import useAuthState from "../../../hooks/useAuth";
import {SignIn, SignOut} from "@phosphor-icons/react";
import {BUTTON_SIZE} from "../../../constants";
import {Trans} from "@lingui/macro";

export const AuthButton = ({withLabel = false}) => {
    const {isLoggedIn, loading} = useAuthState();

    if (loading) {
        return null;
    }

    return (
        <div className="flex items-center">
            {isLoggedIn ?
                <Button
                    className="flex flex-col"
                    type={Button.Types.GHOST} onClick={logout}>
                    <SignOut size={BUTTON_SIZE}/>
                    {withLabel ? <Trans>Logout</Trans> : null}
                </Button> :
                <Button onClick={login}>
                    <SignIn size={BUTTON_SIZE}/>
                    {withLabel ? <Trans>Login</Trans> : null}
                </Button>}
        </div>
    )
}