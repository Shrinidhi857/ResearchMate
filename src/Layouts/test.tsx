import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Lot: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <DotLottieReact
        src="https://lottie.host/edf6f15e-4a89-40b0-8436-ccc14c2e62ab/i8iafPho2c.lottie"
        loop
        autoplay
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default Lot;
