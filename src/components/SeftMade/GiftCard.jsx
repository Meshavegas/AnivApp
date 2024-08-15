import React from "react";
import GiftIcon from "./GiftPicture";

const GiftCard = ({ m }) => {
  return (
    <div className="flex  flex-col gap-2 dark:text-white max-w-md w-full bg-white dark:bg-neutral-900 p-5 rounded-md shadow-md hover:scale-105 hover:duration-150 duration-150 border-2 border-red">
      <div className=" flex justify-center items-center w-full flex-col">
        <div className="  w-28  ">
          <GiftIcon />
        </div>
        <h1 className="text-xl font-bold  w-fit">Merci pour ton cadeau !</h1>

        <div className="flex justify-center items-center w-full flex-col">
          <p className="text-base text-center">
            Votre amis <span className=" font-bold"> {m.autheur}</span> depuis{" "}
            {m.ville}, vous a encouragé à vous déplacer plus loin.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GiftCard;
