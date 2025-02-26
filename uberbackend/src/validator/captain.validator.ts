import z from "zod";


const indianPlateRegex = /^[A-Z]{2}\d{1,2}[A-Z]{0,2}\d{4}$/;

export const captainRegisterValidator = z.object({
    firstName: z.string().min(3, { message: "First name must 3 character long" }).max(255),
    password: z.string().min(6, { message: "Password must be of 6 character long" }).max(16, { message: "Password must not be of 16 character long" }),
    email: z.string().email(),
    lastName: z.string().optional(),
    vehicle: z.object({
        color: z.string().min(3, { message: "Color must 3 character long" }),
        plate: z.string().regex(indianPlateRegex, "Invalid vehicle number plate"),
        capacity: z.number().min(1, { message: "Capacity must be at least 1" }).max(8, { message: "Capacity  not exceed 8" }),
        vehicleType: z.enum(['CAR', 'BIKE', 'AUTO'])

    })
})

export type captainRegistermodel = z.infer<typeof captainRegisterValidator>;