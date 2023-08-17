import classNames from "classnames";

const Button = ({ children, className, onClick, isDisabled, type = Types.Primary }) => {
  return (
      <button
          onClick={onClick}
          disabled={isDisabled}
          className={classNames("w-fit", className, {
            "opacity-50 cursor-not-allowed": isDisabled,
            "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded": type === Types.Primary,
            "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded": type === Types.Danger,
            "bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded": type === Types.Secondary,
          })}
      >
        {children}
      </button>
  );
};

const Types = {
  Primary: "primary",
  Secondary: "secondary",
  Danger: "danger",
};

Button.Types = Types;

export default Button;