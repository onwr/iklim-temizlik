import React from "react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center space-y-8">
        <img
          src="/images/logo.png"
          alt="Ross Organizasyon"
          className="h-40 w-40 object-contain"
        />

        <h2 className="text-center text-2xl font-semibold text-yesil">
          <span className="text-black">Yeni bir başlangıç için,</span>
          <br />
          İlk Adımınız
        </h2>

        <div className="relative h-1 w-64 overflow-hidden rounded-full bg-white/30">
          <div className="animate-loading-bar absolute left-0 h-full w-1/2 rounded-full bg-yesil" />
        </div>
      </div>
    </div>
  );
};

const style = document.createElement("style");
style.textContent = `
  @keyframes loading-bar {
    0% {
      transform: translateX(-200%);
    }
    100% {
      transform: translateX(300%);
    }
  }
  
  .animate-loading-bar {
    animation: loading-bar 1s ease-in-out infinite;
  }
`;
document.head.appendChild(style);

export default LoadingScreen;
