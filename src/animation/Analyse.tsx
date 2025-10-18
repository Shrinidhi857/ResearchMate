import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const AnalyseAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <DotLottieReact
        src="https://lottie.host/298fa552-4873-49c6-99db-ed0c814d00b3/ZRIsnP2St2.lottie"
        loop
        autoplay
        style={{
          width: "40%",
        }}
      />
    </div>
  );
};

export default AnalyseAnimation;
