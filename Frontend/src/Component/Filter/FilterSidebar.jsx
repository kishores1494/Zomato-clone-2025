import React,{useState} from "react";
import "../../Styles/Filter/FilterSidebar.css";
const FilterSidebar = ({
  locations,
  selectedCuisines,
  lcost,
  hcost,
  sort,
  handleLocationChange,
  handleCuisineChange,
  handleCostChange,
  handleSortChange,
  resetFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <>
        
        <button className="filter-toggle-btn" onClick={toggleSidebar}>
        {isOpen ? "Close Filters" : "Show Filters"}
      </button>
    <div className={`leftbox ${isOpen ? "active" : ""}`}>
      <h3>Filter</h3>

      <p>Select Location</p>
      <select name="Location" onChange={handleLocationChange}>
        <option value="0">--- Select the city ---</option>
        {locations.map((loc) => (
          <option key={loc.location_id} value={loc.location_id}>
            {`${loc.name}, ${loc.city}`}
          </option>
        ))}
      </select>

      <p>Cuisine</p>
      {["North Indian", "South Indian", "Fast Food", "Chinese", "European"].map(
        (name) => (
          <label key={name}>
            <input
              type="checkbox"
              onChange={() => handleCuisineChange(name)}
              checked={selectedCuisines.includes(name)}
            />{" "}
            {name}
          </label>
        )
      )}

      <p>Cost for Two</p>
      {[
        [0, 500],
        [500, 1000],
        [1000, 1500],
      ].map(([min, max]) => (
        <label key={min}>
          <input
            type="radio"
            name="cost"
            checked={lcost === min && hcost === max}
            onChange={() => handleCostChange(min, max)}
          />
          ₹{min} - ₹{max}
        </label>
      ))}

      <p>Sort</p>
      <label>
        <input
          type="radio"
          name="sort"
          checked={sort === 1}
          onChange={() => handleSortChange(1)}
        />{" "}
        Price Low to High
      </label>
      <label>
        <input
          type="radio"
          name="sort"
          checked={sort === -1}
          onChange={() => handleSortChange(-1)}
        />{" "}
        Price High to Low
      </label>

      <button onClick={resetFilters} className="reset-btn">
        Reset Filters
      </button>
    </div></>
  );
};

export default FilterSidebar;
