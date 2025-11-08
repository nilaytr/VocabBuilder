import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getTasks } from "../../redux/word/operations";
import { selectTasks } from "../../redux/word/selectors";
import TrainingRoom from "../../components/TrainingRoom/TrainingRoom";
import EmptyTraining from "../../components/EmptyTraining/EmptyTraining";
import { toast } from "react-hot-toast";

const TrainingPage = () => {
    const dispatch = useDispatch();
    const tasks = useSelector(selectTasks);

    useEffect(() => {
        dispatch(getTasks()).unwrap().catch(() => {
            toast.error("Failed to load training tasks.");
        });
    }, [dispatch]);


    return (
        <>
            {tasks.length === 0 ? <EmptyTraining /> : <TrainingRoom />}
        </>
    );
};

export default TrainingPage;