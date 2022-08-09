import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card } from "primereact/card";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css";
import { Rating } from "primereact/rating";
import { classNames } from "primereact/utils";
import { db } from "./fb-conf";
import { Dialog } from "primereact/dialog";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { format } from "date-fns/esm";
import { Carousel } from "primereact/carousel";
import { Toast } from "primereact/toast";
// import { query, orderBy } from "firebase/firestore

const App = () => {
  const [msg, setMsg] = useState([]);
  const [topMsg, setTopMsg] = useState([]);
  const [form, setform] = useState(false);
  const [formData, setformData] = useState({});
  const [msge, setMsge] = useState("");
  const [displayForm, setDisplayForm] = useState(false);

  const toast = useRef(null);

  const showSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "envoyer",
      detail: "Merci pour ton message",
      life: 3000,
    });
  };

  const defaultValue = {
    prenom: "",
    ville: "",
    message: "",
    date: null,
  };

  const onClick = () => {
    setDisplayForm(true);
  };
  const onHide = () => {
    setDisplayForm(false);
  };
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValue });

  const msgCollectionRef = query(
    collection(db, "message"),
    orderBy("date", "desc")
  );
  const q = query(collection(db, "message"), where("reaction", ">=", 5));

  useEffect(() => {
    const getMsg = async () => {
      const data = await getDocs(msgCollectionRef);

      setMsg(data.docs.map((docs) => ({ ...docs.data(), id: docs.id })));
      const data2 = await getDocs(q);

      setTopMsg(data2.docs.map((docs) => ({ ...docs.data(), id: docs.id })));
    };
    getMsg();
  }, [displayForm]);
  const onSubmit = (data) => {
    if (msge.length === 0) {
      console.log("message vide");
    } else {
      setformData(data);
      createMsg(data.Prenom, data.Ville, msge);
    }
  };
  const topMsgTemplate = (m) => {
    return (
      <Card
        key={new Date().toString}
        style={{
          margin: "1rem",
          justifyContent: "center",
        }}
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
  const responsiveOptions = [
    {
      breakpoint: "1024px",
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: "600px",
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: "480px",
      numVisible: 1,
      numScroll: 1,
    },
  ];
  const createMsg = async (Prenom, Ville, message) => {
    const msg = collection(db, "message");
    await addDoc(msg, {
      autheur: Prenom,
      corp: message,
      ville: Ville,
      date: new Date(),
      reaction: Math.floor(Math.random() * (5 - 1 + 1)) + 1,
    });
    setDisplayForm(false);
  };
  const displayMsg = () => {};
  const logo = (
    <img
      alt="logo"
      src="https://picsum.photos/200"
      height="40"
      className="mr-2"
    ></img>
  );

  const items = [
    {
      label: "Acceuil",
      icon: "pi pi-fw pi-home",
    },
    {
      label: "Comentaire",
      icon: "pi pi-fw pi-discord",
    },
    {
      label: "personne",
      icon: "pi pi-fw pi-user",
    },
  ];
  return (
    <div>
      {/* <Toast
        ref={(el) => {
          this.toast = el;
        }}
      ></Toast> */}

      <div className="card">
        <Menubar model={items} start={logo} />
        <div className="card">
          <Carousel
            value={topMsg}
            numVisible={3}
            numScroll={3}
            responsiveOptions={responsiveOptions}
            className="custom-carousel"
            circular
            autoplayInterval={3000}
            itemTemplate={topMsgTemplate}
            header={<h1 style={{ textAlign: "center" }}>Top Message</h1>}
          />
        </div>
        <Card
          title="Nombre de Commentaire"
          style={{
            margin: "1rem",
            position: "sticky",
            justifyContent: "center",
            background: "accff0",
          }}
        >
          <span
            style={{
              display: "flex",
              textAlign: "center",
              fontSize: "4rem",
              justifyContent: "center",
            }}
          >
            {msg.length}
          </span>
        </Card>
        {msg.map((m) => {
          return (
            <Card
              key={new Date().toString}
              style={{
                margin: "1rem",
                justifyContent: "center",
              }}
              title={`${m.autheur} de ${m.ville}`}
            >
              <p
                className="m-2"
                style={{
                  lineHeight: "1.5",
                  fontSize: "1.2rem",
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
                {format(
                  new Date(m.date.seconds * 1000),
                  "dd-MMMM-yyyy a H:m:s"
                )}
              </p>
            </Card>
          );
        })}
      </div>
      <Button
        icon="pi pi-fw pi-plus"
        style={{
          position: "fixed",
          bottom: "40px",
          right: "40px",
          width: "60px",
          height: "60px",
          borderRadius: "30px",
        }}
        onClick={() => onClick()}
      />
      <div className="flex justify-content-center">
        <Dialog
          visible={displayForm}
          style={{ width: "90vw" }}
          onHide={() => onHide()}
          header="Envoyer un souhait"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
            <div className="field" style={{ margin: "1rem" }}>
              <span className="p-float-label">
                <Controller
                  name="Prenom"
                  control={control}
                  rules={{ required: "Prenom requis" }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      autoFocus
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                <label
                  htmlFor="prenom"
                  className={classNames({ "p-error": errors.name })}
                >
                  Prenom*
                </label>
              </span>
            </div>
            <div className="field" style={{ margin: "1rem" }}>
              <span className="p-float-label">
                <Controller
                  name="Ville"
                  control={control}
                  rules={{ required: "ville requis" }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                <label
                  htmlFor="ville"
                  className={classNames({ "p-error": errors.name })}
                >
                  Ville*
                </label>
              </span>
            </div>

            <div className="card" style={{ margin: "1rem" }}>
              <h3>Message</h3>
              <InputTextarea
                value={msge}
                onChange={(e) => setMsge(e.target.value)}
                rows={5}
                cols={30}
              />
            </div>
            <div className="card" style={{ margin: "1rem" }}>
              <Button type="submit" label="Envoyer" />
            </div>
          </form>
        </Dialog>
      </div>
    </div>
  );
};

export default App;
