import { Card } from "primereact/card";
import { Rating } from "primereact/rating";
import React from "react";
import { format } from "date-fns/esm";

const CardPost = ({ m }) => {
  return (
    <Card
      key={new Date().toString}
      title={`${m.autheur} de ${m.ville}`}
      className="md:w-4 mx-3 my-3 w-full"
    >
      <p
        className="m-2"
        style={{
          lineHeight: "1.5",
          fontSize: "1.2rem",
          overflowX: "hidden",
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
          <Rating value={`${m.reaction}`} cancel={false} stars={6} />
        </label>
      </p>
      <p style={{ textAlign: "right" }}>
        {/* poster le 12/12/1200 a 12:30:12 */}
        {format(new Date(m.date.seconds * 1000), "dd-MMMM-yyyy a H:m:s")}
      </p>
    </Card>
  );
};

export default CardPost;
