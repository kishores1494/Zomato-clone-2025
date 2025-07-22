import React from "react";
import "../../Styles/Wallpaper.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logo } from "../../assets/assets";
import Cookies from 'js-cookie';


const backendUrl = import.meta.env.VITE_BACKEND_URL;

const withNavigate = (Component) => (props) => {
  const navigate = useNavigate();
  return <Component {...props} navigate={navigate} />;
};

class Wallpaper extends React.Component {
  constructor() {
    super();
    this.state = {
      locations: [],
      restaurants: [],
      inputText: "",
      suggestions: [],
    };
  }

  componentDidMount() {
    axios
      .get(`${backendUrl}/locations`)
      .then((res) => {
        console.log("Location API response:", res.data);
        this.setState({ locations: res.data.locations || [] });
      })
      .catch((err) => console.log("Error fetching locations:", err));
  }

  handleLocation = (event) => {
    const locationId = event.target.value;
    // sessionStorage.setItem("locationId", locationId);
    Cookies.set("locationId", locationId, { expires: 7 }); // persists for 7 days
    console.log("Cookie set:", Cookies.get("locationId"));

    axios
      .get(
        `${backendUrl}/restaurants/filter/restaurants?locationId=${locationId}`
      )
      .then((response) => {
        this.setState({
          restaurants: response.data.restaurants || [],
          inputText: "",
          suggestions: [],
        });

        if (response.data.restaurants) {
          response.data.restaurants.forEach((restaurant) =>
            console.log("Restaurant object (handleLocation):", restaurant)
          );
        }
        this.setState({
          restaurants: response.data.restaurants || [],
          inputText: "",
          suggestions: [],
        });
      })
      .catch((err) => console.error("Error fetching restaurants:", err));
  };
  handleSearch = (event) => {
    let inputText = event.target.value;
    const { restaurants } = this.state;

    const suggestions = restaurants.filter((item) =>
      item.name.toLowerCase().includes(inputText.toLowerCase())
    );

    this.setState({ suggestions, inputText });
  };

  showSuggestion = () => {
    const { suggestions, inputText } = this.state;

    if (!inputText) return null;
    if (suggestions.length === 0)
      return (
        <ul>
          <li>No Search Results Found</li>
        </ul>
      );

    return (
      <ul>
        {suggestions.map((item, index) => (
          <li key={index} onClick={() => this.selectingRestaurant(item)}>
            {`${item.name}-${item.locality},${item.city}`}
          </li>
        ))}
      </ul>
    );
  };

  selectingRestaurant = (resObj) => {
    const restaurantId = resObj._id || resObj.id || resObj.location_id; // Use location_id as fallback

    if (!restaurantId) {
      return;
    }

    this.props.navigate(`/details?restaurantId=${restaurantId}`);
  };
  render() {
    const { locations, inputText } = this.state;
    return (
      <>
        <div className="wallpaperbor">
          <img className="logo" src={logo} alt="" srcSet="" />
          <h3 style={{ color: "#FFFFFF" }}>
            Find the best restaurants, cafes, bars
          </h3>
          <div className="select">
            <select
              className="form-select"
              defaultValue=""
              aria-label="Default select example"
              onChange={this.handleLocation}
            >
              <option value="0"> --- Select the city ---</option>
              {this.state.locations.map((item) => (
                <option key={item.location_id} value={item.location_id}>
                  {`${item.name}, ${item.city}`}
                </option>
              ))}
            </select>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search for restaurant"
                onChange={this.handleSearch}
              />
              <div className="suggestion-container">
                {this.showSuggestion()}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withNavigate(Wallpaper);
