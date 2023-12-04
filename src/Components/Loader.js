import React from "react";
import "./UI/Loading.css";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="ld-ripple big">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
