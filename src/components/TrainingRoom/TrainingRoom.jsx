import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectTasks } from "../../redux/word/selectors";
import { addAnswers } from "../../redux/word/operations";
import Modal from "../Modal/Modal";
import WellDoneForm from "../WellDoneForm/WellDoneForm";
import ProgressBar from "../ProgressBar/ProgressBar";
import toast from "react-hot-toast";
import css from "./TrainingRoom.module.css";

const TrainingRoom = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { tasks } = useSelector(selectTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [answers, setAnswers] = useState([]);
    const currentTask = tasks[currentTaskIndex];
    const isLastTask = currentTaskIndex === tasks.length - 1;
    const [error, setError] = useState("");

    const closeModal = () => {
        setIsModalOpen(false);
    }
    
    const validationInput = (input) => {
        const enPattern = /^[A-Za-z]+$/;
        const uaPattern = /^[А-ЯІЄЇҐа-яієїґ]+$/;

        if (currentTask.task === "en" && !enPattern.test(input)) {
            return "Please enter valid English words.";
        }
        if (currentTask.task === "ua" && !uaPattern.test(input)) {
            return "Будь ласка, введіть правильні українські слова.";
        }
        return "";
    };
    
    const handleChange = (e) => {
        const input = e.target.value;
        setCurrentAnswer(input);
        const validationError = validationInput(input);
        if (input.trim() !== "") {
            setError(validationError);
        } else {
            setError("");
        }
    };
    
    const handleNext = () => {
        if (!currentAnswer.trim() || error) return;
        const newAnswer = {
            _id: currentTask._id,
            en: currentTask.en,
            ua: currentTask.ua,
            task: currentTask.task,
            [currentTask.task]: currentAnswer,
        };
        setAnswers([...answers, newAnswer]);
        setCurrentAnswer("");
        setError("");
        if (!isLastTask) setCurrentTaskIndex(currentTaskIndex + 1);
    };
    
    const handleSave = () => {
        let newAnswers = [...answers];
        
        if (currentAnswer.trim()) {
            newAnswers.push({
                _id: currentTask._id,
                en: currentTask.en,
                ua: currentTask.ua,
                task: currentTask.task,
                [currentTask.task]: currentAnswer,
            });
        }

        if (newAnswers.length > 0 && !error) {
            setIsModalOpen(true);
            dispatch(addAnswers(newAnswers))
                .unwrap()
                .then(() => {
                    toast.success("Your answers have been saved!");
                    setCurrentTaskIndex(0);
                    setCurrentAnswer("");
                    setAnswers([]);
                    setIsModalOpen(true);
                })
                .catch((error) => {
                    toast.error(
                        error.message || "An error occurred while saving your answers."
                    );
                });
        } else {
            toast.error("No answers to save or there is an error.");
        }
    };
    
    const handleCancel = () => {
        setAnswers([]);
        setCurrentAnswer("");
        navigate("/dictionary");
    };
    
    const progress = Math.round((answers.length / tasks.length) * 100);
    
    return (
        <>
            <div className={css.progressContainer}>
                <ProgressBar
                    progress={progress}
                    pageType="training"
                    count={answers.length}
                />
            </div>
            {currentTask && (
                <div className={css.inputContainer}>
                    <div className={css.answerContainer}>
                        <input
                            className={css.inputAnswer}
                            type="text"
                            id="answer"
                            value={currentAnswer}
                            onChange={handleChange}
                            placeholder={
                                currentTask.task === "en"
                                    ? "Enter translate"
                                    : "Введіть переклад"
                            }
                        />
                        {error && <p className={css.errorTraining}>{error}</p>}
                        {!isLastTask && (
                            <button
                                disabled={!!error}
                                className={css.btnNext}
                                type="button"
                                onClick={handleNext}
                            >Next
                                <img src="/icons/arrow.svg" alt="arrow" className={css.iconArrow} />
                            </button>
                        )}
                        {currentTask.task === "en" ? (
                            <div className={css.labelWrap}>
                                <img src="/icons/united-kingdom.svg" alt="uk" className={css.trainFlag} />
                                <label className={css.labelAnswer} htmlFor="answer">English</label>
                            </div>
                        ) : (
                                <div className={css.labelWrap}>
                                    <img src="/icons/ukraine.svg" alt="ua" className={css.trainFlag} />
                                    <label className={css.labelAnswer} htmlFor="answer">Ukrainian</label>
                                </div>
                        )}
                    </div>
                    <div className={css.taskContainer}>
                        <p className={css.taskTrain}>
                            {currentTask.task === "en" ? currentTask.ua : currentTask.en}
                        </p>
                        {currentTask.task === "ua" ? (
                            <div className={css.labelWrap}>
                                <img src="/icons/united-kingdom.svg" alt="uk" className={css.trainFlag} />
                                <span className={css.spanCountry}>English</span>
                            </div>
                        ) : (
                            <div className={css.labelWrap}>
                                <img src="/icons/ukraine.svg" alt="ua" className={css.trainFlag} />
                                <span className={css.spanCountry}>Ukrainian</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className={css.trainingBtns}>
                <button className={css.btnTrainSave} type="submit" onClick={handleSave}>Save</button>
                <button className={css.btnTrainCancel} type="button" onClick={handleCancel}>Cancel</button>
            </div>
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <WellDoneForm />
                </Modal>
            )}
        </>
    );
};

export default TrainingRoom;