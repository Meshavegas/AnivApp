import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BadgeCheck, CircleX, Loader2 } from "lucide-react";
import { storage } from "../../fb-conf";
import axios from "axios";

const validationSchema = Yup.object().shape({
  prenom: Yup.string().required("Require"),
  numero: Yup.string().required("Required"),
  amount: Yup.number().typeError("Must be a number").required("Required"),
  picture: Yup.string().url("Must be a valid URL"),
  ville: Yup.string().url("Ville"),
});

const SendMoney = ({ setOpenSendMoney }) => {
  const [file, setFile] = useState("");
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

  const [loading, setLoading] = useState(false);
  const [errorPayement, setErrorPayement] = useState("");
  const [payCounter, setPayCounter] = useState(300);
  const [valid, setValid] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkEnd, setCheckEnd] = useState(false);
  const [references, setReferences] = useState("");

  let timer;
  let payTimer;

  const timerValues = () => {
    const minutes = Math.floor(payCounter / 60);
    const seconds = payCounter % 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
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
        setCheckEnd(true);
      }
      count++;

      if (count >= 5) {
        clearInterval(timer);
        onPaySubmit(false);
      }
    }, 10000);
  };

  const initPayTimer = () => {
    //     setShowValidation(true);
    payTimer = setInterval(() => {
      setPayCounter((prevCounter) => prevCounter - 1);
    }, 1000);
  };

  const stopPayTimer = () => {
    clearInterval(payTimer);
    setPayCounter(5 * 60);
  };

  const onPaySubmit = (status) => {
    stopPayTimer();

    setReferences("");

    if (status) {
      // alert('Votre vote a été pris en compte')
      setSuccessPayement("mercie pour votre cadeaux");
      //   setShowValidation(false);
      //   setDisplayFormGif(false);
      //   setDisplaySucess(true);
      setIsSuccess(true);
      setLoading(false);
      showSuccess();
    } else {
      setErrorPayement("une erreur c'est produite veuillez reesayer");
      //       setShowValidation(false);
      setIsSuccess(false);
      setLoading(false);
    }
  };

  const payCheck = async (preference) => {
    try {
      const res = await axios.get(
        `https://birthday-api.tanouacademy.com/api/v1/check/${preference}`
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
    console.log(data, "to send");

    try {
      const response = await axios.post(
        "https://birthday-api.tanouacademy.com/api/v1/join",
        {
          fhid: "2087300317",
          amount: data.amount,
          fullname: data.prenom,
          city: data.ville,
          phone: data.numero,
        }
      );

      const responseData = response.data;
      console.log(responseData, "responseData");

      if (responseData.error) {
        setErrorPayement(responseData.message);
        setLoading(false);
      } else {
        setValid(true);
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

  return (
    <>
      {!valid ? (
        <Formik
          initialValues={{
            prenom: "",
            ville: "",
            numero: "",
            amount: "",
            picture: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmitPayement(values);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => (
            <Form
              onSubmit={handleSubmit}
              className="space-y-4  mx-auto p-4 border rounded-md shadow-sm w-full mt-5"
            >
              <div className="flex flex-col gap-1.5 text-left">
                <Label htmlFor="prenom">Prenom</Label>
                <Input
                  type="text"
                  id="prenom"
                  name="prenom"
                  placeholder="Prenom"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.prenom}
                  className={`w-full border-2 rounded-md p-2 ${
                    touched.prenom && errors.prenom
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="prenom"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5 text-left">
                <Label htmlFor="prenom">Ville</Label>
                <Input
                  type="text"
                  id="Ville"
                  name="Ville"
                  placeholder="Ville"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.ville}
                  className={`w-full border-2 rounded-md p-2 ${
                    touched.ville && errors.ville
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="prenom"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <Label htmlFor="numero">Numero OM/MOMO</Label>
                <Input
                  type="text"
                  id="numero"
                  name="numero"
                  placeholder="Numero"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.numero}
                  className={`w-full border-2 rounded-md p-2 ${
                    touched.numero && errors.numero
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="numero"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <Label htmlFor="amount">Montant</Label>
                <Input
                  type="number"
                  id="amount"
                  name="amount"
                  placeholder="Montant"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.amount}
                  className={`w-full border-2 rounded-md p-2 ${
                    touched.amount && errors.amount
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="amount"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <Label htmlFor="picture">Photo (Optionel)</Label>
                <Input
                  type="file"
                  id="picture"
                  name="picture"
                  placeholder="Picture"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    setFieldValue("picture", e.target.files[0]);
                  }}
                  onBlur={handleBlur}
                  value={values.picture}
                  className={`w-full border-2 rounded-md p-2 ${
                    touched.picture && errors.picture
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="picture"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex gap-5 ">
                <Button
                  type="primary"
                  htmlType="button"
                  className="bg-red-500 text-white shadow-sm  px-10 hover:bg-red-400 w-full"
                  onClick={() => setOpenSendMoney(false)}
                >
                  Fermer
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-orange-500 text-white shadow-sm  px-10 hover:bg-orange-400 w-full"
                  disabled={isSubmitting}
                  loading={loading}
                >
                  {loading ? <Loader2 className="animate-spin" /> : null}
                  Envoyer
                </Button>
              </div>
              <p>{errorPayement ? errorPayement : null}</p>
            </Form>
          )}
        </Formik>
      ) : (
        <div>
          {!checkEnd ? (
            <ValidationPending timerValues={timerValues} />
          ) : isSuccess ? (
            <SuccessMessage message="Merci pour votre cadeaux" />
          ) : (
            <ErrorMessageComponent message="Une erreur est survenue veuillez reesayer" />
          )}
          <Button
            type="primary"
            htmlType="button"
            className="bg-red-500 text-white shadow-sm  px-10 hover:bg-red-400 w-full mt-10"
            onClick={() => setOpenSendMoney(false)}
          >
            Fermer
          </Button>
        </div>
      )}
    </>
  );
};

export default SendMoney;

const ValidationPending = ({ timerValues }) => (
  <div className="flex flex-col gap-1.5 text-left">
    <span>Veuillez Confirmer le retrait</span>
    <p className="text-2xl text-center font-bold">{timerValues()}</p>
    <p>
      <span className="text-center text-xl capitalize">
        Valider sur votre mobile Taper :{" "}
        <span className="font-bold">*126#/#150#</span>
      </span>
    </p>
  </div>
);

const ErrorMessageComponent = ({ message }) => (
  <div className="dialog-content center column">
    <CircleX size="32" color="#ffffff" />
    <div className="message">{message}</div>
  </div>
);

const SuccessMessage = ({ message }) => (
  <div className="dialog-content center column">
    <BadgeCheck size="32" color="green" />
    <div className="message">{message}</div>
  </div>
);
