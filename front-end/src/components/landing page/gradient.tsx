"use client";

import React, { ReactNode } from "react";
const gradientKeyframes = `
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient {
  animation: gradient 8s linear infinite;
}
`;
function GradientText({
  children,
  className = "",
  colors = ["#ffaa40", "#9c40ff", "#ffaa40"],
  animationSpeed = 8,
  showBorder = false,
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    backgroundSize: "300% 100%",
    animation: `gradient ${animationSpeed}s linear infinite`,
  };
  return (
    <>
      {}
      <style
        dangerouslySetInnerHTML={{
          __html: gradientKeyframes,
        }}
      />
      <div
        className={`relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-[1.25rem] font-medium backdrop-blur transition-shadow duration-500 overflow-hidden cursor-pointer ${className}`}
      >
        {showBorder && (
          <div
            className="absolute inset-0 z-0 bg-cover pointer-events-none"
            style={gradientStyle}
          >
            <div
              className="absolute inset-0 bg-black rounded-[1.25rem] z-[-1]"
              style={{
                width: "calc(100% - 2px)",
                height: "calc(100% - 2px)",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            ></div>
          </div>
        )}
        <div
          className="relative inline-block text-transparent bg-cover z-2"
          style={{
            ...gradientStyle,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
const GradientView = () => {
  return (
    <div className="flex flex-col items-center justify-center pb-8 space-y-8 font-sans">
      <GradientText className="font-bold text-9xl md:text-6xl">
        MedVault
      </GradientText>
    </div>
  );
};
export default GradientView;
