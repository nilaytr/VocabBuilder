import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectTasks } from "../../redux/word/selectors";
import { addAnswers } from "../../redux/word/operations";
import Modal from "../Modal/Modal";
import ProgressBar from "../ProgressBar/ProgressBar";
import css from "./TrainingRoom.module.css";

const TrainingRoom = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const tasks = useSelector(selectTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [answers, setAnswers] = useState([]);
    const currentTask = tasks[currentTaskIndex];
    const isLastTask = currentTaskIndex === tasks.length - 1;
    const [error, setError] = useState("");

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const validationInput = (input) => {
        
    }

}