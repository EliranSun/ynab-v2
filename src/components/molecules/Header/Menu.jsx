import {useContext, useRef, useState} from "react";
import {UserContext} from "../../../context";
import {useLingui} from "@lingui/react";
import classNames from "classnames";
import {isMobile} from "../../../utils/device";
import {MenuPages} from "../../../constants";
import {ButtonLink} from "../../atoms/ButtonLink";
import {AuthButton} from "../../pages/Login/AuthButton";
import {useClickAway} from "react-use";
import {useParams} from "react-router-dom";

export const Menu = ({isOpen, onMenuItemClick}) => {
    const {page} = useParams();
    const [selectedPage, setSelectedPage] = useState(page);
    const ref = useRef(null);
    const {isLoggedIn} = useContext(UserContext);
    const {_} = useLingui();

    useClickAway(ref, () => {
        if (isOpen) {
            onMenuItemClick();
        }
    });

    return (
        <ul ref={ref} className={classNames({
            "hidden": isMobile() && !isOpen,
            "w-2/3 h-screen md:h-fit p-8 md:p-4 md:text-sm": true,
            "flex flex-col md:flex-row gap-6 md:gap-4 justify-between md:justify-end": true,
            "border-r md:border-none shadow-xl md:shadow-none md:static": true,
            "fixed z-30 top-0 rtl:left-0 ltr:right-0 bg-white": true,
        })}>
            <div className="flex flex-col md:flex-row gap-6 md:gap-4">
                {Object.values(MenuPages).map(({name, label}) => (
                    <ButtonLink
                        isSelected={selectedPage === name}
                        key={name}
                        isDisabled={!isLoggedIn}
                        href={name}
                        name={name}
                        label={_(label)}
                        onClick={() => {
                            onMenuItemClick();
                            setSelectedPage(name);
                        }}/>
                ))}
            </div>
            <AuthButton withLabel/>
        </ul>
    );
};