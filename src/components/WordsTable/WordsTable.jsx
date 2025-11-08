import { useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import WordMenu from "../WordMenu/WordMenu";
import ProgressBar from "../ProgressBar/ProgressBar";
import css from "./WordsTable.module.css";
import toast, { Toaster } from "react-hot-toast";

const WordsTable = ({ words, handleActions, actionType }) => {
    const data = useMemo(() => words, [words]);
    const columnHelper = createColumnHelper();

    const columns = useMemo(() => {
        const baseColumns = [
            columnHelper.accessor("en", {
                header: () => (
                    <span>Word{" "}
                        <img src="/icons/united-kingdom.svg" alt="en" className={css.iconCountry} />
                    </span>
                ),
                cell: (info) => info.getValue(),
            }),
            columnHelper.accessor("ua", {
                header: () => (
                    <span>Translation{" "}
                        <img src="/icons/ukraine.svg" alt="ua" className={css.iconCountry} />
                    </span>
                ),
                cell: (info) => info.getValue(),
            }),
        ];
        
        if (actionType === "recommend" || actionType === "dictionary") {
            baseColumns.push(
                columnHelper.accessor("category", {
                    header: "Category",
                    cell: (info) => info.getValue(),
                })
            );
        }
        
        if (actionType === "dictionary") {
            baseColumns.push(
                columnHelper.accessor("progress", {
                    header: "Progress",
                    cell: ({ row }) => (
                        <ProgressBar
                            progress={row.original.progress}
                            pageType="table"
                        />
                    ),
                })
            );
        }
        
        baseColumns.push(
            columnHelper.display({
                id: "actions",
                cell: ({ row }) => {
                    if (actionType === "dictionary") {
                        return (
                            <WordMenu word={row.original} handleActions={handleActions} />
                        );
                    } else if (actionType === "recommend") {
                        return (
                            <button onClick={async () => {
                                try {
                                    await handleActions(row.original, "add");
                                    toast.success("Word added to dictionary!");
                                } catch (error) {
                                    toast.error("Failed to add word.");
                                    console.error(error);
                                }
                            }} className={css.addBtnTable}>
                                <span>Add to dictionary</span>
                                <img src="/icons/arrow.svg" alt="arrow" className={css.arrowIcon} />
                            </button>
                        );
                    }
                    return null;
                },
            })
        );
        return baseColumns;
    }, [handleActions, actionType]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className={css.wordsTableDiv}>
                <table className={css.wordsTable}>
                    <thead className={css.thead}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className={css.tableHeader}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className={css.tableItem}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default WordsTable;