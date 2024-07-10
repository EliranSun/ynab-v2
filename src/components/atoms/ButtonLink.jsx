import {noop} from "lodash";
import {
    ArrowSquareIn,
    ChartLineUp,
    Coffee,
    House,
    MagicWand, PiggyBank,
    Receipt,
    Scales,
    SquaresFour,
} from "@phosphor-icons/react";
import {Link} from "react-router-dom";
import {BUTTON_SIZE} from "../../constants";
import {useMemo} from "react";
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
        <Link to={href} onClick={onClick} className={classNames({
            "p-1": true,
            "pointer-events-none": isDisabled,
            "bg-black text-white": isSelected,
        })}>
            <li className="flex items-center gap-2 h-12 md:flex-col">
                <Icon size={isDesktop() ? BUTTON_SIZE * 2 : BUTTON_SIZE}/>
                <span className="md:text-xs">{label.toUpperCase()}</span>
            </li>
        </Link>
    )
};