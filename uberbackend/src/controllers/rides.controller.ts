import { Request, Response } from "express";
import { ConfirmRideProp, ConfirmRideValidator, CreateRideProps, CreateRideValidator, EndRideProps, GetFareProps, GetFareValidator, StartRideProps, StartRideValidator } from "../validator/rides.validator";
import { HTTP_STATUS } from "../libs/constants";
import { getCaptainsInTheRadius, getCoordinatesByAddress, getDistanceTimebyOriginDestination } from "../Maps/googleMaps";
import { useGetFare } from "../hooks/useGetFare";
import { useGetOtp } from "../hooks/useGetOTP";
import { userInfo } from "os";
import { sendMessageToSocketId } from "../socket";

export const GetFare = async (req: Request<{}, {}, {}, GetFareProps>, res: Response): Promise<any> => {
    const result = GetFareValidator.safeParse(req.query);
    if (result.error) {
        return res.status(HTTP_STATUS.INVALID_REQUEST).json(result.error.issues[0].message);
    }
    try {

        const distanceTime = await getDistanceTimebyOriginDestination({
            destination: result.data.destination,
            origin: result.data.pickup
        });


        const fare = await useGetFare(distanceTime);

        return res.status(HTTP_STATUS.CREATED).json(fare);

    } catch (err) {
        console.log(err);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Unable to get fare" });
    }
};

export const createRide = async (req: Request, res: Response): Promise<any> => {
    const result = CreateRideValidator.safeParse(req.body);
    if (!result.success) {
        return res.status(HTTP_STATUS.INVALID_REQUEST).json({ error: result.error.issues[0].message });
    }

    try {
        const { destination, pickup, vehicleType } = result.data;

        // ✅ Use Prisma transaction to prevent race conditions
        const ride = await prisma.$transaction(async (tx) => {
            // ✅ Check if the user already has an active ride
            const existingRide = await tx.ride.findFirst({
                where: {
                    userId: req.user.id,
                    status: { in: ["PENDING", "ONGOING", "ACCEPTED"] },
                },
                select: { status: true },
            });

            if (existingRide) {
                throw new Error(`You already have a ride that is ${existingRide.status.toUpperCase()}. Please cancel or complete it first.`);
            }

            // ✅ Calculate distance & time between pickup and destination
            const distanceTime = await getDistanceTimebyOriginDestination({ origin: pickup, destination });
            if (!distanceTime) {
                throw new Error('Unable to calculate distance or time for the given locations.');
            }

            // ✅ Calculate fare for the ride
            const fare = await useGetFare(distanceTime);
            if (!fare || !fare[vehicleType]) {
                throw new Error('Fare for the selected vehicle type is unavailable.');
            }

            // ✅ Generate OTP for the ride
            const otp = useGetOtp(6);

            // ✅ Create the ride in the database
            return await tx.ride.create({
                data: {
                    destination,
                    pickup,
                    distance: distanceTime.distance,
                    duration: distanceTime.duration,
                    fare: fare[vehicleType],
                    userId: req.user.id,
                    otp,
                    status: "PENDING",
                },
                select: { id: true, destination: true, pickup: true, fare: true, userId: true, status: true }
            });
        });

        // ✅ Get pickup coordinates from the address
        const pickupCoordinates = await getCoordinatesByAddress(pickup);
        if (!pickupCoordinates || !pickupCoordinates.lat || !pickupCoordinates.lng) {
            return res.status(HTTP_STATUS.INVALID_REQUEST).json({
                message: 'Invalid pickup address coordinates.',
            });
        }

        // ✅ Try to find captains within 2 km radius first
        let captainsInRadius = await getCaptainsInTheRadius(pickupCoordinates.lat, pickupCoordinates.lng, 2);
        if (!captainsInRadius || captainsInRadius.length === 0) {
            captainsInRadius = await getCaptainsInTheRadius(pickupCoordinates.lat, pickupCoordinates.lng, 4);
        }

        if (!captainsInRadius || captainsInRadius.length === 0) {
            return res.status(402).json({
                message: 'No captains available in the nearby area.',
            });
        }

        // ✅ Send ride details to nearby captains via WebSockets
        const rideWithUser = await prisma.ride.findUnique({
            where: { id: ride.id },
            select: {
                id: true,
                destination: true,
                distance: true,
                fare: true,
                pickup: true,
                duration: true,
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                },
            }
        });

        captainsInRadius.forEach((captain) => {
            sendMessageToSocketId(captain.socketId, {
                event: "new-ride",
                data: rideWithUser,
            });
        });

        return res.status(HTTP_STATUS.CREATED).json(ride);
    } catch (error) {
        console.error("Error creating ride:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            error: "Unable to create ride. Please try again later.",
            details: error.message || error
        });
    }
};



