"use client";
import { sendEventToGA } from "@/utils/sendEventToGA";
import { useEffect, useState } from "react";
/* eslint-disable @next/next/no-img-element */
import NextImage from "next/image";
import { WeddingImage } from "ts/types";
import { Spinner } from "./Spinner";
import { useUser } from "./UserProvider";

const Image = ({ img }: { img: WeddingImage }) => {
  const [fullSize, setFullSize] = useState(false);
  const [fullSizeLoaded, setFullSizeLoaded] = useState(false);
  const { user } = useUser();
  const [loaded, setLoaded] = useState(false);

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

  const proxyUrl = (fullsize: boolean) =>  `/api/image?id=${img.id}&fullsize=${fullsize}`;

  return (
    <>
      <NextImage
        className="cursor-pointer w-full max-h-[99vh] max-w-[99vw]"
        onClick={handleClick}
        src={proxyUrl(false)}
        alt={"alt"}
        width={img.thumbnailDesktop.width}
        height={img.thumbnailDesktop.height}
        onLoad={() => setLoaded(true)}
      />
      {!loaded && <Spinner />}
      {fullSize && (
        <div
          className="bg-black bg-opacity-40 fixed inset-0 flex items-center justify-center w-full h-full z-50"
          onClick={handleClose}
        >
          {!fullSizeLoaded && <Spinner />}
          <NextImage
            className={
              fullSizeLoaded
                ? "block max-w-full max-h-full object-contain"
                : "hidden"
            }
            onLoad={() => setFullSizeLoaded(true)}
            loading="eager"
            src={proxyUrl(true)}
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
