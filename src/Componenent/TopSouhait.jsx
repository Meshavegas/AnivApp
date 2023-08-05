import { format } from "date-fns/esm";
import { Card } from "primereact/card";
import { Rating } from "primereact/rating";
import React from "react";

const lienDefault =
  "https://firebasestorage.googleapis.com/v0/b/maniv-a665b.appspot.com/o/logo-v2-variant-bg-noir.png?alt=media&token=a7f54c87-1d7b-4090-a87d-37a83d7a2e66";

const TopSouhait = ({ m }) => {
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
      style={{
        margin: "1rem",
        justifyContent: "center",
      }}
      className="border-1 surface-border border-round m-2 text-center py-5 px-3"
      title={<Header />}
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
