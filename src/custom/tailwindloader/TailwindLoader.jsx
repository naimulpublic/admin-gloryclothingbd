import React from "react";
import "./Loader.css";

export function PrimaryLoader() {
  return (
    <>
      <div
        className="h-[500px] w-full flex items-center justify-center bg-white/50 backdrop-blur-sm "
        id="page"
      >
        <div id="container">
          <div id="ring"></div>
          <div id="ring"></div>
          <div id="ring"></div>
          <div id="ring"></div>
          <div id="h3">loading...</div>
        </div>
      </div>
    </>
  );
}

export function SecondaryLoader({ height = "h-[80vh]" }) {
  return (
    <>
      <div
        className={`w-full ${height} flex items-center justify-center bg-white/70 backdrop-blur-sm `}
      >
        <div className="loader"></div>
      </div>
    </>
  );
}

export function ThirdLoader() {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
        <span className="sr-only">Loading...</span>
        <div className="duration-100 h-6 w-6 xl:h-8 xl:w-8 bg-orange-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="duration-100 h-6 w-6 xl:h-8 xl:w-8 bg-orange-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="duration-100 h-6 w-6 xl:h-8 xl:w-8 bg-orange-600 rounded-full animate-bounce"></div>
      </div>
    </>
  );
}

export function CircleLoader() {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
        <div className="w-10 h-10 xl:w-16 xl:h-16 border-8 border-dashed rounded-full animate-spin border-blue-600"></div>
      </div>
    </>
  );
}

export function Processing() {
  return (
    <>
      <div className="flex items-center justify-center gap-2 text-white">
        <h2>Processing Order</h2>

        <svg
          aria-hidden="true"
          role="status"
          className="inline mr-2 w-5 h-5 xl:w-6 xl:h-6 text-white animate-spin dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          ></path>
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="#1C64F2"
          ></path>
        </svg>
      </div>
    </>
  );
}

export function ProcessingReviewImage() {
  return (
    <>
      <div className="flex items-center justify-center gap-2 text-white">
        <h2>Uploading Image</h2>

        <svg
          aria-hidden="true"
          role="status"
          className="inline mr-2 w-5 h-5 xl:w-6 xl:h-6 text-white animate-spin dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          ></path>
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="#1C64F2"
          ></path>
        </svg>
      </div>
    </>
  );
}
