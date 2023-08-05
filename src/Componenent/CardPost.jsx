import { Card } from "primereact/card";
import { Rating } from "primereact/rating";
import React from "react";
import { format } from "date-fns/esm";

const lienDefault =
  "https://firebasestorage.googleapis.com/v0/b/maniv-a665b.appspot.com/o/logo-v2-variant-bg-noir.png?alt=media&token=a7f54c87-1d7b-4090-a87d-37a83d7a2e66";
const CardPost = ({ m }) => {
  const Header = () => (
    <div className="flex align-items-center">
      <img
        src={m.uri ? m.uri : lienDefault}
        alt=""
        className="w-4rem border-circle h-4rem "
        style={{ objectFit: "cover" }}
      />
      <div className="ml-3">{`${m.autheur} de ${m.ville}`}</div>
    </div>
  );
  return (
    <Card
      key={new Date().toString}
      title={<Header />}
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
