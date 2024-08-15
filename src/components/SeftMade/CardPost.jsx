import { lienDefault } from "../utilis/groupBy";

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
    <div className="">CardPsot</div>
    // <Card
    //   key={new Date().toString}
    //   title={<Header />}
    //   className="md:w-4 mx-3 my-3 w-full"
    // >
    //   <p
    //     className="m-2"
    //     style={{
    //       lineHeight: "1.5",
    //       fontSize: "1.2rem",
    //       overflowX: "hidden",
    //     }}
    //   >
    //     {`$`}
    //   </p>
    //   <p>
    //     <label
    //       style={{
    //         display: "flex",
    //         fontSize: "1.6rem",
    //         fontStyle: "italic",
    //       }}
    //     >
    //       Note :
    //       <Rating
    //         value={`${m.reaction}`}
    //         cancel={false}
    //         stars={6}
    //         customIcons={{
    //           emptyIcon: (
    //             <i icon="pi pi-star-fill" style={{ color: "orange" }}></i>
    //           ),
    //           fullIcon: <i icon="pi pi-star" style={{ color: "orange" }}></i>,
    //         }}
    //       />
    //     </label>
    //   </p>
    //   <p style={{ textAlign: "right" }}>
    //     {/* poster le 12/12/1200 a 12:30:12 */}
    //     {format(new Date(m.date.seconds * 1000), "dd-MMMM-yyyy à H:m:s")}
    //   </p>
    // </Card>
  );
};

export default CardPost;
