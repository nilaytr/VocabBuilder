import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getStatistics } from "../../redux/word/operations";
import { selectStatistics } from "../../redux/word/selectors";
import css from "./Statistics.module.css";

const Statistics = () => {
    const dispatch = useDispatch();
    const statistics = useSelector(selectStatistics);

    useEffect(() => {
        dispatch(getStatistics());
    }, [dispatch]);

    return (
        <div className={css.statistics}>
            <p className={css.study}>To study:</p>
            <span className={css.studyCount}>{statistics?.totalCount}</span>
        </div>
    );
};

export default Statistics;