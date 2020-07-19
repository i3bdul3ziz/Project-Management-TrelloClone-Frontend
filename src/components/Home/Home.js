import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../css/board.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

const Board = (props) => {
  const [selected, setSelected] = useState(true);
  let handleNotification = () => {
    if (props.user === null) {
      let msg = {
        msgContent: "يجب تسجيل الدخول أولا للوصول لهذه الصفحة",
        state: "error",
      };
      props.notifications(msg);
    }
  };
  return (
    <>
      <Container className="mt-5">
        <div className="p-3 grid-view">
          <div>
            <ul className="ul-style">
              <li>
                <Link to={props.user ? `/${props.user._id}/board` : "/signin"}>
                  <button
                    onClick={handleNotification}
                    className="menuParagraph"
                  >
                    لوحة المشاريع
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/">
                  <button className={selected ? "selected" : "menuParagraph"}>
                    الرئيسية
                  </button>
                </Link>
              </li>
            </ul>
          </div>
          <div className="mr-3">
            <div className="header-container">
              <h3 className="board-header">الرئيسية</h3>
            </div>
            <div>
              <div className="message-container">
                <h4 className="message-title">رسالة تعريفية : </h4>
                <p className="message-content">
                  رتب مشروعك هو تطبيق لإدارة و اتمام مهام المشاريع والتحكم
                  الكامل بالمهام و القوائم وامكانية دعوة اشخاص اخرين لنفس
                  المشروع, الموقع كامل باللغة العربية و هو شبيه جدا لتطبيق
                  (Trello) ,تم العمل على هذا المشروع لتطوير المهارات و التدريب
                  فقط , وتم تطويره من الصفر حتى هذه النقطة بواسطتي انا أخوكم
                  عبدالعزيز الثقفي. شكرا :)
                </p>
                <p className="message-content">للتواصل تحصلني هنا :</p>
                <p className="message-content">
                  <a
                    className="anchor"
                    href="https://www.linkedin.com/in/abdulaziz-al-thagafi/"
                  >
                    <FontAwesomeIcon icon={faLinkedin} className="linkedin" />
                  </a>
                  <a className="anchor" href="https://github.com/i3bdul3ziz">
                    <FontAwesomeIcon icon={faGithub} className="github" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Board;
