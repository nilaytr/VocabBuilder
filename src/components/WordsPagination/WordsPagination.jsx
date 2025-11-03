import { useMemo, useEffect } from "react";
import css from "./WordsPagination.module.css";

const WordsPagination = ({ currentPage, totalPages, onPageChange }) => {
    useEffect(() => {
        if (currentPage > totalPages) {
            onPageChange(totalPages);
        }
    }, [currentPage, totalPages, onPageChange]);
    
    const handleClick = (page) => {
        if (!page || isNaN(page)) return;
        if (page !== currentPage && page > 0 && page <= totalPages) {
            onPageChange(page);
        }
    };
    
    const createPageNumbers = () => {
        const pages = [];
        pages.push(1);
        
        if (currentPage > 3) {
            pages.push("dots-left");
        }
        
        const startPage = Math.max(currentPage - 1, 2);
        const endPage = Math.min(currentPage + 1, totalPages - 1);
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        if (currentPage < totalPages - 2) {
            pages.push("dots-right");
        }
        
        if (totalPages > 1) {
            pages.push(totalPages);
        }
        
        return pages;
    };
    
    const pages = useMemo(() => createPageNumbers(), [currentPage, totalPages]);
    
    return (
        <div className={css.pagination}>
            <button
                className={css.buttonPage}
                onClick={() => handleClick(1)}
                disabled={currentPage === 1}
            >
                <img src="/icons/first-page.svg" alt="first page" />
            </button>
            <button
                className={css.buttonPage}
                onClick={() => handleClick(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <img src="/icons/page-back.svg" alt="previous page" />
            </button>
            {pages.map((page, index) =>
                typeof page === "string" ? (
                    <button key={`${page}-${index}`} className={css.btnNumber} disabled>...</button>
                ) : (
                    <button
                            key={`page-${page}`}
                            className={`${css.btnNumber} ${page === currentPage ? css.active : ""}`}
                            onClick={() => handleClick(page)}
                            aria-current={page === currentPage ? "page" : undefined}
                    >
                        {page}
                        </button>
                )
            )}
            <button
                className={css.buttonPage}
                onClick={() => handleClick(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <img src="/icons/page-next.svg" alt="next page" />
            </button>
            <button
                className={css.buttonPage}
                onClick={() => handleClick(totalPages)}
                disabled={currentPage === totalPages}
            >
                <img src="/icons/last-page.svg" alt="last page" />
            </button>
        </div>
    );
};

export default WordsPagination;