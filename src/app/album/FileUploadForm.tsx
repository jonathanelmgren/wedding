"use client";

import { sendEventToGA } from "@/utils/sendEventToGA";
import { uploadImages } from "@/utils/uploadImages";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";

const photoExtensions = [
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
const videoExtensions = [
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

const isValidFileType = (file: File) => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return (
    photoExtensions.includes(extension!) || videoExtensions.includes(extension!)
  );
};

const isValidFileSize = (file: File) => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (photoExtensions.includes(extension!)) {
    return file.size <= 200 * 1024 * 1024; // 200 MB
  }
  if (videoExtensions.includes(extension!)) {
    return file.size <= 20 * 1024 * 1024; // 20 GB
  }
  return false;
};

export const FileUploadForm = ({ user }: { user: string }) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [stateMessage, setStateMessage] = useState<string>("");
  const [largeFilesWarning, setLargeFilesWarning] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const dataTransfer = new DataTransfer();
      let largeFileWarningMsg = "";
      Array.from(e.target.files).forEach((file) => {
        if (isValidFileType(file) && isValidFileSize(file)) {
          dataTransfer.items.add(file);
          if (file.size > 50 * 1024 * 1024) {
            largeFileWarningMsg += `${file.name} är över 50MB och kan vara långsam att ladda upp. `;
          }
        }
      });
      if (dataTransfer.files.length !== e.target.files.length) {
        setStateMessage(
          "Några filer har antingen fel filtyp eller är för stor.",
        );
      }
      setFiles(dataTransfer.files);
      setLargeFilesWarning(largeFileWarningMsg);
    } else {
      setFiles(null);
      setLargeFilesWarning("");
    }
  };

  const formAction = async (formData: FormData) => {
    sendEventToGA("submit", "file-upload", "upload", user);
    const { failureCount, successCount } = await uploadImages(formData);
    if (failureCount === 0) {
      setStateMessage(`Allt laddades upp korrekt`);
    } else if (successCount === 0) {
      setStateMessage(`Något gick fel. Kunde ej ladda upp media`);
    } else {
      setStateMessage(
        `${successCount} media uppladdade, ${failureCount} media kunde ej laddas upp`,
      );
    }
  };

  return (
    <form
      action={formAction}
      className="flex flex-col items-center justify-center w-full gap-4 mt-4"
    >
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
          {files && files.length > 0 && (
            <p className="text-xs absolute right-0 bottom-2 text-gray-500">
              Du laddar upp {files?.length} filer
            </p>
          )}
        </div>
        <input
          ref={inputFileRef}
          onChange={handleFileChange}
          multiple
          id="dropzone-file"
          type="file"
          name="files"
          className="hidden"
        />
      </label>
      {largeFilesWarning && (
        <p className="text-xs text-yellow-600">{largeFilesWarning}</p>
      )}
      <div className="flex flex-col gap-4 items-center justify-center">
        <SubmitButton />
      </div>
      {stateMessage && <p>{stateMessage}</p>}
    </form>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className="text-center bg-primary px-4 py-2 text-white"
    >
      {pending ? `Laddar upp media...` : "Skicka"}
    </button>
  );
};
