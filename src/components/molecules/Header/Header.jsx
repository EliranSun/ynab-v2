import { useContext, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { LoginButton } from "../../pages/Login/LoginButton";
import { Button } from "../../atoms";
import { ChartLineUp, ClipboardText, List, MagicWand, Receipt, Scales, SquaresFour, Coffee, PatreonLogo } from "@phosphor-icons/react";
import { UserContext } from "../../../context";
import { noop } from "lodash";
import { BUTTON_SIZE } from "../../../constants";

const isDesktop = window.innerWidth >= 768;
const isMobile = window.innerWidth < 768;

const ButtonLink = ({ name, onClick = noop }) => {
  const Icon = {
    parse: ClipboardText,
    balance: Scales,
    expenses: Receipt,
    categories: SquaresFour,
    projection: ChartLineUp,
    resolver: MagicWand,
    coffee: Coffee,
    patreon: PatreonLogo
  }[name];
  
  let link = `/${name}`;
  if (name === "coffee") {
    link = "https://www.buymeacoffee.com/omriharel";
  }
  
  if (name === "patreon") {
    link = "https://www.patreon.com/omriharel";
  }
  
  return (
    <Link to={link} onClick={onClick}>
      <li className="flex items-center gap-2 h-12">
        <Icon size={BUTTON_SIZE}/> {name.toUpperCase()}
      </li>
    </Link>
  )
};

const messages = [
  () => <span>Spend less than <b>120₪</b> today on food</span>,
  () => <span>Don't forget to <b>pay your bills</b> this week</span>,
  () => <span>Try to <b>save 10%</b> of your income this month</span>,
]

export const Header = () => {
  const [user] = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(isDesktop);
  const message = useMemo(() => {
    let m = `Hey ${user.displayName.split(" ")[0]}, `;
    const hour = new Date().getHours();
    if (hour < 12) {
      m += "Good morning!";
    } else if (hour < 18) {
      m += "Good afternoon!";
    } else {
      m += "Good evening!";
    }
    
    return m;
  }, [user]);
  
  const closeMenu = () => setIsMenuOpen(false);
  const RandomMessage = messages[Math.floor(Math.random() * messages.length)];
  
  return (
    <>
      <div className="relative z-20 text-xs md:text-base flex justify-between items-center md:gap-8 md:p-4 border-b border-gray-200">
        {isMobile &&
          <div className="flex items-center">
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type={Button.Types.GHOST}>
              <List size={BUTTON_SIZE} color="black"/>
            </Button>
            <span>
              {message}<br/>
              <span className="text-blue-400">
                <RandomMessage/>
              </span>
            </span>
          </div>}
        <LoginButton/>
        {isMenuOpen &&
          <ul className="absolute left-0 top-12 z-10 flex flex-col h-screen p-4 border-r shadow w-2/3 bg-white ">
            <ButtonLink onClick={closeMenu} name="parse"/>
            <ButtonLink onClick={closeMenu} name="balance"/>
            <ButtonLink onClick={closeMenu} name="expenses"/>
            <ButtonLink onClick={closeMenu} name="categories"/>
            <ButtonLink onClick={closeMenu} name="projection"/>
            <ButtonLink onClick={closeMenu} name="resolver"/>
            <hr/>
            <ButtonLink onClick={closeMenu} name="coffee"/>
            <ButtonLink onClick={closeMenu} name="patreon"/>
          </ul>}
      </div>
      {isMenuOpen && <div className="backdrop-brightness-50 fixed w-screen h-screen"/>}
    </>
  )
};