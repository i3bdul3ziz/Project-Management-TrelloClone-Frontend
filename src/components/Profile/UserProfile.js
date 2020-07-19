import React, { useEffect, useState } from "react";
import "../../css/profile.css";
import useForm from "../Auth/Form";
import Axios from "axios";
import validate from "../../validation-rules/LoginFormValidationRules";

const Profile = (props) => {
  const {
    editProfile,
    handleEditProfileSubmit,
    handleEditProfileChange,
    errors,
  } = useForm(login, validate, props);
  let [user, setUser] = useState({});
  let getUser = async (e) => {
    try {
      let data = await Axios.get(
        `https://project-management12.herokuapp.com/user/${props.match.params.id}/profile`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setUser(data.data.user);
    } catch (err) {}
  };

  function login() {
    Axios.put(
      `https://project-management12.herokuapp.com/user/${props.match.params.id}/profile/edit`,
      editProfile,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    )
      .then((res) => {
        let msg = {
          msgContent: res.data.successMsg
            ? res.data.successMsg
            : res.data.errorMsg,
          state: res.data.state,
        };
        props.notifications(msg);
        props.history.push("/signin");
      })
      .catch((err) => {});
  }

  useEffect(() => {
    getUser();
  }, [setUser]);
  return (
    <div className="user-profile-container">
      <div className="user-form-container">
        <h3>الملف الشخصي</h3>
        <form onSubmit={handleEditProfileSubmit}>
          <div className="user-inputs-con">
            <div className="profile-labels">
              <label htmlFor="firstName">الإسم الأول</label>
            </div>
            <input
              className={`profile-input ${
                errors.firstName && "profile-isDanger"
              }`}
              id="firstName"
              name="firstName"
              defaultValue={user.firstName}
              type="text"
              onChange={handleEditProfileChange}
            />
            <div>
              {errors.firstName && (
                <p className="user-profile-help">{errors.firstName}</p>
              )}
            </div>
          </div>
          <div className="user-inputs-con">
            <div className="profile-labels">
              <label htmlFor="lastName">الإسم الأخير</label>
            </div>
            <input
              className="profile-input"
              id="lastName"
              name="lastName"
              defaultValue={user.lastName ? user.lastName : ""}
              type="text"
              onChange={handleEditProfileChange}
            />
          </div>
          <div className="user-inputs-con">
            <div className="profile-labels">
              <label htmlFor="email">البريد الإلكتروني</label>
            </div>
            <input
              className={`profile-input ${errors.email && "profile-isDanger"}`}
              id="email"
              name="email"
              defaultValue={user.email}
              type="text"
              onChange={handleEditProfileChange}
            />
            <div>
              {errors.email && (
                <p className="user-profile-help">{errors.email}</p>
              )}
            </div>
          </div>
          <div className="user-inputs-con">
            <button type="submit" className="user-form-button">
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
