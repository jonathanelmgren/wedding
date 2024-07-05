"use server";
import { GoogleImagesResponse, WeddingImage } from "ts/types";
import { refreshAccessToken } from "./googleAuth";

const PAGE_SIZE = 100;

export const getImages = async (): Promise<WeddingImage[] | undefined> => {
  const accessToken = await refreshAccessToken();
  if (!accessToken) return;

  let allImages: WeddingImage[] = [];
  let nextPageToken: string | undefined = undefined;

  do {
    const result = await fetchImagesPage(accessToken, nextPageToken);
    if (!result) break;

    allImages = allImages.concat(result.images);
    nextPageToken = result.pagination;
  } while (nextPageToken);

  return allImages;
};

const fetchImagesPage = async (
  accessToken: string,
  pageToken?: string,
): Promise<{ pagination: string; images: WeddingImage[] } | undefined> => {
  const res = await fetch(
    "https://photoslibrary.googleapis.com/v1/mediaItems:search",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageSize: PAGE_SIZE,
        albumId:
          "AJlFrfE6jO76279Rk8zWTol7JALJ480J0ppT21ItC7MWA42cSAfGTAxBPIdDDEFU6g22_OIQEsoN",
        ...(pageToken && { pageToken: pageToken }),
      }),
      next: {
        revalidate: 3600,
      },
    },
  );

  if (res.ok) {
    const json: GoogleImagesResponse = await res.json();
    const mediaItems = json.mediaItems;
    return {
      pagination: json.nextPageToken,
      images: mediaItems.map((item) => {
        const { baseUrl, filename, mediaMetadata } = item;
        const { width, height } = mediaMetadata;
        const aspectRatio = parseFloat(width) / parseFloat(height);

        const fullSizeWidth = 1920;
        const thumbnailWidth = 600;
        const thumbnailDesktopWidth = 1200;

        const thumbnailHeight = Math.round(thumbnailWidth / aspectRatio);
        const fullSizeHeight = Math.round(fullSizeWidth / aspectRatio);
        const thumbnailDesktopHeight = Math.round(
          thumbnailDesktopWidth / aspectRatio,
        );
        return {
          default: {
            url: `${baseUrl}=w${fullSizeWidth}`,
            width: fullSizeWidth,
            height: fullSizeHeight,
          },
          thumbnail: {
            url: `${baseUrl}=w${thumbnailWidth}`,
            width: thumbnailWidth,
            height: thumbnailHeight,
          },
          thumbnailDesktop: {
            url: `${baseUrl}=w${thumbnailDesktopWidth}`,
            width: thumbnailDesktopWidth,
            height: thumbnailDesktopHeight,
          },
          filename,
        };
      }),
    };
  }
  return undefined;
};
