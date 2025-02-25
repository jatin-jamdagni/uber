import { getCoordinatesBody, getCoordinatesValidator } from './../validator/maps.validator';
import { getCoordinatesByAddress } from './../Maps/googleMaps';

import { Request, Response } from 'express';
import { HTTP_STATUS } from '../libs/constants';

export const getCoordinates = async (req: Request<{}, {}, {}, getCoordinatesBody>, res: Response): Promise<any> => {

    const result = getCoordinatesValidator.safeParse(req.query)
    if (!result.success) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: result.error.issues })
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

// 
// export const 

