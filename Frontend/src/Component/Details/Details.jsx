import React, { Component } from "react";
import { kfc, dominos, dhab, BurgerKing } from "../../assets/Detail/Detail";
import "../../Styles/Detail.css";
import queryString from "query-string";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { ClipLoader } from "react-spinners";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const withLocation = (Component) => (props) => {
  const location = useLocation();

  return <Component {...props} location={location} />;
};
class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurant: {
        name: "",
        city: "",
        cuisine: { name: "" },
        aggregate_rating: "",
        min_price: "",
        contact_number: "",
      },
      loading: true,
      error: null,
      activeTab: 0,
      showMenuModal: false,
      menu: [],
      orderedItems: [],
      totalAmount: 0,
    };
  }
  componentDidMount() {
    const { location } = this.props;

    if (!location || !location.search) {
      this.setState({
        loading: false,
        error: new Error(
          "Missing restaurant ID. Try again from the restaurant list."
        ),
      });
      return;
    }

    const qs = queryString.parse(this.props.location.search);

    const restaurantId = qs.restaurantId;

    if (!restaurantId || restaurantId === "undefined") {
      this.setState({
        loading: false,
        error: new Error("Invalid Restaurant ID."),
      });
      return;
    }

    axios({
      method: "GET",
      url: `${backendUrl}/restaurants/${restaurantId}`,
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        this.setState({ restaurant: response.data.restaurant, loading: false });
      })
      .catch((err) => console.error("Error fetching restaurant details:", err));
  }
  handleTabClick = (index) => {
    this.setState({ activeTab: index });
  };
  openMenuModal = () => {
    const qs = queryString.parse(this.props.location.search);
    const restaurantId = qs.restaurantId;

    if (!restaurantId) {
      return;
    }

    axios
      .get(`${backendUrl}/menu/${restaurantId}`)

      .then((response) => {
        this.setState(
          {
            menu: response.data.menu || [],
            showMenuModal: true,
          },
          () => {
            this.forceUpdate();
          }
        );
      })
      .catch((err) => {
        console.error("Error fetching menu:", err);
        this.setState({ menu: [], showMenuModal: true });
      });
  };

  closeMenuModal = () => {
    this.setState({ showMenuModal: false });
  };

  handleOrder = (item) => {
    const qs = queryString.parse(this.props.location.search);
    const restaurantId = qs.restaurantId;

    axios
      .post(`${backendUrl}/orders`, {
        restaurant_id: restaurantId,
        item_name: item.name,
        price: item.price,
        user: "guest",
      })
      .then(() => {})
      .catch((err) => {
        console.error("❌ Order failed:", err);
        alert("❌ Failed to place order. Please try again.");
      });

    this.setState((prevState) => {
      const existingItem = prevState.orderedItems.find(
        (order) => order.name === item.name
      );

      let updatedItems;
      if (existingItem) {
        updatedItems = prevState.orderedItems.map((order) =>
          order.name === item.name
            ? { ...order, quantity: order.quantity + 1 }
            : order
        );
      } else {
        updatedItems = [...prevState.orderedItems, { ...item, quantity: 1 }];
      }
      return {
        orderedItems: updatedItems,
        totalAmount: prevState.totalAmount + item.price,
      };
    });
  };
  removeItem = (item) => {
    this.setState((prevState) => {
      const existingItem = prevState.orderedItems.find(
        (order) => order.name === item.name
      );

      if (!existingItem) return;

      let updatedItems;
      if (existingItem.quantity > 1) {
        updatedItems = prevState.orderedItems.map((order) =>
          order.name === item.name
            ? { ...order, quantity: order.quantity - 1 }
            : order
        );
      } else {
        updatedItems = prevState.orderedItems.filter(
          (order) => order.name !== item.name
        );
      }

      return {
        orderedItems: updatedItems,
        totalAmount: prevState.totalAmount - item.price,
      };
    });
  };
  updateQuantity = (item, quantity) => {
    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) return;

    this.setState((prevState) => {
      const updatedItems = prevState.orderedItems.map((order) =>
        order.name === item.name
          ? { ...order, quantity: parsedQuantity }
          : order
      );

      const newTotalAmount = updatedItems.reduce(
        (total, order) => total + order.price * order.quantity,
        0
      );

      return {
        orderedItems: updatedItems,
        totalAmount: newTotalAmount,
      };
    });
  };
  confirmOrder = () => {
    alert("✅ Order is placed for payment!");
  };
  getData = (data) => {
    return fetch(`${backendUrl}/payment`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };
  handlePayment = () => {
    const { totalAmount } = this.state;
    const email = "guest@zomato.com";
    const mobileNo = "1234567890";

    const paymentData = {
      amount: totalAmount.toString(),
      customerId: "guest_" + new Date().getTime(),
      email,
      mobileNo,
    };

    axios
      .post(`${backendUrl}/payment/paynow`, paymentData)
      .then((response) => {
        const { orderId, amount, key, customerId } = response.data;
        const options = {
          key,
          amount,
          currency: "INR",
          name: "Zomato Clone",
          description: "Order Payment",
          order_id: orderId,
          handler: function (response) {
            alert(
              "✅ Payment successful! Payment ID: " +
                response.razorpay_payment_id
            );
          },
          prefill: {
            name: customerId,
            email: email,
            contact: mobileNo,
          },
          notes: {
            address: "Zomato Clone Customer",
          },
          theme: {
            color: "#F37254",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      })
      .catch((error) => {
        alert("Failed to initiate payment");
      });
  };
  render() {
    const { restaurant, loading, error, activeTab } = this.state;

    if (loading) {
      return (    <div className="loader-container" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
      }}>
        <ClipLoader color="#ff5a5f" loading={true} size={60} />
        <p style={{ marginTop: "20px", fontSize: "18px", color: "#555" }}>
          Loading restaurant details...
        </p>
      </div>)
    }

    if (error) {
      return <div>Error: {error.message}</div>; // Display error message
    }

    if (!restaurant) {
      return <div>Restaurant not found.</div>;
    }
    const totalOrderedItems = this.state.orderedItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const imageMap = {
      KFC: kfc,
      "Domino's": dominos,
      "Baba Ka Dhaba": dhab,
      "Burger King": BurgerKing,
    };

    return (
      <>
        <div className="Detailbor">
          <h3>Details of Restaurants</h3>
          <div className="gallery">
            <img
              className="detailimg"
              src={imageMap[restaurant.name] || kfc}
              alt={restaurant.name}
              srcSet=""
            />
            <button>Click to see Image Gallery</button>
          </div>
          <div className="placeorder">
            <button onClick={this.openMenuModal}>Place Online Order</button>
          </div>
          <div className="tabs">
            <Tabs selectedIndex={activeTab} onSelect={this.handleTabClick}>
              <TabList>
                <Tab>Overview</Tab>
                <Tab>Contact</Tab>
                <Tab>Review</Tab>
              </TabList>

              <TabPanel>
                <div className="heading">
                  {restaurant?.name || "Loading..."}
                </div>

                <div className="content">
                  <div className="about">About this place</div>
                  <div className="head">{restaurant.city}</div>
                  <div className="value">{restaurant.cuisine.name}</div>
                  <div className="head">{restaurant.aggregate_rating}</div>
                  <div className="value">
                    &#8377;{restaurant.min_price} for two people(approx)
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="tab-2">
                  <label htmlFor="tab-2"></label>
                  <div className="content">
                    <div className="head">{restaurant.name}</div>
                    <div className="value">{restaurant.contact_number}</div>
                    <div className="head">The Big Chill Cakery</div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="tab-3">
                  <label htmlFor="tab-3"></label>
                  <div className="content">
                    <div className="value">{restaurant.aggregate_rating}</div>
                    <div className="value">{restaurant.rating_text}</div>
                  </div>
                </div>
              </TabPanel>
            </Tabs>
          </div>

          {this.state.showMenuModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="menu">
                  <h3>Menu </h3>

                  <button className="close-btn" onClick={this.closeMenuModal}>
                    Close
                  </button>
                </div>
                {this.state.menu.length === 0 ? (
                  <p>No menu available.</p>
                ) : (
                  <div>
                    <h3>Ordered Items:</h3>
                    <ul>
                      {this.state.menu.map((item, index) => {
                        const orderedItem = this.state.orderedItems.find(
                          (order) => order.name === item.name
                        ) || { quantity: 0 };
                        return (
                          <li key={index}>
                            <strong>{item.name}</strong> - ₹{item.price} x{" "}
                            {item.quantity}
                            <br />
                            <small>{item.description}</small>
                            <br />
                            <input
                              type="number"
                              min="1"
                              value={orderedItem.quantity}
                              onChange={(e) =>
                                this.updateQuantity(item, e.target.value)
                              }
                            />
                            <button onClick={() => this.handleOrder(item)}>
                              ➕ Add More
                            </button>
                            <button onClick={() => this.removeItem(item)}>
                              ➖ Remove
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="order">
                      <h3>
                        Total Ordered Items:
                        <input
                          type="number"
                          min="1"
                          value={totalOrderedItems}
                          readOnly
                          style={{ width: "100px", textAlign: "center" }}
                        />
                      </h3>

                      <h3>
                        Total Order Amount: ₹
                        <input
                          type="number"
                          min="1"
                          value={this.state.totalAmount}
                          readOnly
                          style={{ width: "100px", textAlign: "center" }}
                        />
                      </h3>
                    </div>
                    <button onClick={this.handlePayment} className="pay">
                      Confirm & Pay
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}
export default withLocation(Details);
