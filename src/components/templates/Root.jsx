import {Outlet} from "react-router-dom";

export const Root = ({children, ...rest}) => {
    return (
        <div className="text-sm">
            <div className="w-full max-w-[3800px] md:mx-auto md:my-2">
                <Outlet {...rest} />
            </div>
        </div>
    )
};