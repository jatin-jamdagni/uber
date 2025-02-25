/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

// Define the Captain type
interface Captain {
  email: string;
  fullName: {
    firstName: string;
    lastName: string;
  };
}

// Define the context type
interface CaptainContextType {
  captain: Captain;
  setCaptain: Dispatch<SetStateAction<Captain>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  updateCaptain: (captainData: Captain) => void; // This should accept a Captain
}

// Create the context
export const CaptainDataContext = createContext<CaptainContextType | undefined>(
  undefined
);

const CaptainContext = ({ children }: { children: React.ReactNode }) => {
  // Initialize state with proper types
  const [captain, setCaptain] = useState<Captain>({
    email: "",
    fullName: {
      firstName: "",
      lastName: "",
    },
  }); // state can be Captain or null
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Function to update captain
  const updateCaptain = (captainData: Captain) => {
    setCaptain(captainData);
  };

  // Value to be provided via context
  const value = {
    captain,
    setCaptain,
    isLoading,
    setIsLoading,
    error,
    setError,
    updateCaptain,
  };

  return (
    <CaptainDataContext.Provider value={value}>
      {children}
    </CaptainDataContext.Provider>
  );
};

export default CaptainContext;
