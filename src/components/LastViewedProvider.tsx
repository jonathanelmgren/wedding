"use client";

import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect
} from "react";
import ScrollToLastViewedModal from "./ScrollToLastviewedModal";

interface LastViewedContextType {
  scrollToLastViewed: () => void;
}

const LastViewedContext = createContext<LastViewedContextType | undefined>(
  undefined,
);

interface LastViewedProviderProps {
  children: ReactNode;
}

const escapeCSS = (str: string) =>
  str.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");

const getLocalStorage = () => {
  if (typeof window === "undefined") {
    return undefined;
  }
  return localStorage;
};

const scrollToLastViewed = () => {
  const lastViewed = getLocalStorage()?.getItem("lastViewed");
  if (!lastViewed) return;
  const escapedLastViewed = escapeCSS(lastViewed);
  const wrapper = document.querySelector(
    `div[data-filename="${escapedLastViewed}"]`,
  );
  if (!(wrapper instanceof HTMLElement)) return;
  wrapper.scrollIntoView({ behavior: "smooth", block: "center" });
  getLocalStorage()?.removeItem("lastViewed");
};

export const LastViewedProvider: React.FC<LastViewedProviderProps> = ({
  children,
}) => {
  const lastViewed = getLocalStorage()?.getItem("lastViewed") ?? null;

  const updateLastViewed = useCallback((filename: string) => {
    getLocalStorage()?.setItem("lastViewed", filename);
  }, []);

  const removeLastViewed = () => {
    getLocalStorage()?.removeItem("lastViewed");
  };

  const handleScroll = useCallback(() => {
    const elements = document.querySelectorAll("div[data-filename]");
    const viewportHeight = window.innerHeight;

    elements.forEach((element) => {
      if (element instanceof HTMLElement) {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= viewportHeight;

        if (isVisible) {
          const filename = element.getAttribute("data-filename");
          if (filename) {
            updateLastViewed(filename);
          }
        }
      }
    });
  }, [updateLastViewed]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <LastViewedContext.Provider
      value={{
        scrollToLastViewed,
      }}
    >
      {lastViewed && (
        <ScrollToLastViewedModal onClose={removeLastViewed} />
      )}
      {children}
    </LastViewedContext.Provider>
  );
};

export const useLastViewed = () => {
  const context = useContext(LastViewedContext);
  if (context === undefined) {
    throw new Error("useLastViewed must be used within a LastViewedProvider");
  }
  return context;
};
