import { Request, Response } from "express";
import { CreateRideProps, CreateRideValidator, GetFareProps, GetFareValidator } from "../validator/rides.validator";
import { HTTP_STATUS } from "../libs/constants";
import { getDistanceTimebyOriginDestination } from "../Maps/googleMaps";
import { useGetFare } from "../hooks/useGetFare";
import { useGetOtp } from "../hooks/useGetOTP";
import { userInfo } from "os";

export const GetFare = async (req: Request<{}, {}, {}, GetFareProps>, res: Response): Promise<any> => {
    const result = GetFareValidator.safeParse(req.query);
    if (result.error) {
        return res.status(HTTP_STATUS.INVALID_REQUEST).json(result.error.issues[0].message);
    }
    try {
        console.log("this is result data", result.data)

        const distanceTime = await getDistanceTimebyOriginDestination({
            destination: result.data.destination,
            origin: result.data.pickup
        });
        console.log("this is distanceTime", distanceTime)


        const fare = await useGetFare(distanceTime);
        console.log("this is fare", fare)

        return res.status(HTTP_STATUS.CREATED).json(fare);

    } catch (err) {
        console.log(err);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Unable to get fare" });
    }
};


export const createRide = async (req: Request<{}, {}, CreateRideProps>, res: Response): Promise<any> => {

    const result = CreateRideValidator.safeParse(req.body);
    if (result.error) {
        return res.status(HTTP_STATUS.INVALID_REQUEST).json(result.error.issues[0].message);
    }

    try {

        const existingRide = await req.prisma.ride.findFirst({
            where: {
                userId: req.user.id,
            },
            select: {
                status: true,
                userId: true
            }
        });

        if (
            existingRide &&
            (existingRide.status === "PENDING" ||
                existingRide.status === "ONGOING" ||
                existingRide.status === "ACCEPTED")
        ) {
            return res.status(HTTP_STATUS.INVALID_REQUEST).json({
                message: `You already have a ride that is ${existingRide.status.toUpperCase()}. Please cancel or complete that ride before creating a new one.`,
                status: existingRide.status
            });
        }

        const { destination, pickup, vehicleType } = result.data;

        const distanceTime = await getDistanceTimebyOriginDestination({
            origin: pickup,
            destination: destination
        });

        const fare = await useGetFare(distanceTime);
        const fareForVehicle = fare[vehicleType];

        const otp = useGetOtp(6);

        const ride = await req.prisma.ride.create({
            data: {
                destination,
                pickup,
                fare: fareForVehicle,
                userId: req.user.id,
                otp: otp
            },
            select: {
                destination: true,
                pickup: true,
                fare: true,
                userId: true,
                status: true
            }
        });

        return res.status(HTTP_STATUS.CREATED).json(ride);

    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Unable to create ride" });
    }
};
