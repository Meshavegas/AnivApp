import React from "react";
import CardPost from "./CardPost";

const GroupPost = ({ mesg }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {mesg &&
        mesg.items.map((m, index) => {
          return <CardPost key={index} m={m} />;
        })}
    </div>
  );
};

export default GroupPost;
