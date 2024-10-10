import { useRef, useState } from "react";
import { useLingui } from "@lingui/react";
import classNames from "classnames";
import { MenuPages } from "../../../constants";
import { ButtonLink } from "../../atoms/ButtonLink";
import { useClickAway } from "react-use";

export const Menu = ({ isOpen, onMenuItemClick }) => {
    const { _ } = useLingui();
    const pathnames = window.location.pathname.split("/");
    const [selectedPage, setSelectedPage] = useState(pathnames[pathnames.length - 1]);
    const ref = useRef(null);


    useClickAway(ref, () => {
        if (isOpen) {
            onMenuItemClick();
        }
    });

    console.log({ pathnames });

    return (
        <ul ref={ref} className={classNames({
            "h-full md:text-sm bg-gray-100": true,
            "flex flex-col items-center md:flex-row gap-6 md:gap-4 justify-evenly": false,
            "flex justify-evenly": true,
            "border-r md:border-none shadow-xl md:shadow-none md:static": true,
        })}>
            {Object.values(MenuPages).map((item) => (
                <ButtonLink
                    isSelected={selectedPage === item.name}
                    key={item.name}
                    icon={item.icon}
                    href={item.name}
                    name={item.name}
                    label={_(item.label)}
                    onClick={() => {
                        onMenuItemClick();
                        setSelectedPage(item.name);
                    }} />
            ))}
        </ul>
    );
};