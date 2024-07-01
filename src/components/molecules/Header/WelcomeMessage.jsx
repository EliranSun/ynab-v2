import {useLingui} from "@lingui/react";
import {useMemo} from "react";
import {Message} from "../../../constants";
import {Trans} from "@lingui/macro";

export const WelcomeMessage = ({userName}) => {
    const {_} = useLingui();
    const welcomeMessage = useMemo(() => {
        let message;
        const hour = new Date().getHours();
        if (hour < 12) {
            message = Message.morning;
        } else if (hour < 18) {
            message = Message.afternoon;
        } else {
            message = Message.evening;
        }

        return _(message);
    }, [_]);

    if (userName) {
        return (
            <p className="text-sm">
                <Trans>Hey</Trans>, {userName}, {welcomeMessage}
            </p>
        )
    }

    return (
        <p className="text-sm">
            <Trans>Hey</Trans>, {welcomeMessage}
        </p>
    )
};