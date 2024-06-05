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
import {BUTTON_SIZE} from "../../constants";
import {useState, useMemo} from "react";

export const isDesktop = window.innerWidth >= 768;
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
        const iconByName = Icons[name];
        console.log({iconByName});
        return iconByName;
    }, [name]);

    return (
        <Link to={href} onClick={onClick}>
            <li
                className="relative flex items-center gap-2 w-16 md:flex-col"
                onMouseEnter={() => setIsTooltipOpen(true)}
                onMouseLeave={() => setIsTooltipOpen(false)}>
                <Icon size={BUTTON_SIZE}/>
                {isTooltipOpen ?
                    <div className="absolute -bottom-10 bg-white text-sm">
                        {label}
                    </div> : null}
            </li>
        </Link>
    )
};