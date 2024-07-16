import {Outlet, useSearchParams} from "react-router-dom";
import Couch from "../../assets/couch.png";
import classNames from "classnames";

export const Root = ({children, ...rest}) => {
    const [searchParams] = useSearchParams();
    const isNsfw = searchParams.get("nsfw");

    return (
        <div className={classNames({
            "m-auto bg-white/70": true,
            "grayscale": isNsfw
        })}>
            <Outlet {...rest} />
            <div id="modal-root"/>
            <div className="fixed -z-10">
                <img
                    src={Couch}
                    className="fixed bottom-20 left-20 w-2/3 md:w-1/4 h-auto"
                    alt="bg-couch"/>
            </div>
        </div>
    )
};