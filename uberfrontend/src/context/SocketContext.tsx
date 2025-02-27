import { createContext, useEffect, ReactNode, useContext } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket;
}

export const SocketContext = createContext<SocketContextType | undefined>(
  undefined
);

const socket = io(`${import.meta.env.VITE_BASE_URL}`);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};





const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a useSocketContext');
  }
  return context;
};

export default useSocketContext;
