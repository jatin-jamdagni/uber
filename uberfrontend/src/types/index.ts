// Type for the Captain object
export interface Captain {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    socketId: string | null;
    status: "INACTIVE" | "ACTIVE";  // Assuming these are the only possible values for status
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}

// Type for the response object
export interface SignInResponse {
    message: string;
    captain: Captain;
    token: string; // JWT token
}


export type vechileTypeProps = "AUTO" | "BIKE" | "CAR"
export interface ConfirmRideProps {
    pickup: string;
    destination: string;
    fare: Record<vechileTypeProps, number> | undefined;
    vehicleType: vechileTypeProps | undefined;
    setConfirmRidePanel: (value: boolean) => void;
    setVehicleFound: (value: boolean) => void;
    createRide: () => void;
}