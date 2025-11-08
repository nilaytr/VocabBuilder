import { useState } from "react";
import Popover from '@mui/material/Popover';
import EditWordForm from "../EditWordForm/EditWordForm";
import css from "./WordMenu.module.css";

const WordMenu = ({ word, handleActions }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);

    const closeEditModal = () => {
        setOpenEditModal(false);
    };
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        handleActions(word, "edit");
        setOpenEditModal(true);
        handleClose();
    };

    const handleDelete = () => {
        handleActions(word, "delete");
        handleClose();
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
        <div className={css.wordMenuDiv}>
            <button aria-describedby={id} onClick={handleClick} className={css.buttonDots}>
                <img src="/icons/Dots.svg" alt="dots" className={css.dotsIcon} />
            </button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div className={css.editDiv}>
                    <button onClick={handleEdit} className={css.menuBtn}>Edit
                        <img src="/icons/pencil-1.svg" alt="pencil" className={css.menuIcon} />
                    </button>
                    <button onClick={handleDelete} className={css.menuBtn}>Delete
                        <img src="/icons/trash-03.svg" alt="trash" className={css.menuIcon} />
                    </button>
                </div>
            </Popover>
            {openEditModal && <EditWordForm word={word} onClose={closeEditModal} />}
        </div>
    );
};

export default WordMenu;