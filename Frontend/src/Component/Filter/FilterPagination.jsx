import React from "react";
import "../../Styles/Filter/FilterPagination.css";

const FilterPagination = ({ page, handlePageChange }) => (
  <div className="pagination">
    <button disabled={page === 1} onClick={() => handlePageChange("prev")}>
      Prev
    </button>
    <span>Page {page}</span>
    <button onClick={() => handlePageChange("next")}>Next</button>
  </div>
);

export default FilterPagination;
