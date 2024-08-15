import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../fb-conf";
import { Loader2 } from "lucide-react";

const validationSchema = Yup.object().shape({
  prenom: Yup.string().required("Required"),
  ville: Yup.string().required("Required"),
  message: Yup.string().required("Required"),
});

const WishForm = ({ setOnClose }) => {
  const [loading, setLoading] = useState(false);

  const createMsg = async (Prenom, Ville, message, datas, resetForm) => {
    setLoading(true);
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
    setOnClose(false);
    resetForm();
  };
  return (
    <Formik
      initialValues={{ prenom: "", ville: "", message: "" }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        createMsg(values.prenom, values.ville, values.message, "", resetForm);
        setSubmitting(false);
      }}
    >
      {({ handleSubmit, isSubmitting, handleChange, handleBlur }) => (
        <Form
          onSubmit={handleSubmit}
          className="space-y-4 max-w-md mx-auto p-4 border rounded-md shadow-sm  w-full mt-5"
        >
          <div className="flex flex-col gap-1.5 text-left">
            <Label
              htmlFor="prenom"
              className="text-sm font-medium text-gray-700"
            >
              Prénom
            </Label>
            <Input
              type="text"
              id="prenom"
              name="prenom"
              placeholder="Prénom"
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border-2 border-gray-300 rounded-md p-2"
            />
            <ErrorMessage
              name="prenom"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <Label
              htmlFor="ville"
              className="text-sm font-medium text-gray-700"
            >
              Ville
            </Label>
            <Input
              type="text"
              id="ville"
              name="ville"
              placeholder="Ville"
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border-2 border-gray-300 rounded-md p-2"
            />
            <ErrorMessage
              name="ville"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <Label
              htmlFor="message"
              className="text-sm font-medium text-gray-700"
            >
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Message"
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4}
              className="w-full border-2 border-gray-300 rounded-md p-2"
            />
            <ErrorMessage
              name="message"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex gap-5">
            <Button
              type="primary"
              htmlType="button"
              className="bg-red-500 text-white shadow-sm  px-10 hover:bg-red-400 w-full"
              onClick={() => setOnClose(false)}
            >
              Fermer
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 text-white shadow-sm  px-4 py-2 w-full hover:bg-orange-400"
              disabled={isSubmitting}
            >
              {loading ? <Loader2 className="animate-spin" /> : null}
              Envoyer
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default WishForm;
