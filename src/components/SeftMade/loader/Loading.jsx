import React from "react";
import "./style.css";
const Loading = () => {
  return (
    <div className="w-full flex   justify-center items-center">
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
