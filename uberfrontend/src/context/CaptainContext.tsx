
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { Captain } from "../types";

// Define the Captain type based on the response

// Define the context type
interface CaptainContextType {
  captain: Captain | null;
  setCaptain: Dispatch<SetStateAction<Captain | null>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  error: string;
  setError: Dispatch<SetStateAction<string>>;

}

// Create the context
export const CaptainDataContext = createContext<CaptainContextType | undefined>(undefined);

export const CaptainContext = ({ children }: { children: React.ReactNode }) => {
  const [captain, setCaptain] = useState<Captain | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");


  const value = {
    captain,
    setCaptain,
    isLoading,
    setIsLoading,
    error,
    setError,
  };

  return <CaptainDataContext.Provider value={value}>{children}</CaptainDataContext.Provider>;
};

const useCaptainContext = () => {
  const context = useContext(CaptainDataContext);
  if (!context) {
    throw new Error('useCaptainContext must be used within a CaptainContextProvider');
  }

  return context;
};

export default useCaptainContext;
