import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn, selectIsRefreshing } from "../redux/auth/selectors";
import Loader from "./Loader/Loader";

const RestrictedRoute = ({ children, redirectTo = "/dictionary" }) => {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const isRefreshing = useSelector(selectIsRefreshing);

    if (isRefreshing) return <Loader />;

    return isLoggedIn ? <Navigate to={redirectTo} replace /> : children;
};

export default RestrictedRoute;