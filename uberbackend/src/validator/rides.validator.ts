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

