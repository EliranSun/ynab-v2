import {noop} from "lodash";
import {
    ChartLineUp,
    ArrowSquareIn,
    Coffee,
    MagicWand,
    PatreonLogo,
    Receipt,
    Scales,
    SquaresFour,
    House,
} from "@phosphor-icons/react";
import {Link} from "react-router-dom";
import {BUTTON_SIZE} from "../../constants";

export const isDesktop = window.innerWidth >= 768;
export const ButtonLink = ({name, onClick = noop}) => {
    const Icon = {
        home: House,
        import: ArrowSquareIn,
        balance: Scales,
        expenses: Receipt,
        categories: SquaresFour,
        projection: ChartLineUp,
        resolver: MagicWand,
        coffee: Coffee,
        patreon: PatreonLogo
    }[name];

    let link = `/${name}`;
    if (name === "coffee") {
        link = "https://www.buymeacoffee.com/omriharel";
    }

    if (name === "patreon") {
        link = "https://www.patreon.com/omriharel";
    }

    return (
        <Link to={link} onClick={onClick}>
            <li className="flex items-center gap-2 h-12 md:flex-col">
                <Icon size={isDesktop ? BUTTON_SIZE * 2 : BUTTON_SIZE}/>
                <span className="text-xs">{name.toUpperCase()}</span>
            </li>
        </Link>
    )
};