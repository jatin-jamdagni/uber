// socket.types.ts
export interface Location {
    ltd: number;
    lng: number;
}

export interface JoinData {
    userId: string;
    userType: 'user' | 'captain';
}

export interface UpdateLocationData {
    userId: string;
    location: Location;
}

export interface MessageObject {
    event: string;
    data: any;
}

export interface ServerToClientEvents {
    error: (error: { message: string; error?: any }) => void;
}

export interface ClientToServerEvents {
    join: (data: JoinData) => void;
    'update-location-captain': (data: UpdateLocationData) => void;
}