import {isDesktop} from "../../../utils/device";
import {Button} from "../../atoms";
import {List} from "@phosphor-icons/react";
import {BUTTON_SIZE} from "../../../constants";

export const HamburgerMenu = ({onClick}) => {
    if (isDesktop()) {
        return null;
    }

    return (
        <div className="flex items-center">
            <Button
                onClick={onClick}
                type={Button.Types.GHOST}>
                <List size={BUTTON_SIZE} color="black"/>
            </Button>
        </div>
    );
};
