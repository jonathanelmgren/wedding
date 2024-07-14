/* eslint-disable @next/next/no-img-element */
import { AutoScrollButton } from "@/components/AutoScrollButton";
import ImageComponent from "@/components/Image";
import { PageViewTracker } from "@/components/PageViewTracker";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { UserProvider } from "@/components/UserProvider";
import { getImages } from "@/utils/getImages";
import { Suspense } from "react";
import { FileUploadForm } from "./FileUploadForm";

const Page = () => {

  return (
    <UserProvider>
    <PageViewTracker>
        <div className="relative min-h-screen">
          <div
            className="absolute inset-0 -z-10 opacity-20"
            style={{ backgroundImage: 'url("/images/clouds.png")' }}
          />

          <div className="mx-2">
            <h1 className="text-center text-8xl text-primary mt-20">Album</h1>
            <p className="text-center">
              Om ni vill ta bort en bild, eller vill ha en bild med
              orginalkvalité så kontakta Jonathan
            </p>
            <FileUploadForm />
            <div className="z-0 mx-auto w-full flex flex-col items-center gap-8 m-12 scroll-smooth">
              <AutoScrollButton />
              <Suspense fallback={<>Laddar alla bilder....</>}>
                <ImageFetcher />
              </Suspense>
            </div>
          </div>
          <ScrollToTopButton />
        </div>
    </PageViewTracker>
    </UserProvider>
  );
};

const ImageFetcher = async () => {
  const imgResponse = await getImages();

  if (!imgResponse) {
    return <div>Kunde ej hämta bilder, vänligen kontakta Jonathan</div>;
  }

  return imgResponse.map((img, index) => (
    <>
    {index > 0 && index % 50 === 0 && (
      <div className="w-full text-center flex items-center">
<hr className="flex-grow mx-4" />
<h6 className="text-[3rem] text-primary">{index} / {imgResponse.length}</h6>
<hr className="flex-grow mx-4" />
</div>
        )}
    <div key={img.filename} data-filename={img.filename} className="px-4">
      <ImageComponent img={img} />
    </div>
          </>
  ));
};

export default Page;
