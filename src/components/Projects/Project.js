import React from "react";
import DragNDropTasks from "./DragNDropTasks";
import "../../css/project.css";
import { Container } from "react-bootstrap";

const data = [
  {
    title: "البداية",
    items: ["1", "2"],
  },
];

const Project = (props) => {
  return (
    <>
      <Container className="listCon">
        <DragNDropTasks
          {...props}
          notifications={props.notifications}
          data={data}
        />
      </Container>
    </>
  );
};

export default Project;
