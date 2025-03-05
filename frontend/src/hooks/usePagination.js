import { useState, useMemo, useEffect } from 'react';

export const usePagination = ({ 
  totalItems, 
  itemsPerPage = 4 
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // número de paginas
  const totalPages = useMemo(() => 
    Math.ceil(totalItems / itemsPerPage), 
    [totalItems, itemsPerPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [totalItems]);

  // indices de inicio y fin
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;


  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => 
      prevPage < totalPages ? prevPage + 1 : prevPage
    );
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePageReset = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    handlePrevPage,
    handleNextPage,
    handlePageClick,
    handlePageReset
  };
};