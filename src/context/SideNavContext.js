import { useState } from "react";
import { createContext } from "react";

export const SideNavContext = createContext();

export default function SideNavProvider({ children }) {
  const [open, setOpen] = useState(true);
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <SideNavContext.Provider value={[open, handleToggle]}>
      {children}
    </SideNavContext.Provider>
  );
}
