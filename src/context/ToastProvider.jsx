import {createContext, useEffect, useState} from "react";
import classNames from "classnames";

export const ToastTypes = {
    INFO: "info",
    DANGER: "danger",
};

const Toast = ({message, onCancel}) => {
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        setIsHidden(false);
    }, [message]);

    if (!message || !message.text || !message.type || isHidden) {
        return null;
    }

    return (
        <div
            onClick={() => setIsHidden(true)}
            className={classNames({
                "w-fit h-fit m-auto": true,
                "flex flex-col gap-4": true,
                "fixed px-8 py-4 text-white rounded-full flex items-center": true,
                "text-lg shadow-lg animate-pulse cursor-pointer": true,
                "inset-0 bg-red-900": message.type === ToastTypes.DANGER,
                "bottom-5 ltr:right-5 rtl:left-5 bg-black": message.type === ToastTypes.INFO,
            })}>
            {message.text}
            {message.type === ToastTypes.DANGER ? (
                <div className="flex gap-2">
                    <button className="bg-red-500 p-4" onClick={message.onConfirm}>CONFIRM</button>
                    <button className="bg-black p-4" onClick={onCancel}>CANCEL</button>
                </div>
            ) : null}
        </div>
    );
};

export const ToastContext = createContext(null);

export const ToastProvider = ({children}) => {
    const [message, setMessage] = useState(null);
    
    return (
        <ToastContext.Provider value={{setMessage}}>
            {children}
            <Toast message={message} onCancel={() => {
                setMessage(null);
            }}/>
        </ToastContext.Provider>
    );
}