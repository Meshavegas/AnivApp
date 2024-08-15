import React, { useRef } from "react";
import Rate from "./Rate";
import { format } from "date-fns";
import { lienDefault } from "../../utilis/groupBy";
import { Share } from "iconsax-react";
import html2canvas from "html2canvas";

const TopSouhait = ({ m }) => {
  const templateRef = useRef();

  const handleGenerateImage = () => {
    html2canvas(templateRef.current, {
      scale: 2, // augmenter l'échelle pour une résolution plus élevée
      useCORS: true, // pour éviter les problèmes de Cross-Origin Resource Sharing (CORS)
      logging: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "hbd-vegas.png";
      link.click();
    });
  };

  return (
    <div
      className="flex flex-col justify-between gap-2 dark:text-white max-w-md w-full bg-white dark:bg-neutral-900 p-5 rounded-md shadow-md hover:scale-105 hover:duration-150 duration-150 border-2 border-red"
      ref={templateRef}
    >
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-row justify-between w-full">
          <Rate nombre={m?.reaction ?? 0} />
          <p className="text-xs">
            {format(new Date(m.date.seconds * 1000), "dd-MMMM-yyyy à H:m:s")}
          </p>
        </div>
      </div>
      <div className="flex  justify-between w-full">
        <div className=" flex flex-row items-center gap-2">
          <img
            src={
              typeof m?.uri === "string" && m?.uri === "" ? m?.uri : lienDefault
            }
            alt=""
            className=" w-11 h-11 rounded-full"
            style={{ objectFit: "cover" }}
          />
          <div className="">
            <h3 className="text-xl font-bold  w-fit">{m?.autheur}</h3>
            <p className="text-xs">Depuis {m?.ville}</p>
          </div>
        </div>
      </div>

      <div className="text-sm items-center flex justify-center">{m?.corp}</div>
      <div className="flex justify-center items-center">
        <button onClick={handleGenerateImage}>
          <Share size="25" color="#FF8A65" />
        </button>
      </div>
    </div>
  );
};

export default TopSouhait;
