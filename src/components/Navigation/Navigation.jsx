import { NavLink } from "react-router-dom";
import css from "./Navigation.module.css";

const Navigation = () => {
    return (
        <div>
            <nav className={css.navContainer}>
                <NavLink to="/dictionary"
                    className={({ isActive }) => isActive ? `${css.navLink} ${css.active}` : css.navLink}>Dictionary
                </NavLink>
                <NavLink to="/recommend"
                    className={({ isActive }) => isActive ? `${css.navLink} ${css.active}` : css.navLink}>Recommend
                </NavLink>
                <NavLink to="/training"
                    className={({ isActive }) => isActive ? `${css.navLink} ${css.active}` : css.navLink}>Training
                </NavLink>
            </nav>
        </div>
    );
};

export default Navigation;