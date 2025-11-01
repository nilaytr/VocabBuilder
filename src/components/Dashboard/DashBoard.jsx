import Filters from "../Filters/Filters";
import AddWordForm from "../AddWordForm/AddWordForm";
import Statistics from "../Statistics/Statistics";
import { Link } from "react-router-dom";
import css from "./Dashboard.module.css";

const Dashboard = ({ onFilterChange, pageType }) => {
    return (
        <div>
            <Filters onFilterChange={onFilterChange} />
            <div>
                <Statistics />
                <div>
                    {pageType === "dictionary" && <AddWordForm />}
                    <Link to="/training" className={css.trainLink}>Train oneself
                        <img src="/icons/arrow.svg" alt="arrow" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;