export const ConfirmRide = async (req: Request<{}, {}, ConfirmRideProp>, res: Response): Promise<any> => {
    const result = ConfirmRideValidator.safeParse(req.body);

    if (!result.success) {
        return res.status(HTTP_STATUS.INVALID_REQUEST).json({ error: result.error.issues[0].message });
    }


    try {

        await req.prisma.ride.update({
            data: {
                status: "ACCEPTED",
                captainId: result.data.captainId
            },
            where: {
                id: result.data.rideId
            }
        })


        const ride = await req.prisma.ride.findFirst({
            where: {
                id: result.data.rideId
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        socketId: true
                    }
                },
                captain: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true,
                        status: true,
                        vehicle: true,
                        location: true,
                        socketId: true

                    }
                }
            }
        })

        if (!ride) {
            return res.status(404).json({
                error: "Ride not found"
            })
        }

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(HTTP_STATUS.CREATED).json(
            ride
        )
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            { error: "Unable to confirm ride" }
        )
    }
}


export const StartRide = async (req: Request<{}, {}, {}, StartRideProps>, res: Response): Promise<any> => {


    const result = StartRideValidator.safeParse(req.query);

    if (!result.success) {
        return res.status(HTTP_STATUS.INVALID_REQUEST).json({ error: result.error.issues[0].message });
    }




    try {



        const ride = await req.prisma.ride.findFirst({
            where: {
                id: result.data.rideId
            },
            include: {
                user: true,
                captain: true,
            }
        })

        if (!ride) {
            return res.status(404).json({
                error: "Ride not found"
            })
        }

        if (ride.status !== "ACCEPTED") {
            return res.status(404).json({
                error: "Ride not accepted"
            })
        }

        if (ride.otp !== result.data.otp) {
            return res.status(402).json({
                error: "Invalid OTP"
            })
        }

        await req.prisma.ride.update({
            data: {
                status: "ONGOING"
            }, where: {
                id: result.data.rideId
            }
        })

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);


    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            error: "Unable to start ride"
        })
    }



}
export const EndRide = async (req: Request<{}, {}, EndRideProps>, res: Response): Promise<any> => {
    const result = ConfirmRideValidator.safeParse(req.body);

    if (!result.success) {
        return res.status(HTTP_STATUS.INVALID_REQUEST).json({ error: result.error.issues[0].message });
    }


    try {

    
        const ride = await req.prisma.ride.findFirst({
            where: {
                id: result.data.rideId,
                captainId: req.captain.id
            },
            include: {
                user: true,
                captain: true,
            }
        })

        if (!ride) {
            return res.status(404).json({
                error: "Ride not found"
            })
        }

        if (ride.status !== "ONGOING") {
            return res.status(404).json({
                error: "Ride not ongoing"
            })
        }
    

        await req.prisma.ride.update({
            data:{
                status: "COMPLETED"
            },
            where:{
                id: result.data.rideId
            }
        })
      
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);

    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            error: "Unable to end ride"
        })
    }
}