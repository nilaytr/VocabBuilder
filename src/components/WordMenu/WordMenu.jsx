import { useState } from "react";
import Popover from '@mui/material/Popover';
import EditWordForm from "../EditWordForm/EditWordForm";
//import css from "./WordMenu.module.css";

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
        <div>
            <button aria-describedby={id} onClick={handleClick}>
                <img src="/icons/Dots.svg" alt="dots" />
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
                <div>
                    <button onClick={handleEdit}>Edit
                        <img src="/icons/pencil-1.svg" alt="pencil" />
                    </button>
                    <button onClick={handleDelete}>Delete
                        <img src="/icons/trash-03.svg" alt="trash" />
                    </button>
                </div>
            </Popover>
            {openEditModal && <EditWordForm word={word} onClose={closeEditModal} />}
        </div>
    );
};

export default WordMenu;