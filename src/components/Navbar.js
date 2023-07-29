import React from "react";
import { useNavigate } from "react-router-dom";

export default function Nav(props) {
  let navigate = useNavigate();

  return (
    <div className="nav">
      <h1 className="width-20">
        <span className="logo" onClick={() => navigate("/home")}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2991/2991106.png"
            width="35px"
            alt="logo"
          />{" "}
        </span>{" "}
        Document It
      </h1>
      {props.children}
    </div>
  );
}
