import {Scales} from "./index";
import {AuthButton} from "../pages/Login/AuthButton";
import classNames from "classnames";
import {isMobile} from "../../utils/device";
import {Trans} from "@lingui/macro";

const Position = {
    TOP_LEFT: "top-left",
    TOP_RIGHT: "top-right",
    BOTTOM_LEFT: "bottom-left",
    BOTTOM_RIGHT: "bottom-right",
};

const LoginWelcomeMessage = ({position}) => {
    return (
        <div className={classNames({
            "flex flex-col items-center md:items-start justify-center gap-8": true,
            "md:w-1/2 text-center md:text-left px-8": true,
            "md:absolute": true,
            "top-20 left-10": position === Position.TOP_LEFT,
            "top-20 right-10": position === Position.TOP_RIGHT,
            "bottom-20 left-10": position === Position.BOTTOM_LEFT,
            "bottom-20 right-10": position === Position.BOTTOM_RIGHT,
        })}>
            <h1 className="flex flex-col items-center md:items-start rtl:text-right">
                <Scales size={isMobile() ? 50 : 200}/>
                <p className="font-extrabold font-mono text-5xl md:text-8xl">
                    <Trans>You Need Balance</Trans>
                </p>
            </h1>
            <p className="text-xl md:text-3xl">
                <Trans>Control your financial situation</Trans>,
                <br/>
                <Trans>Control your future</Trans>
            </p>
            <AuthButton withLabel/>
        </div>
    );
};

LoginWelcomeMessage.Position = Position;

export {LoginWelcomeMessage};