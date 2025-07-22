import React, { Component } from "react";
import axios from "axios"; // ✅ Import axios
import QuickSearchitem from "./QuickSearchitem";
import "../../Styles/QuickSearch.css";
import { ClipLoader } from "react-spinners";




const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", backendUrl); 

class QuickSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mealTypes: [],
      loading: true, 
    };
  }

  componentDidMount() {
    setTimeout(()=>{
    axios
      .get(`${backendUrl}/mealtypes`)
      .then((res) => this.setState({ mealTypes: res.data.mealTypes,loading: false })) 
      .catch((err) =>{ console.error("Error fetching meal types:", err);
      this.setState({ loading: false }); 
    })},2000)
  }

  render() {
    console.log("Meal Types Data:", this.state.mealTypes);

    const { quicksearchData } = this.props;
    const{loading} = this.state;
    if (loading) {
      return (
        <div className="loader-container">
          <ClipLoader color="#ff5a5f" loading={true} size={50} />
          <p>Loading Quick Search...</p>
        </div>
      );
    }

    return (
      <>
        <div>
          <h2>&emsp;Quick Search</h2>
          <h3>&emsp;Discover restaurants by meal type</h3>
          <div className="section">
            <div className="qs-boxes-container row g-1 ">
          

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
