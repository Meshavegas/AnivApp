import React from "react";
import { Star1 } from "iconsax-react";

const Rate = ({ nombre }) => {
  return (
    <div className="flex items-center justify-center">
      {Array.from({ length: 5 }, (_, index) => {
        const starNumber = index + 1;
        return (
          <Star1
            key={starNumber}
            size="17"
            color="#FF8A65"
            variant={starNumber <= nombre ? "Bold" : undefined} // Mettre en gras si équivalent
          />
        );
      })}
    </div>
  );
};

export default Rate;
