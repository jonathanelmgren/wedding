"use server";

import { refreshAccessToken } from "./googleAuth";

const guestsAlbumId =
  "AJlFrfFXuAR7JBC23vE2-2xrqTY30AhO_UQNHwVt0oBwoCWe55nLui58pRLCPAREhKAlneaBLkCf";

export const uploadImages = async (formData: FormData): Promise<boolean> => {
  try {
    const files = formData.getAll("files");
    const accessToken = await refreshAccessToken();
    if (!accessToken) return false;

    const uploadTokens: { uploadToken: string; fileName: string }[] = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;

      const res = await fetch(
        "https://photoslibrary.googleapis.com/v1/uploads",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/octet-stream",
            "X-Goog-Upload-Content-Type": file.type,
            "X-Goog-Upload-Protocol": "raw",
          },
          method: "POST",
          body: file,
        },
      );

      if (res.ok) {
        const token = await res.text();
        const sanitizedFileName = file.name.split(".").shift();
        uploadTokens.push({
          uploadToken: token,
          fileName: sanitizedFileName || "wrong",
        });
      }
    }

    const batchBody = {
      albumId: guestsAlbumId,
      newMediaItems: uploadTokens.map((token) => {
        return {
          description: "Wedding Guest Photo",
          simpleMediaItem: token,
        };
      }),
    };

    const batch = await fetch(
      "https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        method: "POST",
        body: JSON.stringify(batchBody),
      },
    );
    const batchJson = await batch.json();
    if (batch.ok) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};
