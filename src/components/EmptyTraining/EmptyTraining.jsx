import { useNavigate } from "react-router-dom";
import css from "./EmptyTraining.module.css";

const EmptyTraining = () => {
    const navigate = useNavigate();

    return (
        <div className={css.emptyTraining}>
            <div className={css.reportImg}>
                <img src="/assets/reportBig.png" alt="report" />
            </div>
            <div className={css.reportContent}>
                <h3 className={css.reportTitle}>You don't have a single word to learn right now.</h3>
                <p className={css.reportText}>Please create or add a word to start the workout. We want to improve your vocabulary and develop your knowledge, so please share the words you are interested in adding to your study.</p>
                <div className={css.reportBtns}>
                    <button type="button" onClick={() => navigate("/dictionary")} className={css.linkAddBtn}>Add word</button>
                    <button type="button" onClick={() => navigate("/dictionary")} className={css.trainCancelBtn}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EmptyTraining;