"use client";

import { useUser } from "@/components/UserProvider";
import { sendEventToGA } from "@/utils/sendEventToGA";
import { uploadImages } from "@/utils/uploadImages";
import { useState } from "react";
import { useFormStatus } from "react-dom";

const PHOTO_EXTENSIONS = [
  "avif",
  "bmp",
  "gif",
  "heic",
  "ico",
  "jpg",
  "jpeg",
  "png",
  "tiff",
  "webp",
  "raw",
];
const VIDEO_EXTENSIONS = [
  "3gp",
  "3g2",
  "asf",
  "avi",
  "divx",
  "m2t",
  "m2ts",
  "m4v",
  "mkv",
  "mmv",
  "mod",
  "mov",
  "mp4",
  "mpg",
  "mts",
  "tod",
  "wmv",
];

const MAX_PHOTO_SIZE = 200 * 1024 * 1024; // 200 MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024 * 1024; // 20 GB
const LARGE_FILE_THRESHOLD = 50 * 1024 * 1024; // 50 MB

interface FileValidationResult {
  isValid: boolean;
  isLarge: boolean;
}

const validateFile = (file: File): FileValidationResult => {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  const isValidType = [...PHOTO_EXTENSIONS, ...VIDEO_EXTENSIONS].includes(
    extension,
  );
  const isValidSize = PHOTO_EXTENSIONS.includes(extension)
    ? file.size <= MAX_PHOTO_SIZE
    : file.size <= MAX_VIDEO_SIZE;

  return {
    isValid: isValidType && isValidSize,
    isLarge: file.size > LARGE_FILE_THRESHOLD,
  };
};

export const FileUploadForm: React.FC = () => {
  const { user } = useUser();
  const [stateMessage, setStateMessage] = useState<string>("");
  const [largeFilesWarning, setLargeFilesWarning] = useState<string>("");

  const formAction = async (formData: FormData) => {
    sendEventToGA("submit", "file-upload", "upload", user ?? "unknown");
    const files = Array.from(formData.getAll("files")).filter(
      (file): file is File => file instanceof File && file.name !== "",
    );

    if (files.length === 0) {
      setStateMessage("Inga filer valda");
      return;
    }

    const validFiles: File[] = [];
    let largeFileWarningMsg = "";

    files.forEach((file) => {
      const { isValid, isLarge } = validateFile(file);
      if (isValid) {
        validFiles.push(file);
        if (isLarge) {
          largeFileWarningMsg += `${file.name} är över 50MB och kan vara långsam att ladda upp. `;
        }
      }
    });

    if (validFiles.length !== files.length) {
      largeFileWarningMsg +=
        "Några filer har antingen fel filtyp eller är för stor. Du kan fortfarande ladda upp de andra filerna. ";
    }

    setLargeFilesWarning(largeFileWarningMsg);

    if (validFiles.length === 0) {
      setStateMessage("Du har valt filer, men inga av dessa är giltiga");
      return;
    }

    const uploadData = new FormData();
    validFiles.forEach((file) => uploadData.append("files", file));

    const { failureCount, successCount } = await uploadImages(uploadData);
    setStateMessage(
      failureCount === 0
        ? "Allt laddades upp korrekt"
        : successCount === 0
          ? "Något gick fel. Kunde ej ladda upp media"
          : `${successCount} media uppladdade, ${failureCount} media kunde ej laddas upp`,
    );
  };

  return (
    <form
      action={formAction}
      className="flex flex-col items-center justify-center w-full gap-4 mt-4"
    >
      <FileUploadInput />
      {largeFilesWarning && (
        <p className="text-xs text-yellow-600">{largeFilesWarning}</p>
      )}
      <SubmitButton />
      {stateMessage && <p>{stateMessage}</p>}
    </form>
  );
};

const FileUploadInput: React.FC = () => (
  <label
    htmlFor="dropzone-file"
    className="px-10 py-8 relative flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
  >
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center">
        <svg
          className="w-8 h-8 text-gray-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
          />
        </svg>
        <div>
          <p className="text-sm text-gray-500">
            Klicka för att ladda upp egna bilder och filmer
          </p>
          <p className="text-sm text-gray-500">
            Du kan ladda upp flera på samma gång
          </p>
        </div>
      </div>
      <p className="text-xs text-gray-500">(Syns ej i detta galleriet)</p>
    </div>
    <input
      multiple
      id="dropzone-file"
      type="file"
      name="files"
      className="hidden"
    />
  </label>
);

const SubmitButton: React.FC = () => {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className="text-center bg-primary px-4 py-2 text-white"
    >
      {pending ? "Laddar upp media..." : "Skicka"}
    </button>
  );
};
