import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectOwnWords, selectTotalPages } from "../../redux/word/selectors";
import { ownWord, deleteWord } from "../../redux/word/operations";
import Dashboard from "../../components/Dashboard/Dashboard";
import WordsTable from "../../components/WordsTable/WordsTable";
import WordsPagination from "../../components/WordsPagination/WordsPagination";

const DictionaryPage = () => {
    const dispatch = useDispatch();
    const ownWords = useSelector(selectOwnWords);
    const totalPages = useSelector(selectTotalPages);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        search: "",
        category: "all",
        verbType: "",
    });

    useEffect(() => {
        dispatch(
            ownWord({
                page: currentPage,
                search: filters.search,
                category: filters.category,
                verbType: filters.verbType,
            })
        );
    }, [dispatch, currentPage, filters]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };
    
    const handleActions = async (word, actionType) => {
        switch (actionType) {
            case "edit":
                break;
            case "delete":
                await dispatch(deleteWord(word._id));
                if (ownWords.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                } else {
                    dispatch(
                        ownWord({
                            page: currentPage,
                            ...filters,
                        })
                    );
                }
                break;
            default:
                break;
        }
    };

    return (
        <>
            <Dashboard
                onFilterChange={handleFilterChange}
                pageType="dictionary"
            />
            <WordsTable
                words={ownWords}
                handleActions={handleActions}
                actionType="dictionary"
            />
            <WordsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </>
    );
};

export default DictionaryPage;