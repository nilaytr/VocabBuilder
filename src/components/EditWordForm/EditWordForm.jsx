import { useDispatch } from "react-redux";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { editWord } from "../../redux/word/operations";
import Modal from "../Modal/Modal";
import css from "./EditWordForm.module.css";

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
            <div className={css.editWordModal}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={css.inputCountryEdit}>
                        <label htmlFor="ua" className={css.labelCountryEdit}>Ukrainian
                            <img src="/icons/ukraine.svg" alt="ua" className={css.flagEdit} />
                        </label>
                        <input
                            type="text"
                            id="ua"
                            defaultValue={word.ua}
                            {...register("ua")}
                            className={css.inputEditForm}
                        />
                        {errors.ua && (<p className={css.errorEdit}>{errors.ua.message}</p>)}
                    </div>
                    <div className={css.inputCountryEdit}>
                        <label htmlFor="en" className={css.labelCountryEdit}>English
                            <img src="/icons/united-kingdom.svg" alt="uk" className={css.flagEdit} />
                        </label>
                        <input
                            type="text"
                            id="en"
                            defaultValue={word.en}
                            {...register("en")}
                            className={css.inputEditForm}
                        />
                        {errors.en && (<p className={css.errorEdit}>{errors.en.message}</p>)}
                    </div>
                    <div className={css.editWordBtns}>
                        <button type="submit" className={css.editBtn}>Save</button>
                        <button type="button" onClick={onClose} className={css.cancelEditBtn}>Cancel</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default EditWordForm;
