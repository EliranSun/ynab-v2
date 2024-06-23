import {noop} from "lodash";
import {
    ArrowSquareIn,
    ChartLineUp,
    Coffee,
    House,
    MagicWand,
    Receipt,
    Scales,
    SquaresFour,
} from "@phosphor-icons/react";
import {Link} from "react-router-dom";
import {BUTTON_SIZE} from "../../constants";
import {useMemo} from "react";
import {isDesktop} from "../../utils/device";
import classNames from "classnames";

const Icons = {
    home: House,
    import: ArrowSquareIn,
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
    const Icon = useMemo(() => {
        return Icons[name];
    }, [name]);

    return (
        <Link to={href} onClick={onClick} className={classNames({
            "pointer-events-none": isDisabled,
        })}>
            <li className="flex items-center gap-2 h-12 md:flex-col">
                <Icon size={isDesktop ? BUTTON_SIZE * 2 : BUTTON_SIZE}/>
                <span className="text-xs">{label.toUpperCase()}</span>
            </li>
        </Link>
    )
};