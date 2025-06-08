import React, { Component } from "react";
import axios from "axios"; // ✅ Import axios
import QuickSearchitem from "./QuickSearchitem";
import "../../Styles/QuickSearch.css";



const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", backendUrl); 

class QuickSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mealTypes: [],
    };
  }

  componentDidMount() {
    axios
      .get(`${backendUrl}/mealtypes`)
      .then((res) => this.setState({ mealTypes: res.data.mealTypes }))
      .catch((err) => console.error("Error fetching meal types:", err));
  }

  render() {
    console.log("Meal Types Data:", this.state.mealTypes);

    const { quicksearchData } = this.props;

    return (
      <>
        <div>
          <h2>&emsp;Quick Search</h2>
          <h3>&emsp;Discover restaurants by meal type</h3>
          <div className="section">
            <div className="qs-boxes-container row g-1 ">
            {/* {Array.isArray(mealTypes) && mealTypes.map((item, index) => (
  <QuickSearchitem key={index} quicksearchitemData={item} />
))} */}

              {quicksearchData.map((item, index) => (
                <QuickSearchitem key={index} quicksearchitemData={item} />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default QuickSearch;
