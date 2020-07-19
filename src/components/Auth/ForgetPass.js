import React from "react";
import Axios from "axios";
import "../../css/forgetAndReset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import useForm from "./Form";
import validate from "../../validation-rules/LoginFormValidationRules";

const ForgetPass = (props) => {
  const {
    forgetPass,
    handleForgetPassSubmit,
    handleForgetPassChange,
    errors,
  } = useForm(forgetPassFun, validate, props);

  function forgetPassFun() {
    Axios.post(
      "https://project-management12.herokuapp.com/forgetpass/",
      forgetPass
    )
      .then((res) => {
        let msg = {
          msgContent: res.data.successMsg
            ? res.data.successMsg
            : res.data.errorMsg,
          state: res.data.state,
        };
        props.notifications(msg);
        props.history.push("/forgetpassword");
      })
      .catch((err) => {});
  }
  return (
    <div className="fr-password-container">
      <div className="password-form-container">
        <div className="fr-password-container2">
          <div className="password-form-title">
            <h2 className="mt-5">نسيت كلمة المرور</h2>
          </div>

          <form
            className="password-form-width"
            onSubmit={handleForgetPassSubmit}
          >
            <div>
              <div>
                <div className="profile-labels">
                  <label htmlFor="email">البريد الإلكتروني</label>
                </div>
                <input
                  className={`fr-password-input ${
                    errors.email && "profile-isDanger"
                  }`}
                  id="email"
                  name="email"
                  type="text"
                  onChange={handleForgetPassChange}
                />
                <div>
                  {errors.email && (
                    <p className="user-profile-help">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <button type="submit" className="mb-5 formButton">
                إرسال
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPass;
