import { format } from "date-fns/esm";
import { Card } from "primereact/card";
import { Rating } from "primereact/rating";
import React from "react";

const TopSouhait = ({ m }) => {
  //   console.log(m);
  return (
    <Card
      key={new Date().toString}
      style={{
        margin: "1rem",
        justifyContent: "center",
      }}
      className="border-1 surface-border border-round m-2 text-center py-5 px-3"
      title={`${m.autheur} de ${m.ville}`}
    >
      <p
        className="m-2"
        style={{
          lineHeight: "1.5",
          fontSize: "1.2rem",
          height: "4.5em",
          overflow: "hidden",
        }}
      >
        {`${m.corp}`}
      </p>
      <p>
        <label
          style={{
            display: "flex",
            fontSize: "1.6rem",
            fontStyle: "italic",
          }}
        >
          Note :
          <Rating value={`${m.reaction}`} cancel={false} stars={5} />
        </label>
      </p>
      <p style={{ textAlign: "right" }}>
        {format(new Date(m.date.seconds * 1000), "dd-MMMM-yyyy a H:m:s")}
      </p>
    </Card>
  );
};

export default TopSouhait;
