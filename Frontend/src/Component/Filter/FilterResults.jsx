import React from "react";
import { Link } from "react-router-dom";
import { kfc, dominos, dhab, BurgerKing } from "../../assets/filter/Filter";
import "../../Styles/Filter/FilterResults.css";
const imageMap = {
  KFC: kfc,
  "Domino's": dominos,
  "Baba Ka Dhaba": dhab,
  "Burger King": BurgerKing,
  default: kfc,
};

const FilterResults = ({ restaurants }) => {
  if (!restaurants.length) {
    return (
      <div className="no-results">
        <h3>No restaurants found</h3>
      </div>
    );
  }

  return (
    <div className="rightbox">
      {restaurants.map((res) =>
        res._id ? (
          <Link
            to={`/details?restaurantId=${res._id}`}
            key={res._id}
            className="restaurant-link"
          >
            <div className="box2">
              <img
                src={imageMap[res.name] || imageMap.default}
                className="img"
                width="200px"
                alt={res.name}
              />
              <div className="text">
                <p>{res.name}</p>
                <p>{res.locality}</p>
                <p>{res.city}</p>
                <hr />
                <p>Meal Type ID: {res.mealtype_id}</p>
                <p>Cost for Two: ₹{res.min_price}</p>
              </div>
            </div>
          </Link>
        ) : null
      )}
    </div>
  );
};

export default FilterResults;
