import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/auth/operations";
import { selectUser } from "../../redux/auth/selectors";
import css from "./LogoutUser.module.css";

const LogoutUser = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    
    const handleLogoutClick = () => {
        dispatch(logoutUser());
    };
    
    return (
        <div className={css.logoutContainer}>
            {user && (
                <div className={css.userBlock}>
                    <div className={css.avatarWrapper}>
                        <img src="/icons/Image.svg" alt="image background" className={css.imageAvatar} />
                        <img src="/icons/user.svg" alt="user avatar" className={css.userAvatar} />
                    </div>
                    <span className={css.userName}>
                        {user.name || user.displayName || "User"}
                    </span>
                    <button className={css.logoutBtn} type="button" onClick={handleLogoutClick}>Log out ⭢</button>
                </div>
            )}
        </div>
    );
};

export default LogoutUser;