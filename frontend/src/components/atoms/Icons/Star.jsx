import React from "react";

const Star = ({ isFilled, handleClick, isSmaller }) => {
  return isFilled ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={isSmaller ? "25" : "40"}
      viewBox="0 96 960 960"
      width={isSmaller ? "25" : "40"}
      onClick={handleClick}
    >
      <path
        d="m233 976 65-281L80 506l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"
        fill="#ffc71f"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={isSmaller ? "20" : "40"}
      viewBox="0 96 960 960"
      width={isSmaller ? "20" : "40"}
      onClick={handleClick}
    >
      <path
        d="m323 851 157-94 157 95-42-178 138-120-182-16-71-168-71 167-182 16 138 120-42 178Zm-90 125 65-281L80 506l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-355Z"
        fill="#5c5c5c"
      />
    </svg>
  );
};

export default Star;
