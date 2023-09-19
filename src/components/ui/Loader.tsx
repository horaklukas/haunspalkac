import React from "react";

export const Loader = () => {
  return (
    <div className="flex flex-col">
      <span className="ml-10 -mb-10 text-5xl animate-ball-bounce">⚽️</span>
      <span className={`text-6xl animate-kick`}>👟</span>
    </div>
  );
};
