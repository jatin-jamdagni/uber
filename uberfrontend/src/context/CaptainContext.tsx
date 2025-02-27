// import React, {
//   createContext,
//   Dispatch,
//   SetStateAction,
//   useContext,
//   useState,
// } from "react";
// import { SignInResponse } from "../types";

// interface Captain {
//   email: string;
//   fullName: {
//     firstName: string;
//     lastName: string;
//   };
// }

// interface CaptainContextType {
//   captain: Captain;
//   setCaptain: Dispatch<SetStateAction<Captain>>;
//   isLoading: boolean;
//   setIsLoading: Dispatch<SetStateAction<boolean>>;
//   error: string;
//   setError: Dispatch<SetStateAction<string>>;
//   updateCaptain: (captainData: Captain) => void;
// }

// export const CaptainDataContext = createContext<CaptainContextType | undefined>(
//   undefined
// );

// export const CaptainContext = ({ children }: { children: React.ReactNode }) => {
//   // Initialize state with proper types
//   const [captain, setCaptain] = useState<SignInResponse>({
//     email: "",
//     fullName: {
//       firstName: "",
//       lastName: "",
//     },
//   }); // state can be Captain or null
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string>("");

//   // Function to update captain
//   const updateCaptain = (captainData: Captain) => {
//     setCaptain(captainData);
//   };

//   // Value to be provided via context
//   const value = {
//     captain,
//     setCaptain,
//     isLoading,
//     setIsLoading,
//     error,
//     setError,
//     updateCaptain,
//   };

//   return (
//     <CaptainDataContext.Provider value={value}>
//       {children}
//     </CaptainDataContext.Provider>
//   );
// };

// // export default CaptainContext;



// const useCaptainContext = () => {
//   const context = useContext(CaptainDataContext);
//   if (!context) {
//     throw new Error('useCaptainContext must be used within a CaptainContextProvider');
//   }
//   return context;
// };

// export default useCaptainContext;


import React, { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

// Define the Captain type based on the response
interface Captain {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  socketId: string | null;
  status: "INACTIVE" | "ACTIVE"; // Add more statuses as needed
  createdAt: string;
  updatedAt: string;
}

// Define the context type
interface CaptainContextType {
  captain: Captain | null; // Captain can be null before user is authenticated
  setCaptain: Dispatch<SetStateAction<Captain | null>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  updateCaptain: (captainData: Captain) => void;
}

// Create the context
export const CaptainDataContext = createContext<CaptainContextType | undefined>(undefined);

// CaptainContext provider component
export const CaptainContext = ({ children }: { children: React.ReactNode }) => {
  // Initialize captain state as null, until the captain is authenticated
  const [captain, setCaptain] = useState<Captain | null>(null);
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

  return <CaptainDataContext.Provider value={value}>{children}</CaptainDataContext.Provider>;
};

// Hook to access the Captain context
const useCaptainContext = () => {
  const context = useContext(CaptainDataContext);
  if (!context) {
    throw new Error('useCaptainContext must be used within a CaptainContextProvider');
  }
  return context;
};

export default useCaptainContext;
