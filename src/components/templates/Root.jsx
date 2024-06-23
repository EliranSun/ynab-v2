import {Outlet} from "react-router-dom";

export const Root = ({children, ...rest}) => {
    return (
        <div className="m-auto bg-white/70">
            <Outlet {...rest} />
        </div>
    )
};