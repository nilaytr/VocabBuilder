import { useState, useEffect, useRef } from "react";
import css from "./DropdownMenu.module.css";

const DropdownMenu = ({
    options,
    defaultOption,
    onSelect,
}) => {
    const dropDownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(defaultOption);

    const handleSelectOption = (option) => {
        setSelectedOption(option);
        if (onSelect) onSelect(option);
        setIsOpen(false);
    };
    
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setSelectedOption(defaultOption);
    }, [defaultOption]);

    return (
        <div ref={dropDownRef} className={css.dropdown}>
            <div onClick={() => setIsOpen(!isOpen)} className={css.dropdownBtn}>
                <img src="/icons/category.svg" alt="category" className={css.categoryIcon} />
                <span className={css.optionSpan}>{selectedOption}</span>
            </div>
            {isOpen && (
                <div className={css.listFilter}>
                    <ul>
                        {options.map((option) => (
                            <li key={option} onClick={() => handleSelectOption(option)}>
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;