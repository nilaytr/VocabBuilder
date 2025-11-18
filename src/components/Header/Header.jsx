import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import { NavLink } from "react-router-dom";
import Navigaton from "../Navigation/Navigation";
import LogoutUser from "../LogoutUser/LogoutUser";
import HamburgerMenu from "../HamburgerMenu/HamburgerMenu";
import css from "./Header.module.css";

const Header = () => {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1440);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1440);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <header className={css.headerContainer}>
            <div className={css.header}>
                <NavLink to="/dictionary" className={css.logoContainer}>
                    <img src="/icons/logo.svg" className={css.logoIcon} alt="logo" />
                </NavLink>
                {isLoggedIn && (
                    <>
                        <div className={`${css.navigation} ${isMobile ? css.hidden : ""}`}>
                            <Navigaton />
                        </div>
                        <div className={`${css.navUserWrap} ${isMobile ? css.hidden : ""}`}>
                            <LogoutUser />
                        </div>
                        {isLoggedIn && (
                            <div className={`${css.navUserContainer} ${!isMobile ? css.hidden : ""}`}>
                                <HamburgerMenu />
                            </div>
                        )}
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;