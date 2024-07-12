import {createContext, useState, useEffect} from "react";
import classNames from "classnames";

export const TooltipContext = createContext(null);

const Tooltip = ({children}) => {
    return (
        <div
            className={classNames({
                "ltr:left-20 rtl:right-20": true,
                "fixed bottom-20 bg-black text-white p-4 rounded shadow-xl flex items-center justify-center": true,
                "transition-all ease-in-out duration-500": true,
                "w-10 h-10": !children,
                "w-96 h-24": children,
            })}>
            {children || "☀"}
        </div>
    );
};


export const TooltipProvider = ({children}) => {
    const [tooltipMessage, setTooltipMessage] = useState(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setTooltipMessage(null);
        }, 8000);

        return () => clearTimeout(timeout);
    }, [tooltipMessage]);

    return (
        <TooltipContext.Provider value={[setTooltipMessage]}>
            {children}
            <Tooltip>
                {tooltipMessage}
            </Tooltip>
        </TooltipContext.Provider>
    );
}