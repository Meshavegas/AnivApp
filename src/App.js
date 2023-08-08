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
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import CardPost from "./Componenent/CardPost";
import TopSouhait from "./Componenent/TopSouhait";

import { AiFillGift } from "react-icons/ai";
import { FcCheckmark } from "react-icons/fc";

import { MdOutlineError } from "react-icons/md";
import { InputNumber } from "primereact/inputnumber";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Loading from "./Componenent/loader.jsx/Loading";
import { groupBy } from "./utilis/groupBy";
import GroupPost from "./Componenent/GroupPost";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import axios from "axios";

const App = () => {
  const [file, setFile] = useState("");
  const [datas, setData] = useState({});
  const [per, setPerc] = useState(null);
  const [msg, setMsg] = useState([]);
  const [msgAll, setMsgAll] = useState([]);
  const [topMsg, setTopMsg] = useState([]);
  const [motnt, setMotnt] = useState(0);
  const [numero, setNumero] = useState();
  const [form, setform] = useState(false);
  const [formData, setformData] = useState({});
  const [msge, setMsge] = useState("");
  const [displayForm, setDisplayForm] = useState(false);
  const [displayFormGif, setDisplayFormGif] = useState(false);
  const [displaySucess, setDisplaySucess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [screenSize, setScreenSize] = useState(window.screen.width);

  // state pour validations
  const [showValidation, setShowValidation] = useState(false);

  const [valid, setValid] = useState(false);
  const [errorPayement, setErrorPayement] = useState("");
  const [successPayement, setSuccessPayement] = useState("");
  const [references, setReferences] = useState("");
  // const [timerValue, setTimerValue] = useState();
  const [payCounter, setPayCounter] = useState(300);

  let timer;
  let payTimer;

  const toast = useRef(null);

  const payCheck = async (preference) => {
    try {
      const res = await axios.get(
        `https://faroty-api.tanouacademy.com/api/v1/check/${preference}`
      );

      if (!res.data.error) {
        return true;
      } else if (res.data.error_msg === "no_payment_received") {
        return false;
      } else if (res.data.error_msg === "payment_request_pending") {
        return null;
      } else if (res.data.error_msg === "no_pay_request_found") {
        return false;
      }
    } catch (error) {
      return null;
    }
  };

  const onPaySubmit = (status) => {
    stopPayTimer();

    setReferences("");

    if (status) {
      // alert('Votre vote a été pris en compte')
      setSuccessPayement("mercie pour votre cadeaux");
      setShowValidation(false);
      setDisplayFormGif(false);
      setDisplaySucess(true);
      setIsSuccess(true);
      setLoading(false);
      showSuccess();
    } else {
      setErrorPayement("une erreur c'est produite veuillez reesayer");
      setShowValidation(false);
      setDisplayFormGif(false);
      setDisplaySucess(true);
      setIsSuccess(false);
      setLoading(false);
    }
  };

  const timerValues = () => {
    const minutes = Math.floor(payCounter / 60);
    const seconds = payCounter % 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  };

  const initPayTimer = () => {
    setShowValidation(true);
    payTimer = setInterval(() => {
      setPayCounter((prevCounter) => prevCounter - 1);
    }, 1000);
  };

  const stopPayTimer = () => {
    clearInterval(payTimer);
    setPayCounter(5 * 60);
  };

  const initInterval = (preference) => {
    let count = 0;
    timer = setInterval(async () => {
      // console.log(preference);

      const status = await payCheck(preference);
      if (status !== null) {
        console.log("satus+++++++++++", status);
        clearInterval(timer);
        onPaySubmit(status);
      }
      count++;

      if (count >= 5) {
        clearInterval(timer);
        onPaySubmit(false);
      }
    }, 10000);
  };

  const showSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "envoyer",
      detail: "Merci pour ton message",
      life: 3000,
    });
  };

  const handleSubmitPayement = async (data) => {
    setErrorPayement(null);
    setLoading(true);
    try {
      const response = await axios.post(
        "https://faroty-api.tanouacademy.com/api/v1/join",
        {
          fhid: "3692428454",
          amount: motnt,
          fullname: data.Prenom,
          city: data.Ville,
          phone: numero,
        }
      );

      const responseData = response.data;
      if (responseData.error) {
        setErrorPayement(responseData.message);
        setLoading(false);
      } else {
        setValid(true);
        console.log(responseData);
        setReferences(responseData.data.reference);
        initInterval(responseData.data.reference);
        initPayTimer();
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setErrorPayement("Une erreur est survenue lors de la requête.");
      setLoading(false);
    }
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
  const onClickGift = () => {
    setDisplayFormGif(true);
  };
  const onHide = () => {
    setDisplayForm(false);
    setDisplayFormGif(false);
  };
  const onHideValidation = () => {
    setShowValidation(false);
    setDisplaySucess(false);
  };
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValue });

  const msgCollectionRef = query(
    collection(db, "message"),
    where("active", "==", true),
    orderBy("date", "desc")
  );
  const q = query(
    collection(db, "message"),
    where("reaction", ">=", 5),
    limit(5)
  );

  const deleteq = query(
    collection(db, "message"),
    where("corp", "==", "Merci pour tes 500 FCFA")
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
      setLoading(true);
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
          setLoading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData(downloadURL);
            setLoading(false);
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  useEffect(() => {
    const deleteDocs = () => {
      onSnapshot(deleteq, (snapShot) => {
        snapShot.docs.forEach((docs) => {
          // Suppression du doc
          // "cities", "yftq9RGp4jWNSyBZ1D6L");

          // console.log(docs.id);
          deleteDoc(doc(db, "message", docs.id));
        });
      });
    };

    // deleteDocs();
    const getMsg = async () => {
      onSnapshot(msgCollectionRef, (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id });
        });
        setMsg(groupBy(list));
        // console.log(list);
        setMsgAll(list);
      });
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
        showSuccess();
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
      active: true,
      reaction: Math.floor(Math.random() * (5 - 1 + 1)) + 1,
    });
    setDisplayForm(false);
  };

  return (
    <div>
      <Toast ref={toast}></Toast>

      <div className="card">
        <div className="card ">
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

          <div
            className="text-orange-500 text-4xl border-bottom-3"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginLeft: "10%",
              marginRight: "10%",
            }}
          >
            <div>Top souhait</div>
          </div>
          {!!topMsg?.length ? (
            <div className="mr-3 ml-3">
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
            </div>
          ) : (
            <Loading />
          )}
        </div>
        <div className="flex  justify-content-centerw-full">
          <Card
            title="Nombre De Souhait"
            style={{
              margin: "1rem",
              position: "sticky",
              justifyContent: "center",
              background: "accff0",
              marginLeft: "10%",
              marginRight: "10%",
              width: "100%",
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
              {msgAll.length}
            </span>
          </Card>
        </div>

        <div>
          {msg ? (
            msg.map((e) => {
              return (
                <div key={e.key}>
                  <div
                    className="text-orange-500 text-4xl border-bottom-3"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginLeft: "10%",
                      marginRight: "10%",
                    }}
                  >
                    <div>Année</div>
                    <div>{e.key}</div>
                  </div>
                  <GroupPost mesg={e} />
                </div>
              );
            })
          ) : (
            <Loading />
          )}
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
        className="bg-orange-500 border-none"
        onClick={() => onClick()}
      />
      <Button
        icon={<AiFillGift style={{ fontSize: "1.6rem" }} />}
        style={{
          position: "fixed",
          bottom: "40px",
          right: "110px",
          width: "60px",
          height: "60px",
          borderRadius: "30px",
        }}
        className="bg-orange-500 border-none"
        onClick={() => onClickGift()}
      />
      <div className="flex justify-content-center">
        <Dialog
          visible={displayForm}
          style={{ width: "90vw", maxWidth: "500px" }}
          onHide={() => onHide()}
          header="Envoyer un souhait"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="p-fluid mt-5">
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
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            </div>
            <div className="card" style={{ margin: "1rem" }}>
              <Button type="submit" label="Envoyer" loading={loading} />
            </div>
          </form>
        </Dialog>
        <Dialog
          visible={displayFormGif}
          style={{ width: "90vw", maxWidth: "500px" }}
          onHide={() => onHide()}
          header="Envoyer un depot"
        >
          <form
            onSubmit={handleSubmit(handleSubmitPayement)}
            className="p-fluid mt-5"
          >
            <div className="field" style={{ margin: "1rem" }}>
              <span className="p-float-label mt-3">
                <InputNumber
                  inputId="montant"
                  value={motnt}
                  onValueChange={(e) => setMotnt(e.value)}
                  mode="currency"
                  currency="XAF"
                  locale="cm-CM"
                />

                <label
                  htmlFor="montant"
                  className={classNames({ "p-error": errors.name })}
                >
                  Votre contribution (en XAF)*
                </label>
              </span>
            </div>
            <div className="field" style={{ margin: "1rem" }}>
              <span className="p-float-label">
                <Controller
                  name="Prenom"
                  control={control}
                  rules={{ required: "Prenoms requis" }}
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
                  htmlFor="prenon"
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
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">+237</span>
                <InputText
                  placeholder="Numero OM ou MOMO"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </div>
            </div>
            <div className="field" style={{ margin: "1rem", color: "red" }}>
              {errorPayement}
            </div>
            <div className="field" style={{ margin: "1rem", color: "green" }}>
              {successPayement}
            </div>
            <div className="field" style={{ margin: "1rem" }}>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            </div>
            <div className="card" style={{ margin: "1rem" }}>
              <Button type="submit" label="Envoyer" loading={loading} />
            </div>
          </form>
        </Dialog>
        <Dialog
          visible={showValidation}
          style={{ width: "85vw", maxWidth: "450px" }}
          onHide={() => onHideValidation()}
          header="Validation en attente"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "1.4rem",
            }}
          >
            Validation :{" "}
            <h1 style={{ fontSize: "1.6rem", marginLeft: "10px" }}>
              {timerValues()}{" "}
            </h1>
          </div>
        </Dialog>
        <Dialog
          visible={displaySucess}
          style={{ width: "90vw", maxWidth: "500px" }}
          onHide={() => onHideValidation()}
          header="Status de la requete"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {isSuccess ? (
              <>
                <FcCheckmark
                  style={{ fontSize: "5em", color: "green" }}
                  color="green"
                />{" "}
                <div style={{ marginTop: "20px" }}>Merci pour ton cadeaux</div>
              </>
            ) : (
              <>
                <MdOutlineError
                  style={{ fontSize: "5em", color: "red" }}
                  color="green"
                />{" "}
                <div style={{ marginTop: "20px" }}>
                  Une erreur c'est produit
                </div>
              </>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default App;
