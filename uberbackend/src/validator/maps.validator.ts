

import z from "zod";

export const getCoordinatesValidator = z.object({
    address: z.string().min(3, "Address must be at least 3 character long")
})
export type getCoordinatesBody = z.infer<typeof getCoordinatesValidator>;

export const getDistanceTimeValidator = z.object({
    origin: z.string().min(3, "Origin must be at least 3 character long"),
    destination: z.string().min(3, "Destination must be at least 3 character long")
})

export type getDistanceTimeBody = z.infer<typeof getDistanceTimeValidator>

export const getSuggestionsValidator = z.object({
    input: z.string()
})

export type getSuggestionBody = z.infer<typeof getSuggestionsValidator>
