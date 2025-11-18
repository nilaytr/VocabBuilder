import { useState } from "react";
import Navigation from "../Navigation/Navigation";
import LogoutUser from "../LogoutUser/LogoutUser";
import backgroundMenu from '../../assets/illustration.svg';
import css from "./HamburgerMenu.module.css";

const HamburgerMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleClick = () => {
        setIsMenuOpen(true);
    };

    return (
        <>
            <button className={css.burgerButton} type="button" onClick={handleClick}>
                <img src="/icons/Nav.svg" alt="hamburger menu" className={css.burgerIcon} />
            </button>
            <div className={css.menuModal + (isMenuOpen ? " " + css.open : "")}>
                <button className={css.btnClose} onClick={closeMenu}>
                    <img src="/icons/x.svg" alt="close menu" className={css.closeIcon} />
                </button>
                <div className={css.listWrap}>
                    <Navigation />
                    <LogoutUser />
                </div>
                <div className={css.imgThumb}>
                    <img src={backgroundMenu} alt="background menu" className={css.illustration} />
                </div>
            </div>
        </>
    );
};

export default HamburgerMenu;