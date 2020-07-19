import React, { useState } from "react";
import Axios from "axios";
import { Row, Col } from "react-bootstrap";

function ProjectNav(props) {
  const [inviteUser, setInviteUser] = useState({});
  const [modalOpened, setModalOpened] = useState(false);

  let onSubmitHandler = (e) => {
    e.preventDefault();
    if (inviteUser.invite && inviteUser.havePermission) {
      Axios.post(
        `https://project-management12.herokuapp.com/projects/${props.user._id}/${props.match.params.projectId}/invite`,
        inviteUser,
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
          props.history.push(`/p/${props.match.params.projectId}`);
        })
        .catch((err) => {});
    } else {
      let msg = {
        msgContent: "يجب تعبئة جميع الحقول",
        state: "error",
      };
      props.notifications(msg);
    }
    handleCloseModal();
  };

  let onChangeHandler = ({ target: { name, value } }) => {
    setInviteUser({ ...inviteUser, [name]: value });
  };
  // When the user clicks the button, open the modal
  function handleModal() {
    document.getElementById("inviteNewUser").style.display = "block";
    setModalOpened(true);
  }

  // When the user clicks on <span> (x), close the modal
  function handleCloseModal() {
    document.getElementById("inviteNewUser").style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  if (modalOpened) {
    window.onclick = function (event) {
      if (event.target == document.getElementById("inviteNewUser")) {
        document.getElementById("inviteNewUser").style.display = "none";
        setModalOpened(false);
      }
    };
  }

  return (
    <>
      <div className="project-nav">
        <div className="float project-name">{props.project.projectName}</div>
        <div className="float separetor"> </div>
        {props.users.map((user, i) => (
          <>
            <div key={user._id} className="float project-users">
              {user.firstName}
            </div>
          </>
        ))}
        {props.havePermission && (
          <>
            <button onClick={handleModal} className="float invite-user-btn">
              دعوة
            </button>
            <div id="inviteNewUser" className="modal">
              <div className="modal-content">
                <button className="closeBoxBtn" onClick={handleCloseModal}>
                  <span className="close">&times;</span>
                </button>
                <form
                  onSubmit={(e) => {
                    onSubmitHandler(e);
                  }}
                >
                  <input
                    className="projectNameInput"
                    placeholder="ادخل البريد الإلكتروني للمستخدم فقط"
                    type="text"
                    name="invite"
                    onChange={onChangeHandler}
                  />
                  <div className="permissions">
                    <label>
                      إعطاء صلاحيات التعديل على هذا المشروع؟ <span>*</span>
                    </label>
                    <Row className="permissions-radio">
                      <Col md={6} className="permissions-col">
                        <input
                          id="true"
                          name="havePermission"
                          type="radio"
                          value="true"
                          onChange={onChangeHandler}
                        />
                        <label for="havePermission">نعم, إعطاء الصلاحيات</label>
                      </Col>
                      <Col md={6} className="permissions-col">
                        <input
                          id="false"
                          name="havePermission"
                          type="radio"
                          value="false"
                          onChange={onChangeHandler}
                        />
                        <label for="havePermission">لا</label>
                      </Col>
                    </Row>
                  </div>
                  <button className="projectNameBtn">تنفيذ الدعوة</button>
                </form>
              </div>
            </div>
          </>
        )}
        {/* <form>
          <input
            className="float invite-user-input"
            type="text"
            placeholder="دعوة للفريق"
          />
        </form> */}
      </div>
    </>
  );
}

export default ProjectNav;
