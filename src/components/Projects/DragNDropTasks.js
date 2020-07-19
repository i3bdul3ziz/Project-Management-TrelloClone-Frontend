import React, { useState, useRef, useEffect } from "react";
import Axios from "axios";
import ProjectNav from "./ProjectNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrashAlt,
  faEllipsisH,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import jwt_decode from "jwt-decode";

function DragNDropTasks(props) {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [project, setProject] = useState({});
  const [newGroup, setNewGroup] = useState({});
  const [newTask, setNewTask] = useState("");
  const [dragging, setDragging] = useState(false);
  const [groupIndex, setGroupIndex] = useState(null);
  const [taskIndex, setTaskIndex] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEdittingTask, setIsEdittingTask] = useState(false);
  const [editedTask, setEditedTask] = useState({});
  const [listActions, setListAction] = useState("إعدادات القائمة");
  const [groupIMenu, setGroupIMenu] = useState(null);
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [havePermission, setHavePermission] = useState(false);
  const dragItem = useRef();
  const dragNode = useRef();
  const prevGroupIRef = useRef();

  let getLists = async (e) => {
    try {
      let data = await Axios.get(
        `https://project-management12.herokuapp.com/projects/${props.user._id}/${props.match.params.projectId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      let token = localStorage.token;
      let signUser = jwt_decode(token, "SECRET").user;
      setProject(data.data.project);
      setList(data.data.project.cards);
      setLoading(true);
      let length = signUser.projects.length;
      for (let i = 0; i < length; i++) {
        if (signUser.projects[i].project._id == props.match.params.projectId) {
          setHavePermission(signUser.projects[i].havePermission);
        }
      }
    } catch (err) {}
  };

  const handleDragStart = (e, params) => {
    dragItem.current = params;
    dragNode.current = e.target;
    dragNode.current.addEventListener("dragend", handleDragEnd);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnd = () => {
    setDragging(false);
    dragNode.current.removeEventListener("dragend", handleDragEnd);
    dragItem.current = null;
    dragNode.current = null;
  };

  const handleDragEnter = (e, params) => {
    e.preventDefault();
    e.stopPropagation();
    const currentItem = dragItem.current;

    if (e.target !== dragNode.current) {
      setList((oldList) => {
        let newList = JSON.parse(JSON.stringify(oldList));
        newList[params.grpI].items.splice(
          params.itemI,
          0,
          newList[currentItem.grpI].items.splice(currentItem.itemI, 1)[0]
        );
        dragItem.current = params;
        localStorage.setItem("lists", JSON.stringify(newList));

        return newList;
      });
    }
    let updatedList = { lists: localStorage.getItem("lists") };
    Axios.put(
      `https://project-management12.herokuapp.com/projects/${props.user._id}/${props.match.params.projectId}`,
      updatedList,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    )
      .then((res) => {})
      .catch((err) => {});
  };

  let handleMouseEnter = (e, { grpI, itemI }) => {
    document.getElementById(`editTask${grpI}${itemI}`).style.display = "block";
    document.getElementById(`deleteTask${grpI}${itemI}`).style.display =
      "block";
  };

  let handleMouseLeave = (e, { grpI, itemI }) => {
    document.getElementById(`editTask${grpI}${itemI}`).style.display = "none";
    document.getElementById(`deleteTask${grpI}${itemI}`).style.display = "none";
  };
  let handleButtonClick = (e, grp, grpI) => {
    if (isEdittingTask === true && groupIndex !== null && taskIndex !== null) {
      document.getElementById(
        `editTaskForm${groupIndex}${taskIndex}`
      ).style.display = "none";
      document.getElementById(
        `dnd-item${groupIndex}${taskIndex}`
      ).style.display = "block";
      setIsEdittingTask(false);
    }
    if (groupIndex !== null) {
      document.getElementById(`addTaskButton${groupIndex}`).style.display =
        "block";
      document.getElementById(`addTaskContainer${groupIndex}`).style.display =
        "none";
    }
    document.getElementById(`addTaskButton${grpI}`).style.display = "none";
    document.getElementById(`addTaskContainer${grpI}`).style.display = "block";
    setIsAddingTask(true);
    setGroupIndex(grpI);
  };

  let handleNewGroupButton = () => {
    document.getElementById("newGroupButton").style.display = "none";
    document.getElementById("newGroupForm").style.display = "inline";
  };

  const handleChangeNewTask = (e) => {
    setNewTask({
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitNewTask = (e, group) => {
    e.preventDefault();
    if (newTask !== "" && newTask !== null) {
      let newListCreator = list;
      newListCreator[group].items.push(newTask);
      setList([...newListCreator]);
      Axios.put(
        `https://project-management12.herokuapp.com/projects/${props.user._id}/${props.match.params.projectId}/${group}`,
        newTask,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      )
        .then((res) => {
          props.history.push(`/p/${props.match.params.projectId}`);
        })
        .catch((err) => {});
      e.target.reset();
    } else {
      let msg = {
        msgContent: "يجب ان تحتوي المهمة على نص",
        state: "error",
      };
      props.notifications(msg);
    }
  };

  let handleEditTask = (e) => {
    setEditedTask({ [e.target.name]: e.target.value });
  };

  let handleSubmitEditedTask = (e, grpI, itemI) => {
    e.preventDefault();
    if (editedTask !== "" && editedTask !== null) {
      let newListCreator = list;
      newListCreator[grpI].items[itemI].taskTitle = editedTask.editTaskTitle;
      setList([...newListCreator]);
      Axios.put(
        `https://project-management12.herokuapp.com/projects/${props.user._id}/${props.match.params.projectId}/${grpI}/${itemI}`,
        editedTask,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      )
        .then((res) => {
          props.history.push(`/p/${props.match.params.projectId}`);
        })
        .catch((err) => {});
      e.target.reset();
      document.getElementById(`editTaskForm${grpI}${itemI}`).style.display =
        "none";
      document.getElementById(`dnd-item${grpI}${itemI}`).style.display =
        "block";
    } else {
      let msg = {
        msgContent: "يجب ان تحتوي المهمة على نص",
        state: "error",
      };
      props.notifications(msg);
    }
  };

  let handleDeleteTask = (e, grpI, itemI) => {
    e.preventDefault();
    let newListCreator = list;
    newListCreator[grpI].items.splice(itemI, 1);
    setList([...newListCreator]);
    Axios.put(
      `https://project-management12.herokuapp.com/projects/${props.user._id}/${props.match.params.projectId}/${grpI}/${itemI}/task/del`,
      list,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    )
      .then((res) => {
        console.log(res);
        props.history.push(`/p/${props.match.params.projectId}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeNewGroup = (e) => {
    setNewGroup({
      [e.target.name]: e.target.value,
      items: [],
    });
  };

  const handleSubmitNewGroup = (e) => {
    e.preventDefault();
    if (newGroup.title && newGroup !== null) {
      setList((prevState) => [...prevState, newGroup]);
      Axios.post(
        `https://project-management12.herokuapp.com/projects/${props.user._id}/${props.match.params.projectId}`,
        newGroup,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      )
        .then((res) => {
          props.history.push(`/p/${props.match.params.projectId}`);
        })
        .catch((err) => {});
      setNewGroup({});
    } else {
      let msg = {
        msgContent: "يجب ان تحتوي القائمة على نص",
        state: "error",
      };
      props.notifications(msg);
    }
  };

  let handleOpenMenu = (e, grpI) => {
    const element = document.getElementById(`group-menu${grpI}`);
    if (element.classList.contains("hide")) {
      element.classList.remove("hide");
      setIsMenuOpened(true);
      setGroupIMenu(grpI);
      prevGroupIRef.current = groupIMenu;
    } else {
      element.classList.add("hide");
      setIsMenuOpened(false);
    }
  };

  let handleMenuItems = (e, grpI) => {
    if (e.target.name === "move-all-items") {
      setListAction("نقل جميع المهام إلى قائمة أخرى");

      document.getElementById(
        `group-menu-items-container${grpI}`
      ).style.display = "none";
      document.getElementById(
        `group-menu-lists-container${grpI}`
      ).style.display = "block";
      document.getElementById(`back-menu-icon${grpI}`).style.display = "block";
    }

    if (e.target.name === "delete-all-items") {
      setListAction("حذف جميع المهام من القائمة");

      document.getElementById(
        `group-menu-items-container${grpI}`
      ).style.display = "none";
      document.getElementById(
        `group-menu-delete-tasks-container${grpI}`
      ).style.display = "block";
      document.getElementById(`back-menu-icon${grpI}`).style.display = "block";
    }

    if (e.target.name === "delete-list") {
      setListAction("حذف القائمة");

      document.getElementById(
        `group-menu-items-container${grpI}`
      ).style.display = "none";
      document.getElementById(
        `group-menu-delete-list-container${grpI}`
      ).style.display = "block";
      document.getElementById(`back-menu-icon${grpI}`).style.display = "block";
    }
  };

  let handleMoveTasks = (e, grpI, getGroupTitleI) => {
    e.preventDefault();
    let newList = list;
    let arrLength = newList[grpI].items.length;
    newList[grpI].items.map((groupTask) => {
      newList[getGroupTitleI].items.push(groupTask);
    });
    newList[grpI].items.splice(0, arrLength);
    setList([...newList]);
    Axios.put(
      `https://project-management12.herokuapp.com/projects/${props.user._id}/${props.match.params.projectId}/${grpI}/${getGroupTitleI}/moveall`,
      list,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    )
      .then((res) => {
        props.history.push(`/p/${props.match.params.projectId}`);
      })
      .catch((err) => {});
    handleGoBackIcon(e, grpI);
    handleCloseMenu(grpI);
  };

  let handleDeleteAllTasks = (e, grpI) => {
    e.preventDefault();
    let newList = list;
    let arrLength = newList[grpI].items.length;
    newList[grpI].items.splice(0, arrLength);
    setList([...newList]);

    Axios.put(
      `https://project-management12.herokuapp.com/projects/${props.user._id}/${props.match.params.projectId}/${grpI}/tasks/delall`,
      list,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    )
      .then((res) => {
        props.history.push(`/p/${props.match.params.projectId}`);
      })
      .catch((err) => {});
    handleGoBackIcon(e, grpI);
    handleCloseMenu(grpI);
  };

  let handleDeleteList = (e, grpI) => {
    e.preventDefault();
    let newList = list;
    newList.splice(grpI, 1);
    setList([...newList]);
    Axios.put(
      `https://project-management12.herokuapp.com/projects/${props.user._id}/${props.match.params.projectId}/${grpI}/list/delList`,
      list,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    )
      .then((res) => {
        props.history.push(`/p/${props.match.params.projectId}`);
      })
      .catch((err) => {});
    handleGoBackIcon(e, grpI);
    handleCloseMenu(grpI);
  };

  const getStyles = (params) => {
    const currentItem = dragItem.current;
    if (
      currentItem.grpI === params.grpI &&
      currentItem.itemI === params.itemI
    ) {
      return "current dnd-item";
    }
    return "dnd-item";
  };

  if (groupIndex != null) {
    window.onclick = function (event) {
      if (
        event.target !==
          document.getElementById(`addTaskContainer${groupIndex}`) &&
        event.target !==
          document.getElementById(`taskTitleInput${groupIndex}`) &&
        event.target !== document.getElementById(`taskTitleButton${groupIndex}`)
      ) {
        document.getElementById(`addTaskContainer${groupIndex}`).style.display =
          "none";
        document.getElementById(`addTaskButton${groupIndex}`).style.display =
          "block";
        setIsAddingTask(false);
      }
    };
  }

  if (isEdittingTask === true) {
    window.onclick = function (event) {
      if (
        event.target !== document.getElementById(`editTaskForm${groupIndex}`) &&
        event.target !==
          document.getElementById(`editTaskInput${groupIndex}${taskIndex}`) &&
        event.target !==
          document.getElementById(`editTaskButton${groupIndex}${taskIndex}`)
      ) {
        document.getElementById(
          `editTaskForm${groupIndex}${taskIndex}`
        ).style.display = "none";
        document.getElementById(
          `dnd-item${groupIndex}${taskIndex}`
        ).style.display = "block";
        setIsEdittingTask(false);
      }
    };
  }

  if (isMenuOpened === true) {
    const prevGroupIMenu = prevGroupIRef.current;
    let prevElement = document.getElementById(`group-menu${prevGroupIMenu}`);
    window.onclick = function (event) {
      if (groupIMenu !== null && groupIMenu !== prevGroupIMenu) {
        if (prevGroupIMenu !== null && prevElement !== null) {
          prevElement.classList.add("hide");
        }
      }
    };
  }

  let handleCloseModal = (grpI) => {
    document.getElementById(`addTaskContainer${grpI}`).style.display = "none";
    document.getElementById(`addTaskButton${grpI}`).style.display = "block";
    setIsAddingTask(false);
  };

  let handleCloseGroupModal = () => {
    document.getElementById("newGroupForm").style.display = "none";
    document.getElementById("newGroupButton").style.display = "block";
  };

  let handleCloseMenu = (grpI) => {
    const element = document.getElementById(`group-menu${grpI}`);
    element.classList.add("hide");
    setIsMenuOpened(false);
  };

  let handleGoBackIcon = (e, grpI) => {
    let titleLists = document.getElementById(
      `group-menu-lists-container${grpI}`
    );
    let deleteAllTasks = document.getElementById(
      `group-menu-delete-tasks-container${grpI}`
    );

    let deleteList = document.getElementById(
      `group-menu-delete-list-container${grpI}`
    );

    if (titleLists.style.display !== "none") {
      setListAction("إعدادات القائمة");

      document.getElementById(
        `group-menu-items-container${grpI}`
      ).style.display = "block";
      titleLists.style.display = "none";
      document.getElementById(`back-menu-icon${grpI}`).style.display = "none";
    }

    if (deleteAllTasks.style.display !== "none") {
      setListAction("إعدادات القائمة");

      document.getElementById(
        `group-menu-items-container${grpI}`
      ).style.display = "block";
      deleteAllTasks.style.display = "none";
      document.getElementById(`back-menu-icon${grpI}`).style.display = "none";
    }

    if (deleteList.style.display !== "none") {
      setListAction("إعدادات القائمة");

      document.getElementById(
        `group-menu-items-container${grpI}`
      ).style.display = "block";
      deleteList.style.display = "none";
      document.getElementById(`back-menu-icon${grpI}`).style.display = "none";
    }
  };

  useEffect(() => {
    getLists();
  }, [setNewGroup, setList]);

  return (
    <>
      {loading && (
        <>
          <ProjectNav
            {...props}
            user={props.user}
            users={project.users}
            project={project}
            havePermission={havePermission}
            notifications={props.notifications}
          />
          <div className="drag-n-drop">
            {list &&
              list.map((grp, grpI) => (
                <>
                  <div
                    key={grp.title}
                    onDragEnter={
                      havePermission && dragging && !grp.items.length
                        ? (e) => {
                            handleDragEnter(e, { grpI, itemI: 0 });
                          }
                        : null
                    }
                    className="dnd-group"
                  >
                    <div className="group-title">
                      {grp.title}
                      {havePermission && (
                        <>
                          <button
                            id={`groupMenu${grpI}`}
                            className="controlGroup"
                            onClick={(e) => {
                              handleOpenMenu(e, grpI);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faEllipsisH}
                              className="task-icon-style"
                            />
                          </button>
                          <div
                            id={`group-menu${grpI}`}
                            className="group-menu hide"
                          >
                            <div
                              id={`group-menu-header${grpI}`}
                              className="group-menu-header"
                            >
                              <button
                                onClick={(e) => {
                                  handleCloseMenu(grpI);
                                }}
                                className="menu-icons close-menu-icon"
                              >
                                <span className="close-menu-span">&times;</span>
                              </button>
                              <button
                                id={`back-menu-icon${grpI}`}
                                className="menu-icons hide"
                                onClick={(e) => {
                                  handleGoBackIcon(e, grpI);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faChevronLeft}
                                  className="back-menu-span"
                                />
                              </button>
                              <p id={`menu-title${grpI}`}>{listActions}</p>
                            </div>
                            <hr className="group-menu-hr"></hr>
                            <div
                              id={`group-menu-delete-tasks-container${grpI}`}
                              className="middle hide"
                            >
                              <div
                                id={`group-menu-delete-tasks${grpI}`}
                                className="group-menu-items"
                              >
                                <p className="pContainer">
                                  "هل انت متأكد من رغبتك في حذف جميع المهام في
                                  هذي القائمة؟ إذا كنت متأكد اضغط على زر حذف."
                                </p>

                                <button
                                  onClick={(e) => {
                                    handleDeleteAllTasks(e, grpI);
                                  }}
                                  className="editTaskTitleBtn warnning"
                                >
                                  حذف
                                </button>
                              </div>
                            </div>

                            <div
                              id={`group-menu-delete-list-container${grpI}`}
                              className="middle hide"
                            >
                              <div
                                id={`group-menu-delete-list${grpI}`}
                                className="group-menu-items"
                              >
                                <p className="pContainer">
                                  "هل انت متأكد من رغبتك في حذف هذي القائمة؟ إذا
                                  كنت متأكد اضغط على زر حذف."
                                </p>
                                <button
                                  onClick={(e) => {
                                    handleDeleteList(e, grpI);
                                  }}
                                  className="editTaskTitleBtn warnning"
                                >
                                  حذف
                                </button>
                              </div>
                            </div>
                            <div
                              id={`group-menu-lists-container${grpI}`}
                              className="hide"
                            >
                              {list.map((getGroupTitle, getGroupTitleI) => (
                                <div
                                  id={`group-menu-lists-titles${grpI}`}
                                  className="group-menu-items"
                                  key={`group-menu-items${getGroupTitleI}`}
                                >
                                  {getGroupTitle.title === grp.title ? (
                                    <button
                                      className="group-menu-items-btn dis"
                                      disabled
                                    >
                                      {getGroupTitle.title}
                                      {"  "}(الحالية)
                                    </button>
                                  ) : (
                                    <button
                                      id={`group-menu-items-btn${getGroupTitleI}`}
                                      className="group-menu-items-btn"
                                      onClick={(e) => {
                                        handleMoveTasks(
                                          e,
                                          grpI,
                                          getGroupTitleI
                                        );
                                      }}
                                    >
                                      {getGroupTitle.title}
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                            <div id={`group-menu-items-container${grpI}`}>
                              <div className="group-menu-items">
                                <button
                                  name="move-all-items"
                                  onClick={(e) => {
                                    handleMenuItems(e, grpI);
                                  }}
                                  className="group-menu-items-btn"
                                >
                                  نقل جميع المهام إلى قائمة أخرى
                                </button>
                              </div>
                              <div className="group-menu-items">
                                <button
                                  name="delete-all-items"
                                  onClick={(e) => {
                                    handleMenuItems(e, grpI);
                                  }}
                                  className="group-menu-items-btn"
                                >
                                  حذف جميع المهام من القائمة
                                </button>
                              </div>
                              <hr
                                id="group-menu-hr"
                                className="group-menu-hr"
                              ></hr>
                              <div className="group-menu-items">
                                <button
                                  name="delete-list"
                                  onClick={(e) => {
                                    handleMenuItems(e, grpI);
                                  }}
                                  className="group-menu-items-btn"
                                >
                                  حذف القائمة
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    {grp.items &&
                      grp.items.map((item, itemI) => (
                        <>
                          <div
                            draggable={havePermission}
                            onDragStart={
                              havePermission
                                ? (e) => {
                                    handleDragStart(e, { grpI, itemI });
                                  }
                                : null
                            }
                            onDragEnter={
                              havePermission && dragging
                                ? (e) => {
                                    handleDragEnter(e, { grpI, itemI });
                                  }
                                : null
                            }
                            onMouseEnter={
                              havePermission
                                ? (e) => {
                                    handleMouseEnter(e, { grpI, itemI });
                                  }
                                : null
                            }
                            onMouseLeave={
                              havePermission
                                ? (e) => {
                                    handleMouseLeave(e, { grpI, itemI });
                                  }
                                : null
                            }
                            key={`${item}_${itemI}`}
                            id={`dnd-item${grpI}${itemI}`}
                            className={
                              dragging ? getStyles({ grpI, itemI }) : "dnd-item"
                            }
                          >
                            {havePermission && (
                              <>
                                <button
                                  id={`editTask${grpI}${itemI}`}
                                  className="controlTask edit-task-btn-style"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    document.getElementById(
                                      `dnd-item${grpI}${itemI}`
                                    ).style.display = "none";
                                    document.getElementById(
                                      `editTaskForm${grpI}${itemI}`
                                    ).style.display = "block";
                                    if (
                                      isAddingTask === true &&
                                      groupIndex !== null
                                    ) {
                                      document.getElementById(
                                        `addTaskButton${groupIndex}`
                                      ).style.display = "block";
                                      document.getElementById(
                                        `addTaskContainer${groupIndex}`
                                      ).style.display = "none";
                                    }
                                    if (
                                      isEdittingTask === true &&
                                      groupIndex !== null &&
                                      taskIndex !== null
                                    ) {
                                      document.getElementById(
                                        `editTaskForm${groupIndex}${taskIndex}`
                                      ).style.display = "none";
                                      document.getElementById(
                                        `dnd-item${groupIndex}${taskIndex}`
                                      ).style.display = "block";
                                    }
                                    setIsEdittingTask(true);
                                    setGroupIndex(grpI);
                                    setTaskIndex(itemI);
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faPencilAlt}
                                    className="task-icon-style"
                                  />
                                </button>
                                <button
                                  id={`deleteTask${grpI}${itemI}`}
                                  className="controlTask delete-task-btn-style"
                                  onClick={(e) => {
                                    handleDeleteTask(e, grpI, itemI);
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faTrashAlt}
                                    className="task-icon-style"
                                  />
                                </button>
                              </>
                            )}
                            {item.taskTitle}
                          </div>
                          {havePermission && (
                            <>
                              <form
                                id={`editTaskForm${grpI}${itemI}`}
                                onSubmit={(e) => {
                                  handleSubmitEditedTask(e, grpI, itemI);
                                }}
                                className="hide"
                              >
                                <input
                                  id={`editTaskInput${grpI}${itemI}`}
                                  className="edit-task-input"
                                  type="text"
                                  name="editTaskTitle"
                                  placeholder="تعديل عنوان المهمة"
                                  defaultValue={item.taskTitle}
                                  onChange={handleEditTask}
                                />
                                <button
                                  id={`editTaskButton${grpI}${itemI}`}
                                  className="editTaskTitleBtn"
                                >
                                  حفظ
                                </button>
                              </form>
                            </>
                          )}
                        </>
                      ))}
                    {havePermission && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleButtonClick(e, grp, grpI);
                          }}
                          id={`addTaskButton${grpI}`}
                          className="addNewTaskBtn"
                        >
                          إضافة مهمة جديدة
                        </button>
                        <div
                          id={`addTaskContainer${grpI}`}
                          className="addTaskForm"
                        >
                          <form
                            onSubmit={(e) => {
                              handleSubmitNewTask(e, grpI);
                            }}
                            className="form-inline"
                          >
                            <input
                              id={`taskTitleInput${grpI}`}
                              className="taskTitleInput"
                              type="text"
                              name="taskTitle"
                              placeholder="مهمة جديدة"
                              onChange={handleChangeNewTask}
                            />
                            <button
                              className="taskTitleButton"
                              type="submit"
                              id={`taskTitleButton${grpI}`}
                            >
                              إضافة
                            </button>
                          </form>
                          <button
                            className="closeBoxBtn1"
                            onClick={(e) => {
                              handleCloseModal(grpI);
                            }}
                          >
                            <span className="close">&times;</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ))}
            {havePermission && (
              <>
                <div id="newGroupContainer" className="newGroupForm">
                  <button
                    onClick={(e) => {
                      handleNewGroupButton(e);
                    }}
                    id="newGroupButton"
                    className="addNewTaskBtn"
                  >
                    إضافة قائمة جديدة
                  </button>
                  <div id="newGroupForm" className="hide">
                    <form className="form-inline">
                      <input
                        className="taskTitleInput"
                        type="text"
                        name="title"
                        value={newGroup.title ? newGroup.title : ""}
                        placeholder="قائمة جديدة"
                        onChange={handleChangeNewGroup}
                      />
                      <button
                        className="taskTitleButton"
                        onClick={(e) => {
                          handleSubmitNewGroup(e);
                        }}
                        type="submit"
                      >
                        إضافة
                      </button>
                    </form>
                    <button
                      className="closeBoxBtn1"
                      onClick={(e) => {
                        handleCloseGroupModal();
                      }}
                    >
                      <span className="close">&times;</span>
                    </button>
                  </div>
                </div>
              </>
            )}
            {!list.length && havePermission === false ? (
              <div className="no-lists-div">لم يتم إنشاء قوائم بعد</div>
            ) : null}
          </div>
        </>
      )}
    </>
  );
}

export default DragNDropTasks;
