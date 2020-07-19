import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import jwt_decode from "jwt-decode";
import Navbar from "./components/Navbar/Navbar";
import Signin from "./components/Auth/Signin";
import Signup from "./components/Auth/Signup";
import ForgetPass from "./components/Auth/ForgetPass";
import ResetPass from "./components/Auth/ResetPass";
import Board from "./components/Board/Board";
import Project from "./components/Projects/Project";
import Profile from "./components/Profile/UserProfile";
import Home from "./components/Home/Home";
function App(props) {
  const [notifyMsg, setNotifyMsg] = useState({});
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userSignin();
    return () => {};
  }, []);

  let userSignin = () => {
    if (localStorage.token) {
      let token = localStorage.token;
      let signUser = jwt_decode(token, "SECRET").user;
      setUser(signUser);
      setIsLogin(true);
      setLoading(true);
    } else {
      setUser(null);
      setIsLogin(false);
      setLoading(true);
    }
  };

  let notifications = (msg) => {
    setNotifyMsg(msg);
    setTimeout(() => {
      document.getElementById("notification-message").classList.add("fadeout");
    }, 3000);
    setTimeout(() => {
      setNotifyMsg({});
      document
        .getElementById("notification-message")
        .classList.remove("fadeout");
    }, 5000);
  };

  let logout = () => {
    localStorage.removeItem("token");
    if (localStorage.lists) localStorage.removeItem("lists");
    setUser(null);
    setIsLogin(false);
  };
  return (
    <>
      <Navbar
        logout={logout}
        isLogin={isLogin}
        userSignin={userSignin}
        user={user}
      />
      {notifyMsg ? (
        <p
          id="notification-message"
          className={
            notifyMsg.state === "success" ? "success-message" : "error-message"
          }
        >
          {notifyMsg.msgContent}
        </p>
      ) : null}
      {loading && (
        <Switch>
          <Route
            path="/signin"
            render={(props) => (
              <Signin
                {...props}
                userSignin={userSignin}
                notifications={notifications}
                isLogin={isLogin}
              />
            )}
          />
          <Route
            path="/forgetpassword"
            render={(props) => (
              <ForgetPass {...props} notifications={notifications} />
            )}
          />
          <Route
            path="/reset/:token"
            render={(props) => <ResetPass {...props} />}
          />
          <Route
            exact
            path="/"
            render={(props) => (
              <Home {...props} user={user} notifications={notifications} />
            )}
          />
          <Route
            path="/signup"
            render={(props) => (
              <Signup {...props} notifications={notifications} />
            )}
          />
          {user ? (
            <>
              <Route
                exact
                path="/:id/board"
                render={(props) => (
                  <Board {...props} notifications={notifications} user={user} />
                )}
              />
              <Route
                exact
                path="/:id/profile"
                render={(props) => (
                  <Profile
                    {...props}
                    notifications={notifications}
                    user={user}
                  />
                )}
              />
              <Route
                exact
                path="/p/:projectId"
                render={(props) => (
                  <Project
                    {...props}
                    notifications={notifications}
                    user={user}
                  />
                )}
              />
            </>
          ) : (
            <Redirect to="/signup" />
          )}
        </Switch>
      )}
    </>
  );
}

export default App;
