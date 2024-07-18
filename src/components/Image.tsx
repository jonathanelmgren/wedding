"use client";
import { sendEventToGA } from "@/utils/sendEventToGA";
import { useEffect, useState } from "react";
/* eslint-disable @next/next/no-img-element */
import { WeddingImage } from "ts/types";
import { useUser } from "./UserProvider";

const Spinner = () => (
  <div
    className="text-primary max-w-16 max-h-16 inline-block h-[40vh] w-[40vw] animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
    role="status"
  >
    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
      Loading...
    </span>
  </div>
);

const Image = ({ img }: { img: WeddingImage }) => {
  const [fullSize, setFullSize] = useState(false);
  const [fullSizeLoaded, setFullSizeLoaded] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (fullSize) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [fullSize]);

  const handleClick = () => {
    sendEventToGA("image|click", user ?? "", "filename", img.filename);
    setFullSize(true);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFullSize(false);
  };

  const proxyUrl = (desktop:boolean, thumbnail:boolean) => `/api/photos/${img.id}?thumbnail=${thumbnail ? 'true' : 'false'}&desktop=${desktop ? 'true' : 'false'}`;

  return (
    <>
      <img
        className="cursor-pointer w-full max-h-[99vh] max-w-[99vw]"
        onClick={handleClick}
        src={img.thumbnail.url}
        srcSet={`${proxyUrl(false,true)} 480w, ${proxyUrl(true,true)} 1024w`}
        sizes="(max-width: 600px) 480px, 1024px"
        alt={"alt"}
        loading="lazy"
        width={img.thumbnailDesktop.width}
        height={img.thumbnailDesktop.height}
      />
      {fullSize && (
        <div
          className="bg-black bg-opacity-40 fixed inset-0 flex items-center justify-center w-full h-full z-50"
          onClick={handleClose}
        >
          {!fullSizeLoaded && <Spinner />}
          <img
            className={
              fullSizeLoaded
                ? "block max-w-full max-h-full object-contain"
                : "hidden"
            }
            onLoad={() => setFullSizeLoaded(true)}
            loading="eager"
            src={proxyUrl(true,false)}
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
