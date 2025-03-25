import PropTypes from "prop-types";
import { ChevronsLeft, ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onPageReset,
  onPrevPage,
  onNextPage,
}) => {
  return (
    <div className="flex place-items-center justify-center mt-2.5">
       <div>
        <button
          onClick={onPageReset}
          className={`min-w-9 rounded-xl py-2 px-3.5 text-center text-sm transition-all shadow-md ml-2 ${
            currentPage === 1
              ? "disabled:bg-slate-200 disabled:hover:bg-slate-200 disabled:text-slate-600"
              : currentPage < totalPages
              ? "bg-slate-200 text-white"
              : "border border-slate-800 text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800"
          }`}
          aria-label="Ir a la primera página"
          disabled={currentPage === 1}
        >
          <ChevronsLeft size={18} />
        </button>
      </div>
      <div>
        <button
          className="rounded-xl border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          onClick={onPrevPage}
          disabled={currentPage === 1}
          aria-label="Ir a la página anterior"
        >
          <ChevronLeft size={18} />
        </button>
      </div>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          className={`text-ellipsis md:text-clip min-w-9 rounded-xl py-2 px-3.5 text-center text-sm transition-all shadow-md ml-2 ${
            currentPage === index + 1
              ? "bg-slate-800 text-white"
              : "border border-slate-300 text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800"
          }`}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}
      <div>
        <button
          className="min-w-9 rounded-xl border border-slate-300 py-2 px-3.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          aria-label="Ir a la siguiente página"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageReset: PropTypes.func.isRequired,
  onPrevPage: PropTypes.func.isRequired,
  onNextPage: PropTypes.func.isRequired,
};