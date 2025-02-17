import { createContext, useContext, useEffect, useState } from "react";

const DesktopContext = createContext({ isDesktop: false });

export const DesktopProvider = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleWindowResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleWindowResize);
    handleWindowResize();

    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);
  
  return (
    <DesktopContext.Provider value={{ isDesktop }}>
      {children}
    </DesktopContext.Provider>
  );
};

export const useDesktop = () => useContext(DesktopContext);
