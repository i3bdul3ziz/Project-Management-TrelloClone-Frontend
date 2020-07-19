import React from "react";
import Axios from "axios";
import "../../css/auth.css";
import "bootstrap/dist/css/bootstrap.min.css";
import useForm from "./Form";
import validate from "../../validation-rules/LoginFormValidationRules";
import { Row, Col } from "react-bootstrap";

const Signup = (props) => {
  const { signup, handleChange, errors, handleSubmit } = useForm(
    login,
    validate,
    props
  );
  function login() {
    Axios.post("https://project-management12.herokuapp.com/signup", signup)
      .then((res) => {
        if (res.data.userInf) {
          let msg = {
            msgContent: "تم تسجيل حساب جديد بنجاح",
            state: "success",
          };
          props.notifications(msg);
          props.history.push("/signin");
        } else {
          let msg = {
            msgContent: "هذا البريد مستخدم من قبل",
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
            <h2 className="mt-5 sign-form-title">تسجيل</h2>
          </Row>
          <form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <input
                  className={`userInput ${errors.firstName && "isDanger"}`}
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="عبدالعزيز"
                  onChange={handleChange}
                />
                <label htmlFor="firstName">
                  الإسم الأول<span>*</span>
                </label>
                <Row>
                  {errors.firstName && (
                    <p className="help">{errors.firstName}</p>
                  )}
                </Row>
              </Col>
              <Col md={6}>
                <input
                  className="userInput"
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="الثقفي"
                  onChange={handleChange}
                />
                <label htmlFor="lastName">الإسم الأخير</label>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <input
                  className={`userInput-email userInput ${
                    errors.email && "isDanger"
                  }`}
                  id="email"
                  name="email"
                  type="text"
                  placeholder="example@example.com"
                  onChange={handleChange}
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
                  onChange={handleChange}
                />
                <label htmlFor="password">
                  كلمة المرور<span>*</span>
                </label>
                <Row>
                  {errors.password && <p className="help">{errors.password}</p>}
                </Row>
              </Col>
              <Col md={6}>
                <input
                  className={`userInput ${
                    errors.confirmPassword && "isDanger"
                  }`}
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="********"
                  onChange={handleChange}
                />
                <label htmlFor="confirmPassword">
                  تأكيد كلمة المرور<span>*</span>
                </label>
                <Row>
                  {errors.confirmPassword && (
                    <p className="help">{errors.confirmPassword}</p>
                  )}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <button type="submit" className="formButton">
                  سجل
                </button>
                <div className="pb-5 sign-form-account">
                  <p>
                    عندك حساب ؟<a href="/signin">دخول.</a>
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

export default Signup;
