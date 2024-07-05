"use client";
import { sendEventToGA } from "@/utils/sendEventToGA";
import { useState } from "react";
/* eslint-disable @next/next/no-img-element */
import { WeddingImage } from "ts/types";
import { useLastViewed } from "./LastViewedProvider";

const Spinner = () => (
  <div className="text-primary max-w-16 max-h-16 inline-block h-[40vh] w-[40vw] animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
  </div>
);

const Image = ({ img, user }: { img: WeddingImage; user: string }) => {
  const [fullSize, setFullSize] = useState(false);
  const [fullSizeLoaded, setFullSizeLoaded] = useState(false);
  const { updateImageLoaded } = useLastViewed();

  const handleClick = () => {
    sendEventToGA("image|click", user, "filename", img.filename);
    setFullSize(true);
  };

  return (
    <>
      <img
        className="cursor-pointer"
        onClick={handleClick}
        src={img.thumbnail.url}
        width={img.thumbnail.width}
        height={img.thumbnail.height}
        alt={"alt"}
        loading="lazy"
        onLoad={() => updateImageLoaded()}
      />
      {fullSize && (
        <div className="bg-black bg-opacity-40 fixed inset-0 flex items-center justify-center w-full h-full" onClick={() => setFullSize(false)}>
          {!fullSizeLoaded && (
              <Spinner />
          )}
          <img
            className={fullSizeLoaded ? "block max-w-full max-h-full object-contain" : "hidden"}
            onLoad={() => setFullSizeLoaded(true)}
            loading="eager"
            src={img.default.url}
            width={img.default.width}
            height={img.default.height}
            alt={"alt"}
          />
        </div>
      )}
    </>
  );
};

export default Image;