import noop from "lodash/noop";
import { useMemo } from "react";
import classNames from "classnames";
import { Pages } from "../../constants";

const MainMenu = ({ onMenuItemClick = noop, currentPage = '' }) => {
    const MenuItems = useMemo(() => [
        {
            name: Pages.PASTE_AND_SELECT_TRANSACTIONS,
            onClick: () => onMenuItemClick(Pages.PASTE_AND_SELECT_TRANSACTIONS),
        },
        {
            name: Pages.BUDGET_VIEW,
            onClick: () => onMenuItemClick(Pages.BUDGET_VIEW),
        },
        {
            name: Pages.EXPENSE_VIEW,
            onClick: () => onMenuItemClick(Pages.EXPENSE_VIEW),
        },
        {
            name: Pages.CATEGORY_VIEW,
            onClick: () => onMenuItemClick(Pages.CATEGORY_VIEW),
        },
        {
            name: Pages.FORTUNE_TELLER,
            onClick: () => onMenuItemClick(Pages.FORTUNE_TELLER),
        },
    ], []);

    return (
        <nav className="bg-gray-100 fixed top-0 w-screen">
            <ul className="flex">
                {MenuItems.map((item, index) => (
                    <li
                        key={item.name}
                        className={classNames("w-28 cursor-pointer hover:bg-gray-400 hover:text-white p-4 text-center", {
                            "bg-gray-400": currentPage === item.name,
                            "text-white": currentPage === item.name,
                            "border-r border-black": index + 1 < MenuItems.length,
                        })}
                        onClick={item.onClick}>
                        {item.name}
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default MainMenu;