import { useSelector } from "react-redux";
import Navigaton from "../Navigation/Navigation";
import LogoutUser from "../LogoutUser/LogoutUser";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import { NavLink } from "react-router-dom";
import css from "./Header.module.css";

const Header = () => {
    const isLoggedIn = useSelector(selectIsLoggedIn);

    return (
        <header>
            <div>
                <NavLink to="/dictionary">
                    <img src="/icons/logo.svg" className={css.logoText} alt="logo" />
                </NavLink>
                {isLoggedIn && (
                    <>
                        <div>
                            <Navigaton />
                        </div>
                        <div className={css.navUserWrap}>
                            <LogoutUser />
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;