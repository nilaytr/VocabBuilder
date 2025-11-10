import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { createWord } from "../../redux/word/operations";
import { selectCategories } from "../../redux/word/selectors";
import Modal from "../Modal/Modal";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import toast, { Toaster } from 'react-hot-toast';
import css from "./AddWordForm.module.css";

const AddWordForm = () => {
    const validationSchema = Yup.object().shape({
        en: Yup.string()
            .required("English word is required.")
            .when(["category", "isIrregular"], {
                is: (category, isIrregular) => category === "verb" && isIrregular === "true",
                then: (schema) =>
                    schema.matches(/^[A-Za-z'-]+(?:-[A-Za-z'-]+){2}$/, "English verb must be in the form of 'verb-verb-verb'."),
                otherwise: (schema) =>
                    schema.matches(/^[A-Za-z'-]+(?:\s+[A-Za-z'-]+)*$/, "Invalid English format."),
            }),
        ua: Yup.string()
            .required("Ukrainian word is required.")
            .matches(/^(?![A-Za-z])[А-ЯІЄЇҐґа-яієїʼ\s]+$/u, "Invalid Ukrainian format."),
        category: Yup.string().required("Category is required."),
        isIrregular: Yup.string().when("category", {
            is: (value) => value === "verb",
            then: (schema) => schema.required("Irregular status is required for verbs."),
            otherwise: (schema) => schema.notRequired(),
        }),
    });

    const dispatch = useDispatch();
    const categories = useSelector(selectCategories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({ mode: "onChange", resolver: yupResolver(validationSchema) });

    const isIrregular = watch("isIrregular");

    const handleClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCategory(null);
    };

    const onSubmit = (data) => {
        const newWord = {
            en: data.en,
            ua: data.ua,
            category: data.category,
        };
        if (data.category === "verb") {
            newWord.isIrregular = data.isIrregular === "true";
        }

        dispatch(createWord(newWord))
            .unwrap()
            .then(() => {
                toast.success("Word added successfully!");
                handleCloseModal();
            })
            .catch((error) => {
                toast.error(error.message || "Failed to add word.");
            });
    };

    return (
        <>
            <button type="button" onClick={handleClick} className={css.addWordBtn}>Add word
                <img src="/icons/plus.svg" alt="plus" className={css.plusIcon} />
            </button>
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <div className={css.addWordModal}>
                        <h2 className={css.addWordTitle}>Add word</h2>
                        <p className={css.addWordDescr}>Adding a new word to the dictionary is an important step in enriching the language base and expanding the vocabulary.</p>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className={css.selectCategory}>
                                <DropdownMenu
                                    defaultOption="Select a category"
                                    onSelect={(option) => {
                                        setSelectedCategory(option);
                                        setValue("category", option);
                                    }}
                                    options={categories.filter((cat) => cat !== "all")}
                                />
                                {errors.category && (<p className={css.errorCategory}>{errors.category.message}</p>)}
                            </div>
                            <div className={css.buttonType + (selectedCategory === "verb" ? " " + css.visible : "")}>
                                <label className={css.radioContainer}>Regular
                                    <input
                                        type="radio"
                                        value="false"
                                        {...register("isIrregular")}
                                    />
                                <span className={css.checkmarkAdd}></span>   
                                </label>
                                <label className={css.radioContainer}>Irregular
                                    <input
                                        type="radio"
                                        value="true"
                                        {...register("isIrregular")}
                                    />
                                <span className={css.checkmarkAdd}></span>  
                                </label>
                                {errors.isIrregular && (<p className={css.errorRadio}>{errors.isIrregular.message}</p>)}
                            </div>
                            <div className={css.radioIrregular + (isIrregular === "true" ? " " + css.visible : "")}>
                                <p>English verb must be in the form of 'verb-verb-verb'.</p>
                            </div>
                            <div className={css.inputCountry}>
                                <label htmlFor="ua" className={css.labelCountry}>Ukrainian
                                    <img src="/icons/ukraine.svg" alt="ua" className={css.flag} />
                                </label>
                                <input
                                    type="text"
                                    id="ua"
                                    {...register("ua")}
                                    className={css.inputForm}
                                />
                                {errors.ua && (<p className={css.errorInput}>{errors.ua.message}</p>)}
                            </div>
                            <div className={css.inputCountry}>
                                <label htmlFor="en" className={css.labelCountry}>English
                                    <img src="/icons/united-kingdom.svg" alt="uk" className={css.flag} />
                                </label>
                                <input
                                    type="text"
                                    id="en"
                                    {...register("en")}
                                    className={css.inputForm}
                                />
                                {errors.en && (<p className={css.errorInput}>{errors.en.message}</p>)}
                            </div>
                            <div className={css.addWordBtns}>
                                <button type="submit" className={css.addBtn}>Add</button>
                                <button type="button" onClick={handleCloseModal} className={css.cancelBtn}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default AddWordForm;