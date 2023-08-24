import { useState } from "react";
import { Link } from "react-router-dom";
import { LoginButton } from "../../pages/Login/LoginButton";
import { Button } from "../../atoms";
import { ChartLineUp, ClipboardText, List, MagicWand, Receipt, Scales, SquaresFour } from "@phosphor-icons/react";

const isDesktop = window.innerWidth >= 768;
const isMobile = window.innerWidth < 768;

const ButtonLink = ({ name }) => {
  const Icon = {
    parse: ClipboardText,
    balance: Scales,
    expenses: Receipt,
    categories: SquaresFour,
    projection: ChartLineUp,
    resolver: MagicWand,
  }[name];
  
  return (
    <Link to={`/${name}`}>
      <li className="flex items-center gap-2 h-12">
        <Icon/> {name.toUpperCase()}
      </li>
    </Link>
  )
};

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(isDesktop);
  
  return (
    <div className="text-xs md:text-base flex justify-between items-center md:gap-8 md:p-4 border-b border-gray-200">
      {isMobile &&
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type={Button.Types.GHOST}>
          <List/>
        </Button>}
      <LoginButton/>
      {isMenuOpen &&
        <ul className="absolute left-0 top-7 flex flex-col h-full p-4 border-r shadow w-1/3">
          <ButtonLink name="parse"/>
          <ButtonLink name="balance"/>
          <ButtonLink name="expenses"/>
          <ButtonLink name="categories"/>
          <ButtonLink name="projection"/>
          <ButtonLink name="resolver"/>
        </ul>}
    </div>
  )
};