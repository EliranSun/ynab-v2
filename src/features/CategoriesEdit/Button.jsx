import classNames from "classnames";

const Variation = {
    DELETE: "delete",
    SAVE: "save",
    ADD: "add",
    HIDE: "hide",
};

const Button = ({children, isDisabled, className, onClick, variation, ...rest}) => {
    return (
        <button
            {...rest}
            disabled={isDisabled}
            onClick={() => {
                if (isDisabled) {
                    return;
                }

                onClick();
            }}
            className={classNames(className, {
                "min-w-16 max-w-96 max-h-10": true,
                "cursor-pointer p-2": true,
                "rounded-md shadow": true,
                "flex items-center justify-center gap-2": true,
                "cursor-not-allowed opacity-20": isDisabled,
                "hover:bg-black hover:text-white": !isDisabled,
                "text-red-500 bg-white": variation === Variation.DELETE,
                "text-green-500 bg-white": variation === Variation.SAVE,
                "text-black bg-white": variation === Variation.HIDE,
                "text-white bg-blue-500": variation === Variation.ADD,
            })}>
            {children}
        </button>
    );
};

Button.Variation = Variation;

export {Button};