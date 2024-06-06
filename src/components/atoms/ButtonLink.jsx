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


export const ButtonLink = ({name, label, onClick = noop, href}) => {
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const Icon = useMemo(() => {
        return Icons[name];
    }, [name]);

    return (
        <Link to={href} onClick={onClick}>
            <li
                className="relative md:static flex flex-row items-center gap-4 md:gap-2 w-full md:w-16 md:flex-col"
                onMouseEnter={() => setIsTooltipOpen(true)}
                onMouseLeave={() => setIsTooltipOpen(false)}>
                <Icon size={isMobile() ? MOBILE_BUTTON_SIZE : BUTTON_SIZE}/>
                {isMobile() || isTooltipOpen ?
                    <div className="md:absolute -bottom-10 bg-white text-sm">
                        {label}
                    </div> : null}
            </li>
        </Link>
    )
};