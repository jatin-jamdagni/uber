

import z from "zod";

export const getCoordinatesValidator = z.object({
    address: z.string().min(3, "Address Must be at least 3 character long")
})
export type getCoordinatesBody = z.infer<typeof getCoordinatesValidator>;
