import React from "react";
import Axios from "axios";
import jwt_decode from "jwt-decode";
import "../../css/auth.css";
import "bootstrap/dist/css/bootstrap.min.css";
import useForm from "./Form";
import validate from "../../validation-rules/LoginFormValidationRules";
import { Row, Col } from "react-bootstrap";

const Signin = (props) => {
  const { signin, handleSigninSubmit, handleSigninChange, errors } = useForm(
    login,
    validate,
    props
  );

  function login() {
    Axios.post("https://project-management12.herokuapp.com/signin", signin)
      .then((res) => {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          props.userSignin();
          let id = jwt_decode(res.data.token, "SECRET").user._id;
          let msg = {
            msgContent: "تم تسجيل الدخول بنجاح",
            state: "success",
          };
          props.notifications(msg);
          props.history.push(`/${id}/board`);
        } else {
          let msg = {
            msgContent: "البريد الإلكتروني او كلمة المرور غير صحيحة",
            state: "error",
          };
          props.notifications(msg);
        }
      })
      .catch((err) => {});
  }
  return (
    <div className="user-sign-container">
      <div className="sign-form-container">
        <div>
          <Row>
            <h2 className="mt-5 sign-form-title">دخول</h2>
          </Row>

          <form onSubmit={handleSigninSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <input
                  className={`userInput-email userInput ${
                    errors.email && "isDanger"
                  }`}
                  id="email"
                  name="email"
                  type="text"
                  placeholder="example@example.com"
                  onChange={handleSigninChange}
                />
                <label htmlFor="email">
                  البريد الإلكتروني<span>*</span>
                </label>
                <Row>
                  {errors.email && <p className="help">{errors.email}</p>}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <input
                  className={`userInput ${errors.password && "isDanger"}`}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  onChange={handleSigninChange}
                />
                <label htmlFor="password">
                  كلمة المرور<span>*</span>
                </label>
                <Row>
                  {errors.password && <p className="help">{errors.password}</p>}
                </Row>
              </Col>
            </Row>
            <Row className="sign-form-forgetpass">
              <Col>
                <p>
                  <a href="/forgetpassword">نسيت كلمة المرور؟</a>
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <button type="submit" className="formButton">
                  دخول
                </button>
                <div className="pb-5 sign-form-account">
                  <p>
                    ما عندك حساب ؟<a href="/signup">سجل</a> الحين!
                  </p>
                </div>
              </Col>
            </Row>
          </form>
        </div>
        <div className="formImage"></div>
      </div>
    </div>
  );
};

export default Signin;
