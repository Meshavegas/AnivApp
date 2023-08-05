import React from "react";
import "./style.css";
const Loading = () => {
  return (
    <div className="w-full flex   justify-content-center align-items-center h-17rem">
      <div className="newtons-cradle">
        <div className="newtons-cradle__dot"></div>
        <div className="newtons-cradle__dot"></div>
        <div className="newtons-cradle__dot"></div>
        <div className="newtons-cradle__dot"></div>
      </div>
    </div>
  );
};

export default Loading;
