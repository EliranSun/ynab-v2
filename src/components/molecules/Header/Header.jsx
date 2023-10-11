import { useContext, useMemo, useState } from "react";
import { LoginButton } from "../../pages/Login/LoginButton";
import { Button } from "../../atoms";
import { List } from "@phosphor-icons/react";
import { UserContext } from "../../../context";
import { BUTTON_SIZE } from "../../../constants";
import { ButtonLink, isDesktop } from "../../atoms/ButtonLink";

const isMobile = window.innerWidth < 768;

const Messages = [
  () => <span>Spend less than <b>120₪</b> today on food</span>,
  () => <span>Don't forget to <b>pay your bills</b> this week</span>,
  () => <span>Try to <b>save 10%</b> of your income this month</span>,
]

export const Header = () => {
  const [user] = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
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
  const RandomMessage = Messages[Math.floor(Math.random() * Messages.length)];

  return (
    <>
      <div className="sticky top-0 bg-white z-20 text-xs md:text-base flex justify-between items-center md:gap-8 md:p-4 md:h-16 shadow-xl">
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
        {(isDesktop || isMenuOpen) &&
          <ul className="absolute md:sticky left-0 top-0 z-10 flex flex-col md:flex-row h-screen md:h-fit p-4 border-r w-2/3 md:border-none md:text-sm md:gap-4 md:justify-end">
            <ButtonLink onClick={closeMenu} name="parse"/>
            <ButtonLink onClick={closeMenu} name="balance"/>
            <ButtonLink onClick={closeMenu} name="expenses"/>
            <ButtonLink onClick={closeMenu} name="categories"/>
            <ButtonLink onClick={closeMenu} name="projection"/>
            <ButtonLink onClick={closeMenu} name="resolver"/>
            {isMobile && <hr/>}
            <ButtonLink onClick={closeMenu} name="coffee"/>
            <ButtonLink onClick={closeMenu} name="patreon"/>
          </ul>}
      </div>
      {isMenuOpen && isMobile && <div className="backdrop-brightness-50 fixed w-screen h-screen"/>}
    </>
  )
};