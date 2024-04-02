import {Header} from "../molecules/Header/Header";
import {Outlet} from "react-router-dom";

export const Root = ({children, ...rest}) => {
    return (
        <div className="">
            <div className="max-w-[3500px] md:mx-auto md:my-2">
                <Outlet {...rest} />
            </div>
        </div>
    )
};