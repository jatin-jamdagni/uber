/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface UserProps {
  email: string;
  fullName: {
    firstName: string;
    lastName: string;
  };
}

interface UserDataContextProps {
  user: UserProps;
  setUser: Dispatch<SetStateAction<UserProps>>;
}

// Create Context with a default value (can be undefined initially)
export const UserDataContext = createContext<UserDataContextProps | undefined>(
  undefined
);

interface UserContextProps {
  children: ReactNode;
}

const UserContext = ({ children }: UserContextProps) => {
  const [user, setUser] = useState<UserProps>({
    email: "",
    fullName: {
      firstName: "",
      lastName: "",
    },
  });

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
