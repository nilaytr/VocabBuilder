import { useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import WordMenu from "../WordMenu/WordMenu";
import ProgressBar from "../ProgressBar/ProgressBar";
//import css from "./WordsTable.module.css";

const WordsTable = ({ words, handleActions, actionType }) => {
    const data = useMemo(() => words, [words]);
    const columnHelper = createColumnHelper();

    const columns = useMemo(() => {
        const baseColumns = [
            columnHelper.accessor("en", {
                header: () => (
                    <span>Word{" "}
                        <img src="/icons/united-kingdom.svg" alt="en" />
                    </span>
                ),
                cell: (info) => info.getValue(),
            }),
            columnHelper.accessor("ua", {
                header: () => (
                    <span>Translation{" "}
                        <img src="/icons/ukraine.svg" alt="ua" />
                    </span>
                ),
                cell: (info) => info.getValue(),
            }),
        ];
        
        if (actionType === "recommend") {
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
                            <button onClick={() => handleActions(row.original, "add")}>
                                <span>Add to dictionary</span>
                                <img src="/icons/arrow.svg" alt="arrow" />
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
        <div>
            <table>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
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
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default WordsTable;