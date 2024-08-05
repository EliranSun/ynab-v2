import {Outlet} from "react-router-dom";
import Couch from "../../assets/couch.png";
import classNames from "classnames";

export const Root = ({children, ...rest}) => {
    const isNsfw = localStorage.getItem('nsfw') === 'true';

    return (
        <div className={classNames({
            "m-auto": true,
            "grayscale": isNsfw
        })}>
            <div id="modal-root"/>
            <Outlet {...rest} isNsfw={isNsfw}/>
            <div className={classNames({
                "absolute top-0 left-0 -z-10 w-screen h-screen opacity-30 pointer-events-none": true,
                "hidden": isNsfw
            })}>
                <img
                    src={Couch}
                    className="fixed bottom-10 left-10 w-2/3 md:w-1/6"
                    alt="bg-couch"/>
            </div>
        </div>
    )
};