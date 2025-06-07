import React from "react";
import Wallpaper from "../Wallpaper/Wallpaper";
import QuickSearch from "../Quicksearch/QuickSearch";
import axios from "axios";
import "../../Styles/Home.css";

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      locations: [],
      mealtypes: [],
    };
  }
  componentDidMount() {
    sessionStorage.clear();
    axios({
      method: "GET",
      url: "http://localhost:5000/locations",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        this.setState({ locations: response.data.locations });
      })
      .catch((err) => console.log(err));
    axios({
      method: "GET",
      url: "http://localhost:5000/mealtypes",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        this.setState({ mealtypes: response.data.mealTypes });
      })
      .catch((err) => console.log(err));
  }
  render() {
    const { locations, mealtypes } = this.state;

    return (
      <div className="Homebor">
        <Wallpaper locationData={locations} />

        <QuickSearch quicksearchData={mealtypes} />
      </div>
    );
  }
}
export default Home;
