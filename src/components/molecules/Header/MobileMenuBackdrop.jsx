import {isDesktop} from "../../../utils/device";

export const MobileMenuBackdrop = ({isOpen}) => {
    if (isDesktop() || !isOpen) {
        return null;
    }

    return <div className="bg-black/30 backdrop-blur-sm top-0 left-0 z-20 fixed w-screen h-screen"/>;
};