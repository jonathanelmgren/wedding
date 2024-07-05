"use server";

import { refreshAccessToken } from "./googleAuth";

const guestsAlbumId =
  "AJlFrfFXuAR7JBC23vE2-2xrqTY30AhO_UQNHwVt0oBwoCWe55nLui58pRLCPAREhKAlneaBLkCf";

interface UploadResult {
  successCount: number;
  failureCount: number;
}

export const uploadImages = async (
  formData: FormData,
): Promise<UploadResult> => {
  try {
    const files = formData.getAll("files");
    const accessToken = await refreshAccessToken();
    if (!accessToken) return { successCount: 0, failureCount: files.length };

    const uploadTokens: { uploadToken: string; fileName: string }[] = [];
    let successCount = 0;
    let failureCount = 0;

    for (const file of files) {
      if (!(file instanceof File)) {
        failureCount++;
        continue;
      }

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
        successCount++;
      } else {
        failureCount++;
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

    if (batch.ok) {
      return { successCount, failureCount };
    } else {
      // If batch creation fails, all upload tokens are considered failed
      failureCount += uploadTokens.length;
      successCount = 0;
      return { successCount, failureCount };
    }
  } catch (e) {
    // In case of any error, consider all files as failed
    return { successCount: 0, failureCount: formData.getAll("files").length };
  }
};
