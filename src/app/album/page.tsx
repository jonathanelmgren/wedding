/* eslint-disable @next/next/no-img-element */
import { AutoScrollButton } from "@/components/AutoScrollButton";
import ImageComponent from "@/components/Image";
import { PageViewTracker } from "@/components/PageViewTracker";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { WeddingImage } from "ts/types";
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
            <div className="z-0 mx-auto w-full flex flex-col items-center gap-8 m-12 scroll-smooth">
              <AutoScrollButton />
              <Suspense fallback={<>Laddar alla bilder....</>}>
                <ImageFetcher user={user} />
              </Suspense>
            </div>
          </div>
          <ScrollToTopButton />
        </div>
    </PageViewTracker>
  );
};

const ImageFetcher = async ({ user }: { user: string }) => {
  const headerList = headers();
  const baseUrl = headerList.get("x-origin");
  const imgResponse = await fetch(`${baseUrl}/api/photos`).catch(e => undefined);
  const imgs: WeddingImage[] | undefined = await imgResponse?.json();

  if (!imgs) {
    return <div>Kunde ej hämta bilder, vänligen kontakta Jonathan</div>;
  }

  return imgs.map((img, index) => (
    <>
    {index > 0 && index % 50 === 0 && (
      <div className="w-full text-center flex items-center">
<hr className="flex-grow mx-4" />
<h6 className="text-[3rem] text-primary">{index} / {imgs.length}</h6>
<hr className="flex-grow mx-4" />
</div>
        )}
    <div key={img.filename} data-filename={img.filename} className="px-4">
      <ImageComponent img={img} user={user} />
    </div>
          </>
  ));
};

export default Page;
