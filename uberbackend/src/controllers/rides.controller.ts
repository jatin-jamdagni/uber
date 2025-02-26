import { Vehicle } from './../../node_modules/.prisma/client/index.d';
import { Request, Response } from "express"
import { CreateRideProps, CreateRideValidator, GetFareProps, GetFareValidator, } from "../validator/rides.validator";
import { HTTP_STATUS } from "../libs/constants";
import { getDistanceTimebyOriginDestination } from "../Maps/googleMaps";
import { useGetFare } from "../hooks/useGetFare";
import { useGetOtp } from "../hooks/useGetOTP";

export const GetFare = async (req: Request<{}, {}, GetFareProps>, res: Response): Promise<any> => {
    const result = GetFareValidator.safeParse(req.body);
    if (result.error) {
        return res.status(HTTP_STATUS.INVALID_REQUEST).json(result.error.issues[0].message);
    }
    try {
        const fare = await useGetFare({
            destination: result.data.destination,
            pickup: result.data.pickup
        })

        return res.status(HTTP_STATUS.CREATED).json(fare)

    } catch (err) {
        console.log(err);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Unable to get fare" })
    }
}

export const createRide = async (req: Request<{}, {}, CreateRideProps>, res: Response): Promise<any> => {


    const result = CreateRideValidator.safeParse(req.body);
    if (result.error) {
        return res.status(HTTP_STATUS.INVALID_REQUEST).json(result.error.issues[0].message);
    }

    try {

        const { destination, pickup, vehicleType } = result.data;
        const distanceTime = await getDistanceTimebyOriginDestination({

        });
        const fare = await useGetFare(distanceTime);

        const otp = useGetOtp(6);

        await req.prisma.ride.create({
            data: {
                destination,
                pickup,
                fare: fare[vehicleType],
                distance: distanceTime.distance,
                duration: distanceTime.duration,
                user: { connect: { id: req.user.id } },
                captain: { connect: { id: req.captain.id } }
            }
        })



    } catch (error) {

    }


}