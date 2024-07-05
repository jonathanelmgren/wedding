"use client";
import { sendEventToGA } from "@/utils/sendEventToGA";
import { useState } from "react";
/* eslint-disable @next/next/no-img-element */
import { WeddingImage } from "ts/types";
import { useLastViewed } from "./LastViewedProvider";

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
        <div className="bg-gray-200 h-screen w-screen fixed object-contain inset-0 flex items-center justify-center">
          {!fullSizeLoaded && <div>Laddar bilden...</div>}
          <img
            className={fullSizeLoaded ? "block" : "hidden"}
            onLoad={() => setFullSizeLoaded(true)}
            loading="eager"
            onClick={() => setFullSize(false)}
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
