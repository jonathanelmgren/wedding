/* eslint-disable @next/next/no-img-element */
import { AutoScrollButton } from "@/components/AutoScrollButton";
import ImageComponent from "@/components/Image";
import { LastViewedProvider } from "@/components/LastViewedProvider";
import { PageViewTracker } from "@/components/PageViewTracker";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { getImages } from "@/utils/getImages";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { FileUploadForm } from "./FileUploadForm";

const Page = () => {
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie) {
    redirect("/login");
  }

  const user = cookieStore.get("user")?.value;

  if (!user) {
    redirect("/login");
  }

  return (
    <PageViewTracker user={user}>
      <LastViewedProvider>
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
            <FileUploadForm user={user} />
            <div className="z-0 mx-auto w-full flex flex-col items-center gap-8 m-12 max-w-[600px] scroll-smooth">
              <AutoScrollButton />
              <Suspense fallback={<>Laddar alla bilder....</>}>
                <ImageFetcher user={user} />
              </Suspense>
            </div>
          </div>
          <ScrollToTopButton />
        </div>
      </LastViewedProvider>
    </PageViewTracker>
  );
};

const ImageFetcher = async ({ user }: { user: string }) => {
  const imgResponse = await getImages();

  if (!imgResponse) {
    return <div>Kunde ej hämta bilder, vänligen kontakta Jonathan</div>;
  }

  return imgResponse.map((img) => (
    <div
      key={img.filename}
      data-filename={img.filename}
      style={{ width: img.thumbnail.width, height: img.thumbnail.height }}
    >
      <ImageComponent img={img} user={user} />
    </div>
  ));
};

export default Page;
