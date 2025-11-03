import { ScaleLoader } from "react-spinners";
import css from "./Loader.module.css";

export const Loader = () => {
    return (
        <div className={css.loaderWrapper}>
            <ScaleLoader size={40} color="#85AA9F" />
        </div>
    );
};