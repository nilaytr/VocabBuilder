import { useDispatch } from "react-redux";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { editWord } from "../../redux/word/operations";
import Modal from "../Modal/Modal";
// import css from "./EditWordForm.module.css";

const EditWordForm = ({ word, onClose }) => {
    const validationSchema = Yup.object().shape({
        en: Yup.string()
            .required("English word is required.")
            .matches(/\b[A-Za-z'-]+(?:\s+[A-Za-z'-]+)*\b/, "Invalid English format."),
        ua: Yup.string()
            .required("Ukrainian word is required.")
            .matches(/^(?![A-Za-z])[А-ЯІЄЇҐґа-яієїʼ\s]+$/u, "Invalid Ukrainian format."),
    });

    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: "onChange", resolver: yupResolver(validationSchema) });
    
    const onSubmit = async (data) => {
        const editedWord = {
            ...data,
            category: word.category,
        };
        if (word.isIrregular !== undefined) {
            editedWord.isIrregular = word.isIrregular;
        }
        try {
            await dispatch(editWord({ wordsId: word._id, data: editedWord }));
            onClose();
        } catch (error) {
            console.error("Word edit failed:", error);
        } 
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="ua">Ukrainian
                            <img src="/icons/ukraine.svg" alt="ua" />
                        </label>
                        <input
                            type="text"
                            id="ua"
                            defaultValue={word.ua}
                            {...register("ua")}
                        />
                        {errors.ua && (<p>{errors.ua.message}</p>)}
                    </div>
                    <div>
                        <label htmlFor="en">English
                            <img src="/icons/united-kingdom.svg" alt="uk" />
                        </label>
                        <input
                            type="text"
                            id="en"
                            defaultValue={word.en}
                            {...register("en")}
                        />
                        {errors.en && (<p>{errors.en.message}</p>)}
                    </div>
                    <div>
                        <button type="submit">Save</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default EditWordForm;
