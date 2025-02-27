import { Request, Response } from "express";
import { CreateRideProps, CreateRideValidator, GetFareProps, GetFareValidator } from "../validator/rides.validator";
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
        // ✅ Check if the user already has an active ride
        const existingRide = await prisma.ride.findFirst({
            where: {
                userId: req.user.id,
                status: { in: ["PENDING", "ONGOING", "ACCEPTED"] },
            },
            select: { status: true },
        });

        if (existingRide) {
            return res.status(HTTP_STATUS.INVALID_REQUEST).json({
                message: `You already have a ride that is ${existingRide.status.toUpperCase()}. Please cancel or complete it first.`,
                status: existingRide.status
            });
        }

        const { destination, pickup, vehicleType } = result.data;

        // ✅ Calculate distance & time
        const distanceTime = await getDistanceTimebyOriginDestination({ origin: pickup, destination });
        const fare = await useGetFare(distanceTime);
        const fareForVehicle = fare[vehicleType];

        const otp = useGetOtp(6);

        // ✅ Create the ride
        const ride = await prisma.ride.create({
            data: {
                destination,
                pickup,
                fare: fareForVehicle,
                userId: req.user.id,
                otp: otp,
                status: "PENDING",
            },
            select: { id: true, destination: true, pickup: true, fare: true, userId: true, status: true }
        });

        // ✅ Get pickup coordinates
        const pickupCoordinates = await getCoordinatesByAddress(pickup);

        // ✅ Find captains in a 2km radius
        const captainsInRadius = await getCaptainsInTheRadius(pickupCoordinates.lat, pickupCoordinates.lng, 2);


        // ✅ Send ride details to nearby captains via WebSockets
        captainsInRadius.forEach((captain) => {
            sendMessageToSocketId(captain.socketId, {
                event: "new-ride",
                data: ride,
            });
        });

        return res.status(HTTP_STATUS.CREATED).json(ride);
    } catch (error) {
        console.error("Error creating ride:", error);
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Unable to create ride" });
    }
};