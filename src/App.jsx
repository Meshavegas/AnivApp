import React, { useState, useEffect, useRef } from "react";
// import { useForm, Controller } from "react-hook-form";
import { db, storage } from "./fb-conf";
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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { Send2, Gift } from "iconsax-react";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Loading from "./components/SeftMade/loader/Loading";
import TopSouhait from "./components/SeftMade/TopSouhait";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Formik } from "formik";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { groupBy } from "./utilis/groupBy";
import axios from "axios";
import GiftCard from "./components/SeftMade/GiftCard";
import SendMoney from "./components/SeftMade/SendMoney";
import WishForm from "./components/SeftMade/CheckPay";

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

  const [screenSize, setScreenSize] = useState(window.screen.width);

  // state pour validations
  const [showValidation, setShowValidation] = useState(false);

  const [valid, setValid] = useState(false);
  const [errorPayement, setErrorPayement] = useState("");
  const [successPayement, setSuccessPayement] = useState("");
  // const [timerValue, setTimerValue] = useState();
  const [payCounter, setPayCounter] = useState(300);

  const toast = useRef(null);

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
    const getMsg = async () => {
      onSnapshot(msgCollectionRef, (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id });
        });
        // console.log(groupBy(list));
        setMsg(groupBy(list));
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
        // showSuccess();
        // setMsge("");
        // reset();
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

  const [openSendMoney, setOpenSendMoney] = useState(false);
  const [openWich, setOpenWich] = useState(false);

  return (
    <div>
      {/* <Toast ref={toast}></Toast> */}

      <div className="card mt-10 px-4">
        <div className="card ">
          <div className="text-orange-500 text-4xl border-bottom-3 flex flex-row justify-center ">
            <div>Top souhait</div>
          </div>
          {!!topMsg?.length ? (
            <div className=" w-full flex flex-row flex-wrap gap-3 mt-8 justify-center">
              {topMsg.map((coffee, index) => {
                // console.log(coffee);

                return coffee.type === "cadeau" ? null : (
                  <TopSouhait m={coffee} key={index + coffee?.id} />
                );
              })}
            </div>
          ) : (
            <div className=" flex justify-center items-center w-full ">
              <Loading />
            </div>
          )}
        </div>
        <div className="card mt-10">
          <div className="text-orange-500 text-4xl border-bottom-3 flex flex-row justify-center">
            <div>Top Cadeau</div>
          </div>
          {!!topMsg?.length ? (
            <div className=" w-full flex flex-row flex-wrap gap-3 mt-11 justify-center">
              {topMsg.map((coffee, index) => {
                // console.log(coffee);

                return coffee.type === "cadeau" ? (
                  <GiftCard m={coffee} key={index + coffee?.id} />
                ) : null;
              })}
            </div>
          ) : (
            <Loading />
          )}
        </div>
        <div className="flex  justify-center w-full mt-10">
          <div className=" flex flex-col items-center gap-2 text-orange-500 text-4xl border-bottom-3 justify-center ">
            <div className="text-lg md:w-1/4  p-5 rounded-md shadow-md hover:scale-105 hover:duration-150 duration-150 border-2 border-red text-black">
              <div className="">
                <h3 className="text-xl font-bold  w-fit">
                  Loic L.{" "}
                  <span className=" text-right text-lg bg-orange-300 text-white px-2 rounded-full">
                    le fêté
                  </span>
                </h3>
                <p className="text-sm">Depuis Bafoussam</p>
              </div>
              <p className=" mt-5">
                Je tiens à remercier chaleureusement tous mes amis pour leurs
                merveilleux messages. Vos mots m'ont vraiment touché et rempli
                de joie. Que le Seigneur vous bénisse abondamment et vous comble
                de bonheur. Merci encore pour ces précieux témoignages
                d'affection !
              </p>

              <div className="mt-5">
                <span>Total</span> : <span>{msgAll.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          {msg ? (
            msg.map((e) => {
              return (
                <div key={e.key}>
                  <div className="text-orange-500 text-4xl border-bottom-3 flex flex-row justify-between ">
                    <div>Année</div>
                    <div>{e.key}</div>
                  </div>
                  <div className=" w-full flex flex-row flex-wrap gap-3 mt-8 justify-center">
                    {e.items.map((coffee, index) => {
                      // console.log(coffee);

                      return coffee.type === "cadeau" ? (
                        <GiftCard m={coffee} key={index + coffee?.id} />
                      ) : (
                        <TopSouhait m={coffee} key={index + coffee?.id} />
                      );
                    })}
                  </div>
                  {/* <TopSouhait mesg={e} /> */}
                </div>
              );
            })
          ) : (
            <Loading />
          )}
        </div>
      </div>

      <Dialog
        className="bg-purple-100"
        onChange={setOpenSendMoney}
        open={openSendMoney}
      >
        <DialogTrigger>
          <button
            style={{
              position: "fixed",
              bottom: "40px",
              right: "110px",
              // width: "60px",
              height: "60px",
              borderRadius: "30px",
            }}
            className="bg-orange-500 border-none flex flex-row justify-center items-center px-4 gap-2"
            onClick={() => setOpenSendMoney(true)}
          >
            <Gift size="32" color="#ffff" />
            <span className="text-white text-md">Envoyer un Cadeaux</span>
          </button>
        </DialogTrigger>
        <DialogContent className=" bg-white ">
          <DialogHeader>
            <DialogTitle>Envoyer un Depot</DialogTitle>
            <DialogDescription className="flex flex-col w-full">
              <SendMoney setOpenSendMoney={setOpenSendMoney} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog className="bg-purple-100" onChange={setOpenWich} open={openWich}>
        <DialogTrigger>
          <button
            style={{
              position: "fixed",
              bottom: "40px",
              right: "40px",
              width: "60px",
              height: "60px",
              borderRadius: "30px",
            }}
            className="bg-orange-500 border-none flex justify-center items-center"
            onClick={() => setOpenWich(true)}
          >
            <Send2 size="32" color="#ffffff" />
            {/*  */}
          </button>
        </DialogTrigger>
        <DialogContent className=" bg-white ">
          <DialogHeader>
            <DialogTitle>Envoyer un Depot</DialogTitle>
            <DialogDescription className="flex flex-col w-full">
              <WishForm setOnClose={setOpenWich} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="flex justify-content-center">
        {/* <Dialog
          visible={displayForm}
          style={{ width: "90vw", maxWidth: "500px" }}
          onHide={() => onHide()}
          header="Envoyer un souhait"
        > */}
        {/* <form onSubmit={handleSubmit(onSubmit)} className="p-fluid mt-5">
          <div className="field" style={{ margin: "1rem" }}>
            <span className="p-float-label mt-3">
              {/* <Controller
                  name="Prenom"
                  control={control}
                  rules={{ required: "Prenom requis" }}
                  // render={({ field, fieldState }) => (
                  //   // <InputText
                  //   //   id={field.name}
                  //   //   {...field}
                  //   //   autoFocus
                  //   //   // className={classNames({
                  //   //   //   "p-invalid": fieldState.invalid,
                  //   //   // })}
                  //   // />
                  // )}
                />  
              <label
                htmlFor="prenom"
                // className={classNames({ "p-error": errors.name })}
              >
                Prenom*
              </label>
            </span>
          </div>
          <div className="field" style={{ margin: "1rem" }}>
            <span className="p-float-label">
              {/* <Controller
                  name="Ville"
                  control={control}
                  rules={{ required: "ville requis" }}
                  // render={({ field, fieldState }) => (
                  //   <InputText
                  //     id={field.name}
                  //     {...field}
                  //     className={classNames({
                  //       "p-invalid": fieldState.invalid,
                  //     })}
                  //   />
                  // )}
                />  
              <label
                htmlFor="ville"
                // className={classNames({ "p-error": errors.name })}
              >
                Ville*
              </label>
            </span>
          </div>

          <div className="card" style={{ margin: "1rem" }}>
            <h3>Message</h3>
            {/* <InputTextarea
                value={msge}
                onChange={(e) => setMsge(e.target.value)}
                rows={5}
                cols={30}
              />  
          </div>
          <div className="field" style={{ margin: "1rem" }}>
            {/* <input type="file" onChange={(e) => setFile(e.target.files[0])} />  
          </div>
          <div className="card" style={{ margin: "1rem" }}>
            {/* <Button type="submit" label="Envoyer" loading={loading} />  
          </div>
        </form>  
        {/* </Dialog> */}
      </div>

      {/* 
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
       */}
    </div>
  );
};

export default App;
