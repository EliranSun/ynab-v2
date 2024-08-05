import {noop} from "lodash";
import {Link} from "react-router-dom";
import {BUTTON_SIZE} from "../../constants";
import {isDesktop} from "../../utils/device";
import classNames from "classnames";


// let link = `/${name}`;
// if (name === "coffee") {
//     link = "https://www.buymeacoffee.com/omriharel";
// }
//
// if (name === "patreon") {
//     link = "https://www.patreon.com/omriharel";
// }


export const ButtonLink = ({icon: Icon, label, onClick = noop, href, isDisabled, isSelected}) => {
    return (
        <li className={classNames({
            "p-2 flex items-center justify-center gap-2 h-full": true,
            "pointer-events-none": isDisabled,
            "bg-amber-500 text-black": isSelected,
            // "border-2 border-amber-400 text-black": !isSelected,
        })}>
            <Link to={href} onClick={onClick} className="flex gap-2">
                <Icon size={isDesktop() ? BUTTON_SIZE / 2 : BUTTON_SIZE}/>
                <span className="md:text-xs">{label.toUpperCase()}</span>
            </Link>
        </li>
    )
};