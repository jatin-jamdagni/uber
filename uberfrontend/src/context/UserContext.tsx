import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

// User Props interface
interface UserProps {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  socketId: string | null;
  createdAt: string;
  updatedAt: string;
}

// UserDataContext interface
interface UserDataContextProps {
  user: UserProps | null;
  setUser: Dispatch<SetStateAction<UserProps | null>>;
  isLoading?: boolean;
  setIsLoading?: Dispatch<SetStateAction<boolean>>;
  error?: string | null;
  setError?: Dispatch<SetStateAction<string | null>>;
}

// Create Context with a default value (can be undefined initially)
export const UserDataContext = createContext<UserDataContextProps | undefined>(
  undefined
);

interface UserContextProps {
  children: ReactNode;
}

// UserContext component to provide the state to children components
export const UserContext = ({ children }: UserContextProps) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

// Custom hook to consume the context
const useUserContext = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContext');
  }
  return context;
};

export default useUserContext;
