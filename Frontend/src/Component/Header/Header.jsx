import React from "react";
import "../../Styles/Header.css";
import { logo } from "../../assets/assets";
import Modal from "react-modal";
import { jwtDecode } from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      backgroundColor: "",
      display: "none",
      loginModalIsOpen: false,
      signupModalIsOpen: false,
      googleLoginError: null,
      user: null,
      isLoggedIn: false,
      loggedInUser: undefined,
    };
  }

  componentDidMount() {
    const path = window.location.pathname;
    this.setAttributes(path);
    Modal.setAppElement("#root");
  }

  setAttributes = (path) => {
    let bg, display;
    if (path === "/") {
      (bg = "#B6FFA1"), (display = "none");
    } else {
      (bg = "#D8E4E4"), (display = "inline-block");
    }
    this.setState({ backgroundColor: bg });
  };

  handleLogin = () => {
    this.setState({ loginModalIsOpen: true });
  };

  handleCancel = () => {
    this.setState({ loginModalIsOpen: false });
  };

  handleSignup = () => {
    this.setState({ signupModalIsOpen: true });
  };

  handleSignupCancel = () => {
    this.setState({ signupModalIsOpen: false });
  };

  handleLogout = () => {
    this.setState({ isLoggedIn: false, loggedInUser: undefined, user: null });
  };

  responseGoogle = (response) => {
    this.setState({
      isLoggedIn: true,
      loggedInUser: response.user.name,
      loginModalIsOpen: false,
    });
    if (response.error) {
      this.setState({ googleLoginError: response.error });
    } else {
      this.setState({ loginModalIsOpen: false, googleLoginError: null });
    }
  };

  handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const res = await fetch("http://localhost:5000/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      this.setState({
        loginModalIsOpen: false,
        googleLoginError: null,
        user: data,
        isLoggedIn: true,
        loggedInUser: data.name || decoded.name || decoded.email,
      });
    } catch (error) {
      console.error("Login failed:", error);
      this.setState({
        googleLoginError: "Google login failed",
        loginModalIsOpen: false,
      });
    }
  };

  handleGoogleLoginError = () => {
    this.setState({
      googleLoginError: "Google Login Failed",
      loginModalIsOpen: false,
    });
  };

  handleLoginSubmit = async () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        this.setState({
          isLoggedIn: true,
          loggedInUser: data.user.username,
          loginModalIsOpen: false,
        });
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  handleSignupSubmit = async () => {
    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    if (!username || !email || !password)
      return alert("All fields are required");

    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Account created! Please login.");
        this.setState({ signupModalIsOpen: false });
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  render() {
    const {
      backgroundColor,
      loginModalIsOpen,
      signupModalIsOpen,
      googleLoginError,
      loggedInUser,
      isLoggedIn,
    } = this.state;

    return (
      <>
        <div className="headerbor" style={{ backgroundColor: backgroundColor }}>
          <div className="logo-hed-m">
            <img className="logo-hed" src={logo} alt="Logo" />
          </div>
          <button
            className="home-button"
            onClick={() => (window.location.href = "/")}
          >
            Home
          </button>

          {!isLoggedIn ? (
            <div className="user-account">
              <button className="log" onClick={this.handleLogin}>
                Login
              </button>
              <button onClick={this.handleSignup}>Create an account</button>
            </div>
          ) : (
            <div className="user-account">
              <button className="log" onClick={this.handleLogin}>
                {loggedInUser}
              </button>
              <button onClick={this.handleLogout}>Log Out</button>
            </div>
          )}

          <Modal
            isOpen={loginModalIsOpen}
            onRequestClose={this.handleCancel}
            style={customStyles}
            contentLabel="Login Modal"
          >
            <h2>Login</h2>
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleLogin
                onSuccess={this.handleGoogleLoginSuccess}
                onError={this.handleGoogleLoginError}
                text="Continue with Google"
                useOneTap
              />
            </GoogleOAuthProvider>
            {googleLoginError && (
              <div style={{ color: "red", marginTop: "10px" }}>
                Error: {googleLoginError}
              </div>
            )}
            <div>
              <form>
                <input type="text" id="login-email" placeholder="Email" />
                <input
                  type="password"
                  id="login-password"
                  placeholder="Password"
                />
              </form>
              <div>
                <button onClick={this.handleLoginSubmit}>Login</button>

                <button onClick={this.handleCancel}>Cancel</button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={signupModalIsOpen}
            onRequestClose={this.handleSignupCancel}
            style={customStyles}
            contentLabel="Signup Modal"
          >
            <h2>Create Account</h2>
            <form id="signup-form">
              <input type="text" id="signup-username" placeholder="Username" />
              <input type="email" id="signup-email" placeholder="Email" />
              <input
                type="password"
                id="signup-password"
                placeholder="Password"
              />
            </form>
            <div>
              <button onClick={this.handleSignupSubmit}>Sign Up</button>

              <button onClick={this.handleSignupCancel}>Cancel</button>
            </div>
          </Modal>
        </div>
      </>
    );
  }
}

export default Header;
