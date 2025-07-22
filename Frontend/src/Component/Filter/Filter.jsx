import React from "react";
import axios from "axios";
import queryString from "query-string";
import "../../Styles/Filter/Filter.css";

import FilterSidebar from "./FilterSidebar";
import FilterResults from "./FilterResults";
import FilterPagination from "./FilterPagination";

import withLocation from "../withLocation";
import withNavigate from "../withNavigate";
import { ClipLoader } from "react-spinners";
import Cookies from 'js-cookie';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: [],
      locations: [],
      mealtype: undefined,
      location: undefined,
      selectedCuisines: [],
      lcost: undefined,
      hcost: undefined,
      sort: 1,
      page: 1,
      displayedCuisines: [],
      loading: true,
    };
  }

  componentDidMount() {
    // const storedLocationId = sessionStorage.getItem("locationId");
    const locationId = Cookies.get("locationId");
console.log("Location ID from cookie:", locationId);
    const storedLocationId = Cookies.get("locationId");
    const { location } = this.props;

    if (location && location.search) {
      const qs = queryString.parse(location.search);
      const mealtype = Number(qs.mealtype);
      const locationId = Number(qs.location || storedLocationId);
      this.setState({ mealtype, location: locationId }, this.fetchRestaurants);
    }

    axios
      .get(`${backendUrl}/locations`)
      .then((res) => this.setState({ locations: res.data.locations }))
      .catch((err) => console.log("Error fetching locations:", err));
  }

  fetchRestaurants = () => {
    const { mealtype, location, selectedCuisines, lcost, hcost, sort, page } =
      this.state;
    if (!mealtype) return;
    this.setState({ loading: true });

    const payload = {
      mealtype,
      location,
      cuisine: selectedCuisines.length > 0 ? selectedCuisines : undefined,
      lcost,
      hcost,
      sort,
      page,
    };

    axios
      .post(`${backendUrl}/filter`, payload)
      .then((res) => {
        const restaurants = res.data?.restaurants || [];
        const uniqueCuisines = [];
        const cuisineMap = new Set();

        restaurants.forEach((rest) => {
          (rest.cuisine || []).forEach((c) => {
            if (!cuisineMap.has(c.name)) {
              cuisineMap.add(c.name);
              uniqueCuisines.push(c);
            }
          });
        });

        this.setState({
          restaurants,
          displayedCuisines: uniqueCuisines,
          loading: false,
        });
      })
      .catch((err) => {
        console.error("Error filtering restaurants:", err);
        this.setState({ restaurants: [], displayedCuisines: [] });
      });
  };

  handleLocationChange = (e) => {
    const locationId = parseInt(e.target.value);
    sessionStorage.setItem("locationId", locationId);
    this.setState(
      { location: locationId === 0 ? null : locationId },
      this.fetchRestaurants
    );
  };

  handleCuisineChange = (cuisineName) => {
    const { selectedCuisines } = this.state;
    const updated = selectedCuisines.includes(cuisineName)
      ? selectedCuisines.filter((name) => name !== cuisineName)
      : [...selectedCuisines, cuisineName];

    this.setState({ selectedCuisines: updated }, this.fetchRestaurants);
  };

  handleCostChange = (min, max) => {
    this.setState({ lcost: min, hcost: max }, this.fetchRestaurants);
  };

  handleSortChange = (sort) => {
    this.setState({ sort }, this.fetchRestaurants);
  };

  resetFilters = () => {
    this.setState(
      {
        location: undefined,
        selectedCuisines: [],
        lcost: undefined,
        hcost: undefined,
        sort: 1,
        page: 1,
      },
      this.fetchRestaurants
    );
    sessionStorage.removeItem("locationId");
  };

  handlePageChange = (direction) => {
    this.setState(
      (prevState) => ({
        page:
          direction === "next"
            ? prevState.page + 1
            : Math.max(prevState.page - 1, 1),
      }),
      this.fetchRestaurants
    );
  };

  render() {
    const {
      locations,
      restaurants,
      selectedCuisines,
      lcost,
      hcost,
      sort,
      page,
      loading,
    } = this.state;

    return (
      <div className="border">
        <h1>BREAKFAST PLACES</h1>
        {loading ? (
        <div className="loader-container">
          <ClipLoader color="#ff5a5f" loading={true} size={50} />
          <p>Loading restaurants...</p>
        </div>
      ) : (
        <>
        <div className="bigbox">
          <FilterSidebar
            locations={locations}
            selectedCuisines={selectedCuisines}
            lcost={lcost}
            hcost={hcost}
            sort={sort}
            handleLocationChange={this.handleLocationChange}
            handleCuisineChange={this.handleCuisineChange}
            handleCostChange={this.handleCostChange}
            handleSortChange={this.handleSortChange}
            resetFilters={this.resetFilters}
          />

          <FilterResults restaurants={restaurants} />
        </div>

        <FilterPagination
          page={page}
          handlePageChange={this.handlePageChange}
        />
        </>
      )}
      </div>
    );
  }
}

export default withLocation(withNavigate(Filter));
