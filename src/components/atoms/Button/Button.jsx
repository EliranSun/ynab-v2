import classNames from "classnames";

const Button = ({
                    children,
                    className,
                    onClick,
                    isDisabled,
                    type = Types.PRIMARY,
                    size = Sizes.DEFAULT
                }) => {
    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={classNames("w-fit flex justify-center items-center gap-2 min-w-12", className, {
                "opacity-50 cursor-not-allowed": isDisabled,
                "bg-blue-500 md:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded": type === Types.PRIMARY,
                "bg-red-500 md:hover:bg-red-700 md:text-white font-bold py-2 px-4 rounded": type === Types.DANGER,
                "bg-gray-500 md:hover:bg-gray-700 md:text-white font-bold py-2 px-4 rounded": type === Types.SECONDARY,
                "bg-white/30 md:hover:bg-gray-500 md:text-gray-700 text-gray-700 hover:text-white py-2 px-4 hover:border-transparent rounded": type === Types.GHOST,
                "bg-white/30 md:hover:bg-gray-500 md:text-gray-700 text-gray-700 hover:text-white py-2 px-4 hover:border-transparent rounded border border-gray-500": type === Types.GHOST_BORDERED,
                "w-full": size === Sizes.FULL,
            })}
        >
            {children}
        </button>
    );
};

const Types = {
    PRIMARY: "primary",
    SECONDARY: "secondary",
    DANGER: "danger",
    GHOST: "ghost",
    GHOST_BORDERED: "ghost-bordered",
};

const Sizes = {
    DEFAULT: "default",
    FULL: "full",
}

Button.Types = Types;
Button.Sizes = Sizes;

export default Button;