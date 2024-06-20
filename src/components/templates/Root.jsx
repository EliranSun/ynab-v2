import {Header} from "../molecules/Header/Header";
import {Outlet} from "react-router-dom";

export const Root = ({children, ...rest}) => {
    return (
        <div className="m-auto">
            <Outlet {...rest} />
        </div>
    )
};