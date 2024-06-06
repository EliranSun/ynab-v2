import {noop} from "lodash";
import {
    ChartLineUp,
    ClipboardText,
    Coffee,
    House,
    MagicWand,
    PatreonLogo,
    Receipt,
    Scales,
    SquaresFour
} from "@phosphor-icons/react";
import {Link} from "react-router-dom";
import {BUTTON_SIZE, MOBILE_BUTTON_SIZE} from "../../constants";
import {useState, useMemo} from "react";
import {isMobile} from "../../utils/device";
import classNames from "classnames";

const Icons = {
    parse: ClipboardText,
    balance: Scales,
    expenses: Receipt,
    categories: SquaresFour,
    projection: ChartLineUp,
    resolver: MagicWand,
    coffee: Coffee,
    // patreon: PatreonLogo,
    // home: House,
};

// let link = `/${name}`;
// if (name === "coffee") {
//     link = "https://www.buymeacoffee.com/omriharel";
// }
//
// if (name === "patreon") {
//     link = "https://www.patreon.com/omriharel";
// }


export const ButtonLink = ({name, label, onClick = noop, href, isDisabled}) => {
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const Icon = useMemo(() => {
        return Icons[name];
    }, [name]);

    return (
        <button
            disabled={isDisabled}
            className={classNames({
                "disabled:opacity-50 disabled:cursor-not-allowed": isDisabled,
            })}>
            <Link to={href} onClick={onClick} className={classNames({
                "pointer-events-none": isDisabled,
            })}>
                <li
                    className={classNames({
                        "relative md:static flex flex-row items-center gap-4 md:gap-2 w-full md:w-16 md:flex-col": true,
                        "hover:text-black hover:bg-white": true,
                    })}
                    onMouseEnter={() => setIsTooltipOpen(true)}
                    onMouseLeave={() => setIsTooltipOpen(false)}>
                    <Icon size={isMobile() ? MOBILE_BUTTON_SIZE : BUTTON_SIZE}/>
                    <div className="text-sm">
                        {label}
                    </div>
                </li>
            </Link>
        </button>
    )
};