import { getCoordinatesBody, getCoordinatesValidator, getDistanceTimeBody, getDistanceTimeValidator, getSuggestionBody, getSuggestionsValidator } from './../validator/maps.validator';
import { getCoordinatesByAddress, getDistanceTimebyOriginDestination, getSuggestionsByInput } from './../Maps/googleMaps';

import { Request, Response } from 'express';
import { HTTP_STATUS } from '../libs/constants';
import { error } from 'console';

export const getCoordinates = async (req: Request<{}, {}, {}, getCoordinatesBody>, res: Response): Promise<any> => {

    const result = getCoordinatesValidator.safeParse(req.query)
    if (!result.success) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: result.error.issues[0].message })
    }
    try {

        const coordinates = await getCoordinatesByAddress(result.data.address);
        return res.status(HTTP_STATUS.OK).json({
            coordinates,
        })
    } catch (err) {
        console.log(err);
        res.status(HTTP_STATUS.INVALID_REQUEST).json({
            message: "Coordinates not found"
        })
    }
}

export const getDistanceTime = async (req: Request<{}, {}, {}, getDistanceTimeBody>, res: Response): Promise<any> => {

    const result = getDistanceTimeValidator.safeParse(req.query);
    if (result.error) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: result.error.issues[0].message })
    }
    try {


        const distanceTime = await getDistanceTimebyOriginDestination({
            destination: result.data.destination,
            origin: result.data.origin
        })

        return res.status(HTTP_STATUS.CREATED).json(distanceTime)
    } catch (err) {
        console.log(err);
        res.status(HTTP_STATUS.INVALID_REQUEST).json({
            message: "Something went wrong!"
        })
    }
}



export const getSuggestions = async (req: Request<{}, {}, {}, getSuggestionBody>, res: Response): Promise<any> => {

    const result = getSuggestionsValidator.safeParse(req.query);

    if (result.error) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: result.error.issues[0].message })
    }
    try {
        const suggestion = await getSuggestionsByInput(result.data.input);
        return res.status(HTTP_STATUS.CREATED).json(suggestion)

    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Error in getting suggestion" })
    }

}
