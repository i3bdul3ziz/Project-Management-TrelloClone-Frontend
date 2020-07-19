import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import "../../css/board.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";

const Board = (props) => {
  const [newProject, setNewProject] = useState({});
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(true);

  let getProjects = async (e) => {
    try {
      let data = await Axios.get(
        `https://project-management12.herokuapp.com/projects/${props.match.params.id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setProjects(data.data.projects);
      localStorage.setItem("token", data.data.newToken);
    } catch (err) {}
  };

  let onChangeHandler = ({ target: { name, value } }) => {
    setNewProject({ ...newProject, [name]: value });
  };

  let onSubmitHandler = (e) => {
    Axios.post(
      `https://project-management12.herokuapp.com/projects/${props.match.params.id}`,
      newProject,
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
        props.history.push(`/${props.user._id}/board`);
      })
      .catch((err) => {});
  };

  // When the user clicks the button, open the modal
  function handleModal() {
    document.getElementById("createProjectBox").style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  function handleCloseModal() {
    document.getElementById("createProjectBox").style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == document.getElementById("createProjectBox")) {
      document.getElementById("createProjectBox").style.display = "none";
    }
  };

  useEffect(() => {
    getProjects();
  }, [setProjects]);

  return (
    <>
      <Container className="mt-5">
        <div className="p-3 grid-view">
          <div>
            <ul className="ul-style">
              <li>
                <Link to={`/${props.user._id}/board`}>
                  <button className={selected ? "selected" : "menuParagraph"}>
                    لوحة المشاريع
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/">
                  <button className="menuParagraph">الرئيسية</button>
                </Link>
              </li>
            </ul>
          </div>
          <div className="mr-3">
            <div className="header-container">
              <h3 className="board-header">لوحة المشاريع</h3>
            </div>
            <div>
              {projects ? (
                projects.map((project, i) => (
                  <div>
                    <Link to={`/p/${project.project._id}`}>
                      <button className="projectCard">
                        {project.project.projectName}
                      </button>
                    </Link>
                  </div>
                ))
              ) : (
                <div></div>
              )}
              <div>
                <button onClick={handleModal} className="createProjectCard">
                  مشروع جديد
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div id="createProjectBox" className="modal">
        <div className="modal-content">
          <button className="closeBoxBtn" onClick={handleCloseModal}>
            <span className="close">&times;</span>
          </button>
          <form onSubmit={onSubmitHandler}>
            <input
              className="projectNameInput"
              placeholder="اسم المشروع"
              type="text"
              name="projectName"
              onChange={onChangeHandler}
            />
            <button className="projectNameBtn">إنشاء</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Board;
