import React from "react";
import "../../App.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserAlt,
  faSignInAlt,
  faHome,
  faSearch,
  faListAlt,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = (props) => {
  return (
    <div className="myNavbar">
      <div className="myNav leftButtons">
        {props.isLogin ? (
          <Link to={props.user ? `/${props.user._id}/board` : "/signin"}>
            <button>
              <FontAwesomeIcon icon={faListAlt} className="navIcons" /> المشاريع
            </button>
          </Link>
        ) : (
          <Link to="/">
            <button>
              <FontAwesomeIcon icon={faHome} className="navIcons" /> الرئيسية
            </button>
          </Link>
        )}
      </div>

      <div className="myNav myLogo">
        <a className="logoAnchor">رتب مشروعك</a>
      </div>

      <div className="myNav rightButtons">
        {props.isLogin ? (
          <>
            <button onClick={props.logout}>خروج</button>
            <Link to={props.user ? `/${props.user._id}/profile` : "/signin"}>
              <button>
                <FontAwesomeIcon icon={faUserAlt} className="navIcons" />
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/signup">
              <button>سجل</button>
            </Link>
            <Link to="/signin">
              <button>تسجيل الدخول</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
