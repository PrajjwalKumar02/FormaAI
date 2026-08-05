import { useState, useMemo, useCallback } from 'react';

export const usePagination = (totalItems = 0, initialPage = 1, initialLimit = 10) => {
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);

    const totalPages = useMemo(() => {
        return Math.ceil(totalItems / limit) || 1;
    }, [totalItems, limit]);

    const paginationInfo = useMemo(() => ({
        currentPage: page,
        totalPages,
        totalItems,
        limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        from: totalItems > 0 ? (page - 1) * limit + 1 : 0,
        to: Math.min(page * limit, totalItems)
    }), [page, totalPages, totalItems, limit]);

    const goToPage = useCallback((newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    }, [totalPages]);

    const nextPage = useCallback(() => {
        if (paginationInfo.hasNext) {
            setPage(prev => prev + 1);
        }
    }, [paginationInfo.hasNext]);

    const prevPage = useCallback(() => {
        if (paginationInfo.hasPrev) {
            setPage(prev => prev - 1);
        }
    }, [paginationInfo.hasPrev]);

    const changeLimit = useCallback((newLimit) => {
        setLimit(newLimit);
        setPage(1); // Reset to first page
    }, []);

    const getPageNumbers = useCallback(() => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
                range.push(i);
            }
        }

        range.forEach((i) => {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        });

        return rangeWithDots;
    }, [page, totalPages]);

    const reset = useCallback(() => {
        setPage(initialPage);
        setLimit(initialLimit);
    }, [initialPage, initialLimit]);

    return {
        ...paginationInfo,
        goToPage,
        nextPage,
        prevPage,
        changeLimit,
        getPageNumbers,
        setPage,
        setLimit,
        reset
    };
};