import "./App.scss";
import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card } from "primereact/card";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css";
import { classNames } from "primereact/utils";
import { db, storage } from "./fb-conf";
import { Dialog } from "primereact/dialog";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import CardPost from "./Componenent/CardPost";
import TopSouhait from "./Componenent/TopSouhait";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Loading from "./Componenent/loader.jsx/Loading";

const App = () => {
  const [file, setFile] = useState("");
  const [datas, setData] = useState({});
  const [per, setPerc] = useState(null);
  const [msg, setMsg] = useState([]);
  const [topMsg, setTopMsg] = useState([]);
  const [form, setform] = useState(false);
  const [formData, setformData] = useState({});
  const [msge, setMsge] = useState("");
  const [displayForm, setDisplayForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [screenSize, setScreenSize] = useState(window.screen.width);
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

  const onUpload = (e) => {
    console.log(e);
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
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
  const q = query(
    collection(db, "message"),
    where("reaction", ">=", 5),
    limit(5)
  );

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.screen.width);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [screenSize]);

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;

      console.log(name);
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData(downloadURL);
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  useEffect(() => {
    const getMsg = async () => {
      const data = await getDocs(msgCollectionRef);

      setMsg(data.docs.map((docs) => ({ ...docs.data(), id: docs.id })));
      const data2 = await getDocs(q);
      // console.log(data2);
      setTopMsg(data2.docs.map((docs) => ({ ...docs.data(), id: docs.id })));
    };
    getMsg();
  }, [displayForm]);

  const onSubmit = (data) => {
    if (msge.length <= 10) {
      console.log("message vide");
    } else {
      setLoading(true);
      setformData(data);
      createMsg(data.Prenom, data.Ville, msge, datas).then((e) => {
        setLoading(false);
        setMsge("");
        reset();
      });
    }
  };

  const createMsg = async (Prenom, Ville, message, datas) => {
    const msg = collection(db, "message");
    await addDoc(msg, {
      autheur: Prenom,
      corp: message,
      ville: Ville,
      date: new Date(),
      uri: datas,
      reaction: Math.floor(Math.random() * (5 - 1 + 1)) + 1,
    });
    setDisplayForm(false);
  };

  return (
    <div>
      <Toast ref={toast}></Toast>

      <div className="card">
        <div className="card flex flex-strech">
          {/* <Carousel
            value={topMsg}
            numVisible={3}
            numScroll={3}
            responsiveOptions={responsiveOptions}
            className="custom-carousel"
            circular
            autoplayInterval={3000}
            itemTemplate={(e) => <TopSouhait m={e} />}
            header={<h1 style={{ textAlign: "center" }}>Top Message</h1>}
          /> */}

          {!!topMsg?.length ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              loop={true}
              spaceBetween={5}
              slidesPerView={
                screenSize < 768
                  ? 1
                  : screenSize >= 768 && screenSize < 1024
                  ? 2
                  : screenSize <= 1024
                  ? 2
                  : 3
              }
              navigation={false}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => console.log(swiper)}
            >
              {topMsg.map((coffee, index) => (
                <SwiperSlide key={index + coffee?.id}>
                  <TopSouhait m={coffee} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Loading />
          )}
        </div>
        <Card
          title="Nombre de Commentaire"
          style={{
            margin: "1rem",
            position: "sticky",
            justifyContent: "center",
            background: "accff0",
          }}
          className="w-full md:w-8"
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {msg.map((m) => {
            return <CardPost m={m} />;
          })}
        </div>
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
              <span className="p-float-label mt-3">
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
            <div className="field" style={{ margin: "1rem" }}>
              {/* <FileUpload
                mode="basic"
                name="demo[]"
                url="/api/upload"
                accept="image/*"
                maxFileSize={1000000}
                onUpload={onUpload}
              /> */}
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            </div>
            <div className="card" style={{ margin: "1rem" }}>
              <Button type="submit" label="Envoyer" loading={loading} />
            </div>
          </form>
        </Dialog>
      </div>
    </div>
  );
};

export default App;
