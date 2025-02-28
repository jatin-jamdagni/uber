import { z } from 'zod';

export const GetFareValidator = z.object({
    // userId: z.string().min(24, "Invalid user id").max(24, "Invalid user id"),
    pickup: z.string().nonempty().min(3, "Invalid pickup address"),
    destination: z.string().nonempty().min(3, "Invalid destination address"),
});

export type GetFareProps = z.infer<typeof GetFareValidator>


export const CreateRideValidator = z.object({
    pickup: z.string().nonempty().min(3, "Invalid pickup address"),
    destination: z.string().nonempty().min(3, "Invalid destination address"),
    vehicleType: z.enum(['CAR', 'BIKE', 'AUTO'], { message: "Invalid vehicle type" }),
});

export type CreateRideProps = z.infer<typeof CreateRideValidator>



export const ConfirmRideValidator = z.object({
    rideId: z.number(),
    captainId: z.number()
})
export type ConfirmRideProp = z.infer<typeof ConfirmRideValidator>


export const StartRideValidator = z.object({
    rideId: z.number(),
    otp: z.string().min(6).max(6)
})

export type StartRideProps = z.infer<typeof StartRideValidator>;

export const EndRideValidator = z.object({
    rideId: z.number(),
})

export type EndRideProps = z.infer<typeof EndRideValidator>;