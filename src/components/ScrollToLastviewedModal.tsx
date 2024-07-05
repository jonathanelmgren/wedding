"use client";
import React, { useEffect, useRef, useState } from "react";
import { useLastViewed } from "./LastViewedProvider";

interface ScrollToLastViewedModalProps {
  onClose: () => void;
}

const ScrollToLastViewedModal: React.FC<ScrollToLastViewedModalProps> = ({
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { scrollToLastViewed } = useLastViewed();
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleYes = () => {
    setClosed(true);
    scrollToLastViewed();
    onClose();
  };

  const handleNo = () => {
    setClosed(true);
    onClose();
  };

  return (
    !closed && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div
          ref={modalRef}
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Fortsätt där du slutade?
          </h2>
          <p className="text-gray-600 mb-6">
            Jag ser att du redan har tittat på lite bilder. Vill du fortsätta
            där du avslutade?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleNo}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Nej
            </button>
            <button
              onClick={handleYes}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Ja
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ScrollToLastViewedModal;
