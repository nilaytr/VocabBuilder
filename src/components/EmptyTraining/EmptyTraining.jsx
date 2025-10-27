import { useNavigate } from "react-router-dom";
//import css from "./EmptyTraining.module.css";

const EmptyTraining = () => {
    const navigate = useNavigate();

    return (
        <div>
            <div>
                <img src="/assets/reportBig.png" alt="report" />
            </div>
            <div>
                <h3>You don't have a single word to learn right now.</h3>
                <p>Please create or add a word to start the workout. We want to improve your vocabulary and develop your knowledge, so please share the words you are interested in adding to your study.</p>
                <div>
                    <button type="button" onClick={() => navigate("/dictionary")}>Add word</button>
                    <button type="button" onClick={() => navigate("/dictionary")}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EmptyTraining;