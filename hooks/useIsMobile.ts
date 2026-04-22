import { useState, useEffect } from "react";

/**
 * Custom hook to detect if the screen width is mobile.
 * @param breakpoint - The width threshold to consider as mobile (default: 768px)
 * @returns boolean - True if screen width <= breakpoint
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    // Initialize on mount
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return isMobile;
}


// usage
// import React from "react";
// import { useIsMobile } from "./useIsMobile";

// export default function MyComponent() {
//   const isMobile = useIsMobile(); // Default breakpoint 768px

//   return (
//     <div>
//       {isMobile ? (
//         <p>📱 You’re on a mobile screen!</p>
//       ) : (
//         <p>🖥 You’re on a desktop screen!</p>
//       )}
//     </div>
//   );
// }
