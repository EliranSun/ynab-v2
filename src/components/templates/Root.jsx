import {Outlet} from "react-router-dom";
import Couch from "../../assets/couch.png";
import classNames from "classnames";

export const Root = ({children, ...rest}) => {
    const isNsfw = localStorage.getItem('nsfw') === 'true';

    return (
        <div className={classNames({
            "m-auto bg-white/70": true,
            "grayscale": isNsfw
        })}>
            <div id="modal-root"/>
            <Outlet {...rest} isNsfw={isNsfw}/>
            <div className={classNames({
                "fixed -z-10 top-0 left-0 w-screen h-[90vh]": true,
                "hidden": isNsfw
            })}>
                <img
                    src={Couch}
                    className="absolute bottom-10 left-10 w-2/3 md:w-1/4"
                    alt="bg-couch"/>
            </div>
        </div>
    )
};