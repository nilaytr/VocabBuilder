import Filters from "../Filters/Filters";
import AddWordForm from "../AddWordForm/AddWordForm";
import Statistics from "../Statistics/Statistics";
import { Link } from "react-router-dom";
import css from "./Dashboard.module.css";

const Dashboard = ({ onFilterChange, pageType }) => {
    return (
        <div className={css.dashboardContainer}>
            <Filters onFilterChange={onFilterChange} />
            <div className={css.statisticsContainer}>
                <Statistics />
                <div className={css.trainContainer}>
                    {pageType === "dictionary" && <AddWordForm />}
                    <Link to="/training" className={css.trainLink}>Train oneself
                        <img src="/icons/arrow.svg" alt="arrow" className={css.arrowIcon} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
