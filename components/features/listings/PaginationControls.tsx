"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export default function PaginationControls({ pageNumber, pageSize, totalCount, totalPages }: PaginationControlsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    console.log("router",router);
    console.log("pathname",pathname);
    console.log("search params",searchParams);


    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    if (totalPages <= 1) return null;

    const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        if (totalPages <= 5) return i + 1;
        if (pageNumber <= 3) return i + 1;
        if (pageNumber >= totalPages - 2) return totalPages - 4 + i;
        return pageNumber - 2 + i;
    });

    return (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm flex-wrap gap-3">
            <span className="text-sm text-gray-700">
                Showing {((pageNumber - 1) * pageSize) + 1} to{" "}
                {Math.min(pageNumber * pageSize, totalCount)} of {totalCount} results
            </span>

            <div className="flex items-center gap-2 flex-wrap">
                <button
                    onClick={() => goToPage(pageNumber - 1)}
                    disabled={pageNumber <= 1}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                </button>

                <div className="flex items-center gap-1">
                    {pages.map((p) => (
                        <button
                            key={p}
                            onClick={() => goToPage(p)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                                p === pageNumber
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => goToPage(pageNumber + 1)}
                    disabled={pageNumber >= totalPages}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                </button>
            </div>
        </div>
    );
}
