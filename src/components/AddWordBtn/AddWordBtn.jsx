import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { createWord } from "../../redux/word/operations";
import { selectCategories } from "../../redux/word/selectors";
import AddWordModal from "../AddWordModal/AddWordModal";
import DropDownMenu from "../DropdownMenu/DropdownMenu";
//import css from "./AddWordBtn.module.css";

const AddWordBtn = () => {
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

};

export default AddWordBtn;