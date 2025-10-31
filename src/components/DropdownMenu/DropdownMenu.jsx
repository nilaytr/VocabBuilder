import { useState, useEffect, useRef } from "react";

const DropDownMenu = ({
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
        <div ref={dropDownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>
                <img src="/icons/category.svg" alt="category" />
                <span>{selectedOption}</span>
            </div>
            {isOpen && (
                <div>
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

export default DropDownMenu;