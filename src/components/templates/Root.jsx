import { Header } from "../molecules/Header/Header";
import { Outlet } from "react-router-dom";

export const Root = ({ children, ...rest }) => {
  return (
    <div className="fixed top-0 w-screen h-screen">
      <Header/>
      <div className="max-w-6xl md:mx-auto md:my-0 md:max-w-full">
        <Outlet {...rest} />
      </div>
    </div>
  )
};