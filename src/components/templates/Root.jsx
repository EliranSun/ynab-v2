import { Header } from "../molecules/Header/Header";
import { Outlet } from "react-router-dom";

export const Root = ({ children, ...rest }) => {
  return (
    <div className="">
      <Header/>
      <div className="max-w-7xl md:mx-auto md:my-2">
        <Outlet {...rest} />
      </div>
    </div>
  )
};