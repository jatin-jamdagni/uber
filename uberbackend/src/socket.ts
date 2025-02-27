// socket.types.ts
export interface Location {
    ltd: number;
    lng: number;
}

export interface JoinData {
    userId: number;
    userType: 'user' | 'captain';
}

export interface UpdateLocationData {
    userId: number;
    location: Location;
}

export interface MessageObject {
    event: string;
    data: any;
}

// socket.service.ts
import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { prisma } from './libs/client';


let io: Server;

export function initializeSocket(server: HttpServer): void {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket: Socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data: JoinData) => {
            try {
                const { userId, userType } = data;

                if (userType === 'user') {
                    try {

 
                        const updatedUser = await prisma.user.update({
                            data: {
                                socketId: socket.id,
                            },
                            where: {
                                id: userId,
                            },
                        });
                        console.log(`Updated user ${updatedUser.id} with socketId: ${updatedUser.socketId}`);
                    } catch (error) {
                        console.error('Failed to update user:', error);
                        socket.emit('error', { message: 'Failed to update user', error: error.message });
                    }
                } else if (userType === 'captain') {

                    try {


                        const updatedCaptain = await prisma.captain.update({
                            data: {
                                socketId: socket.id
                            },
                            where: {
                                id: userId
                            }
                        })
                        console.log(`Updated captain ${updatedCaptain.id} with socketId: ${updatedCaptain.socketId}`);
                    } catch (error) {
                        console.error('Failed to update captain:', error);
                        socket.emit('error', { message: 'Failed to update captain', error: error.message });
                    }

                }
            } catch (error) {
                socket.emit('error', { message: 'Failed to join', error });
            }
        });

        socket.on('update-location-captain', async (data: UpdateLocationData) => {
            try {
                const { userId, location } = data;

                if (!location) {
                    return socket.emit('error', { message: 'Invalid location data' });
                }
                // Check if the captain already has a location
                const existingLocation = await prisma.location.findUnique({
                    where: { id: userId },
                });

                if (existingLocation) {
                    // Update existing location
                    await prisma.location.update({
                        where: { id: existingLocation.id },
                        data: {
                            latitude: location.ltd,
                            longitude: location.lng,
                        },
                    });
                } else {
                    await prisma.location.create({
                        data: {
                            latitude: location.ltd,
                            longitude: location.lng,
                            captain: {
                                connect: { id: userId },
                            },
                        },
                    });
                }
            } catch (error) {
                socket.emit('error', { message: 'Failed to update location', error });
            }
        });
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

export function sendMessageToSocketId(socketId: string, messageObject: MessageObject): void {
    console.log(messageObject);

    if (!io) {
        console.log('Socket.io not initialized.');
        return;
    }

    io.to(socketId).emit(messageObject.event, messageObject.data);
}
