import {Scales} from "./index";
import {AuthButton} from "../pages/Login/AuthButton";
import classNames from "classnames";

const Position = {
    TOP_LEFT: "top-left",
    TOP_RIGHT: "top-right",
    BOTTOM_LEFT: "bottom-left",
    BOTTOM_RIGHT: "bottom-right",
};

const LoginWelcomeMessage = ({position}) => {
    return (
        <div className={classNames({
            "flex flex-col items-start justify-center gap-8 text-left px-8 w-[500px]": true,
            "absolute": true,
            "top-20 left-10": position === Position.TOP_LEFT,
            "top-20 right-10": position === Position.TOP_RIGHT,
            "bottom-20 left-10": position === Position.BOTTOM_LEFT,
            "bottom-20 right-10": position === Position.BOTTOM_RIGHT,
        })}>
            <h1 className="flex flex-col">
                <Scales size={200}/>
                <span className="font-mono text-8xl">
                            You Need Balance
                        </span>
            </h1>
            <p className="text-3xl">
                Control your financial situation.<br/>
                Control your future.
            </p>
            <AuthButton/>
        </div>
    );
};

LoginWelcomeMessage.Position = Position;

export {LoginWelcomeMessage};