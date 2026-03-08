import { useState, useEffect, useRef } from "react";

interface UseStudentPaginationParams {
  searchParams?: {
    status?: string;
    classId?: string | string[];
    sectionId?: string;
    gender?: string | string[];
    academicYearId?: string;
    fromDate?: string;
    toDate?: string;
    fromFamilyIncome?: number;
    toFamilyIncome?: number;
  };
  pageSize: number;
}

export function UseStudentPagination({
  searchParams,
  pageSize,
}: UseStudentPaginationParams) {
  const [currentPage, setCurrentPage] = useState(1);
  const prevSearchParamsRef = useRef(searchParams);
  const prevPageSizeRef = useRef(pageSize);

  // Reset to page 1 when search parameters or page size changes
  useEffect(() => {
    const paramsChanged =
      JSON.stringify(prevSearchParamsRef.current) !==
      JSON.stringify(searchParams);
    const pageSizeChanged = prevPageSizeRef.current !== pageSize;

    if (paramsChanged || pageSizeChanged) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setCurrentPage(1);
      }, 0);
      prevSearchParamsRef.current = searchParams;
      prevPageSizeRef.current = pageSize;
    }
  }, [searchParams, pageSize]);

  return {
    currentPage,
    setCurrentPage,
  };
}
