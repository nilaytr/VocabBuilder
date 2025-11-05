import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { selectCategories } from "../../redux/word/selectors";
import { fetchCategories } from "../../redux/word/operations";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import debounce from "lodash.debounce";
import css from "./Filters.module.css";

const Filters = ({ onFilterChange }) => {
    const dispatch = useDispatch();
    const categories = useSelector(selectCategories);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [verbType, setVerbType] = useState("false");

    const debouncedSearch = useRef(
        debounce((value) => {
            onFilterChange({ search: value, category, verbType })
        }, 300)
    ).current;

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (category === "verb") {
            onFilterChange({ search, category, verbType });
        }
    }, [verbType]);

    const handleSearchChange = (e) => {
        const value = e.target.value.trim();
        setSearch(value);
        
        if (value === "") {
            onFilterChange({ search: "", category, verbType });
        } else {
            debouncedSearch(value);
        }
    };

    const handleCategoryChange = (option) => {
        setCategory(option);
        if (option === "verb") {
            const defaultVerbType = "false";
            setVerbType(defaultVerbType);
            onFilterChange({ search, category: option, verbType: defaultVerbType });
        } else {
            setVerbType("");
            onFilterChange({ search, category: option, verbType: "" });
        }
    };

    const handleVerbTypeChange = (e) => {
        const value = e.target.value;
        setVerbType(value);
        onFilterChange({ search, category, verbType: value });
    };

    return (
        <div className={css.filtersContainer}>
            <div className={css.filterInput}>
                <input
                    type="text"
                    placeholder="Find the word"
                    value={search}
                    onChange={handleSearchChange}
                    className={css.inputFilter}
                />
                <img src="/icons/search.svg" alt="search" className={css.searchIcon} />
            </div>
            <DropdownMenu
                defaultOption="Categories"
                options={["all", ...categories]}
                onSelect={handleCategoryChange}
            />
                <div className={`${css.radioBtn} ${category === "verb" ? css.visible : ""}`}>
                    <label className={css.radioContainer}>Regular
                        <input
                            type="radio"
                            value="false"
                            name="verbType"
                            checked={verbType === "false"}
                            onChange={handleVerbTypeChange}
                    />
                    <span className={css.checkmark}></span>
                    </label>
                    <label className={css.radioContainer}>Irregular
                        <input
                            type="radio"
                            value="true"
                            name="verbType"
                            checked={verbType === "true"}
                            onChange={handleVerbTypeChange}
                    />
                    <span className={css.checkmark}></span>
                    </label>
                </div>
        </div>
    );
};

export default Filters;