import React from "react";
import Axios from "axios";
import "../../css/auth.css";
import "bootstrap/dist/css/bootstrap.min.css";
import useForm from "./Form";
import validate from "../../validation-rules/LoginFormValidationRules";

const ResetPass = (props) => {
  const {
    resetPass,
    handleResetPassSubmit,
    handleResetPassChange,
    errors,
  } = useForm(resetPassFun, validate, props);

  function resetPassFun() {
    Axios.post(
      `https://project-management12.herokuapp.com/reset/${props.match.params.token}`,
      resetPass
    )
      .then((res) => {
        let msg = {
          msgContent: res.data.successMsg
            ? res.data.successMsg
            : res.data.errorMsg,
          state: res.data.state,
        };
        props.notifications(msg);
      })
      .catch((err) => {});
  }
  return (
    <div className="fr-password-container">
      <div className="password-form-container">
        <div className="fr-password-container2">
          <div className="password-form-title">
            <h2 className="mt-5">إستعادة كلمة المرور</h2>
          </div>

          <form
            className="password-form-width"
            onSubmit={handleResetPassSubmit}
          >
            <div>
              <div>
                <div className="profile-labels">
                  <label className="profile-labels" for="password">
                    كلمة المرور<span>*</span>
                  </label>
                </div>
                <input
                  className={`fr-password-input ${
                    errors.password && "profile-isDanger"
                  }`}
                  id="password"
                  name="password"
                  placeholder="********"
                  type="password"
                  onChange={handleResetPassChange}
                />
                <div>
                  {errors.password && (
                    <p className="user-profile-help">{errors.password}</p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <button type="submit" className="mb-5 formButton">
                حفظ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPass;
