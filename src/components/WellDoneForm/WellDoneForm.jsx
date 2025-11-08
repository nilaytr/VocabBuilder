import { useSelector } from "react-redux";
import { selectAnswer } from "../../redux/word/selectors";
import openBook from "../../assets/openBookBig.png";
import css from "./WellDoneForm.module.css";

const WellDoneForm = () => {
    const results = useSelector(selectAnswer) || [];
    const correctResults = results.filter((word) => word.isDone);
    const failResults = results.filter((word) => !word.isDone);

    return (
        <div className={css.wellDoneDiv}>
            <h3 className={css.wellDoneTitle}>Well done</h3>

            <div className={css.listsWrap}>
                <div className={css.correct}>
                    <h4 className={css.correctTitle}>Correct answers:</h4>
                    <ul>
                        {correctResults.length > 0 ? (
                            correctResults.map((res) => (
                                <li key={res._id} className={css.result}>
                                    {res.en}
                                </li>
                            ))
                        ) : (
                            <li className={css.result}>No correct answers</li>
                        )}
                    </ul>
                </div>

                <div className={css.mistake}>
                    <h4 className={css.mistakeTitle}>Mistakes:</h4>
                    <ul className={css.mistakeList}>
                        {failResults.length > 0 ? (
                            failResults.map((res) => (
                                <li key={res._id} className={css.result}>
                                    {res.en}
                                </li>
                            ))
                        ) : (
                            <li className={css.result}>No mistakes 🎉</li>
                        )}
                    </ul>

                    <div className={css.bookImg}>
                        <img src={openBook} alt="book" className={css.openBookBig} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WellDoneForm;