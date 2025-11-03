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
                then: (schema) => schema
                    .matches(/^\b[A-Za-z'-]+-[A-Za-z'-]+-[A-Za-z'-]+\b$/, "English verb must be in the form of 'verb-verb-verb'.")
                    .required("English word is required for irregular verbs."),
                otherwise: (schema) => schema
                    .matches(/\b[A-Za-z'-]+(?:\s+[A-Za-z'-]+)*\b/),
            })
            .matches(/\b[A-Za-z'-]+(?:\s+[A-Za-z'-]+)*\b/, "Invalid English format."),
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
            <button type="button" onClick={handleClick}>Add word
                <img src="/icons/plus.svg" alt="plus" />
            </button>
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <div>
                        <h2>Add word</h2>
                        <p>Adding a new word to the dictionary is an important step in enriching the language base and expanding the vocabulary.</p>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <DropdownMenu
                                    defaultOption="Select a category"
                                    onSelect={(option) => {
                                        setSelectedCategory(option);
                                        setValue("category", option);
                                    }}
                                    options={categories.filter((cat) => cat !== "all")}
                                />
                                {errors.category && (<p>{errors.category.message}</p>)}
                            </div>
                            <div className={css.buttonType + (selectedCategory === "verb" ? " " + css.visible : "")}>
                                <label>Regular
                                    <input
                                        type="radio"
                                        value="false"
                                        {...register("isIrregular")}
                                    />
                                </label>
                                <label>Irregular
                                    <input
                                        type="radio"
                                        value="true"
                                        {...register("isIrregular")}
                                    />
                                </label>
                                {errors.isIrregular && (<p>{errors.isIrregular.message}</p>)}
                            </div>
                            <div className={css.radioIrregular + (isIrregular === "true" ? " " + css.visible : "")}>
                                <p>English verb must be in the form of 'verb-verb-verb'.</p>
                            </div>
                            <div>
                                <label htmlFor="ua">Ukrainian
                                    <img src="/icons/ukraine.svg" alt="ua" />
                                </label>
                                <input
                                    type="text"
                                    id="ua"
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
                                    {...register("en")}
                                />
                                {errors.en && (<p>{errors.en.message}</p>)}
                            </div>
                            <div>
                                <button type="submit">Add</button>
                                <button type="button" onClick={handleCloseModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default AddWordForm;