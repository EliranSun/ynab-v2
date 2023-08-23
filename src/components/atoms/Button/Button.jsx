import classNames from "classnames";

const Button = ({ children, className, onClick, isDisabled, type = Types.PRIMARY }) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={classNames("w-fit flex items-center gap-2", className, {
        "opacity-50 cursor-not-allowed": isDisabled,
        "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded": type === Types.PRIMARY,
        "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded": type === Types.DANGER,
        "bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded": type === Types.SECONDARY,
        "bg-white/30 hover:bg-gray-500 text-gray-700 hover:text-white py-2 px-4 hover:border-transparent rounded": type === Types.GHOST,
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
};

Button.Types = Types;

export default Button;