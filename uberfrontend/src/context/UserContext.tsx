import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { UserProps } from "../types";

interface UserDataContextProps {
  user: UserProps | null;
  setUser: Dispatch<SetStateAction<UserProps | null>>;
  isLoading?: boolean;
  setIsLoading?: Dispatch<SetStateAction<boolean>>;
  error?: string;
  setError?: Dispatch<SetStateAction<string>>;
}

// Create Context with a default value (can be undefined initially)
export const UserDataContext = createContext<UserDataContextProps | undefined>(undefined);


// UserContext component to provide the state to children components
export const UserContext = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const value = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    error,
    setError,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

const useUserContext = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContext');
  }
  return context;
};

export default useUserContext;
