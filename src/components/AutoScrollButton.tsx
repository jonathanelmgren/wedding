"use client";
import { useEffect, useRef, useState } from "react";

export const AutoScrollButton = () => {
  const [scrollSpeed, setScrollSpeed] = useState(0); // Initial speed is 0 (off)
  const autoScrollInterval = useRef<NodeJS.Timeout | number | undefined>(
    undefined,
  );

  const speeds = [0, 1, 2, 3]; // Array of speeds, including 0 for 'off'

  const speedIndex = speeds.indexOf(scrollSpeed);

  const updateAutoScroll = (newSpeed: number) => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = undefined;
    }

    if (newSpeed > 0) {
      autoScrollInterval.current = setInterval(() => {
        window.scrollBy(0, newSpeed);
      }, 20);
    }
  };

  // Function to stop auto-scrolling
  const toggleAutoScrolling = () => {
    // Find the next speed in the array, or reset to 0 if at the end
    const nextSpeedIndex = (speeds.indexOf(scrollSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextSpeedIndex];

    setScrollSpeed(nextSpeed);
    updateAutoScroll(nextSpeed);
  };

  useEffect(() => {
    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, []);

  return (
    <div className="sticky top-0 text-center right-0 left-0 w-full flex items-center justify-end mr-2">
      <button
        onClick={toggleAutoScrolling}
        className="bg-white shadow-md rounded-full px-4 py-2 mt-2 text-sm"
      >
        {`Autoscroll - ${speedIndex === 0 ? "Av" : speedIndex + "x"}`}
      </button>
    </div>
  );
};
