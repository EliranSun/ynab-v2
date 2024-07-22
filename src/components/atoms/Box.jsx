import classNames from "classnames";

export const Box = ({children}) => {
    const isNsfw = localStorage.getItem("nsfw") === "true";

    return (
        <div className={classNames({
            "w-full p-4 rounded-lg shadow-xl h-fit": true,
            "bg-gray-100": !isNsfw,
        })}>
            {children}
        </div>
    );
};