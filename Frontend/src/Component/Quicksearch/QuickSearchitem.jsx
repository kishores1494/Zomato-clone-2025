import React from "react";
import {
  breakfast,
  lunch,
  dinner,
  snacks,
  drink,
  nightlife,
} from "../../assets/Quicksearchitem/Quicksearchitem";
import "../../Styles/QuickSearchitem.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const backendUrl = import.meta.env.VITE_BACKEND_URL;

const QuickSearchitemWrapper = (props) => {
  const navigate = useNavigate();
  return <QuickSearchitem {...props} navigate={navigate} />;
};

class QuickSearchitem extends React.Component {
  handleNavigate = async (mealtypeId) => {
    const locationId = sessionStorage.getItem("locationId");
    const { meal_type } = this.props.quicksearchitemData;
    const { navigate } = this.props;

    const filterData = {
      mealtype: meal_type,
      location: locationId || null,
    };

    try {
      const response = await axios.post(
        `${backendUrl}/filter`,
        filterData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data && response.data.restaurants) {
        this.props.navigate(
          `/filter?mealtype=${filterData.mealtype}&location=${locationId}`
        );
      } else {
        console.error("Error: Restaurants data not found in API response");
      }
    } catch (error) {
      console.error("Error filtering restaurants:", error);
    }
  };

  render() {
    const { name, content, image, id } = this.props.quicksearchitemData;

    const imageMapping = {
      "breakfast.jpg": breakfast,
      "lunch.jpg": lunch,
      "dinner.png": dinner,
      "snacks.png": snacks,
      "drinks.png": drink,
      "nightlife.png": nightlife,
    };

    const fileName = image?.split("/").pop().toLowerCase();
    const imageSrc = imageMapping[fileName] || breakfast;

    return (
      <>
        <div className="QSMborder">
          <div
            className="QSborder"
            onClick={() =>
              this.handleNavigate(this.props.quicksearchitemData.meal_type)
            }
          >
            <div>
              <img
                src={imageSrc}
                width="100"
                height="100"
                alt={name}
                srcSet=""
                loading="lazy"
              />

              <div className="text">
                <h3>{name}</h3>
                <hr />
                <h5>{content} </h5>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default QuickSearchitemWrapper;
