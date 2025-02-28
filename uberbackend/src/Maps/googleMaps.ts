import axios from 'axios';
import { getDistanceTimeBody } from '../validator/maps.validator';
import { prisma } from "../libs/client"
interface Coordinates {
    lat: number;
    lng: number;
}
export const getCoordinatesByAddress = async (address: string): Promise<Coordinates | null> => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.status === 'OK' && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            return { lat: location.lat, lng: location.lng };
        } else {
            console.error('No results found for the address');
            return null;
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        return null;
    }
}

export const getDistanceTimebyOriginDestination = async ({
    destination, origin
}: getDistanceTimeBody): Promise<any> => {

    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
    
    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.status === 'OK' && data.rows.length > 0 && data.rows[0].elements.length > 0) {
            const element = data.rows[0].elements[0];
            
            if (element.status === 'OK') {
                const distance = element.distance.text;
                const duration = element.duration.text;

                // Convert distance (e.g., "87.2 km") to meters
                const distanceInMeters = convertDistanceToMeters(distance);

                // Convert duration (e.g., "1 hour 58 mins") to minutes
                const durationInMinutes = convertDurationToMinutes(duration);

                return {
                    distance: distanceInMeters, // distance in meters
                    duration: durationInMinutes, // duration in minutes
                };
            } else {
                return null;
            }
        } else {
            console.error('No results found for the origin and destination');
            return null;
        }
    } catch (error) {
        console.error('Error fetching distance and time:', error);
        return null;
    }
};

// Convert distance (e.g., "87.2 km") to meters
function convertDistanceToMeters(distance: string): number {
    const match = distance.match(/(\d+(\.\d+)?)\s*(km|km\.)/i);
    if (match) {
        return parseFloat(match[1]) * 1000; // Convert km to meters
    }
    return 0;
}

// Convert duration (e.g., "1 hour 58 mins" or "1:58") to minutes
function convertDurationToMinutes(duration: string): number {
    const match = duration.match(/(\d+)(?: hour| hr| hrs)?(?: (\d+))? (?:min|minute|minutes)/i);
    if (!match) {
        return 0;
    }

    const hours = parseInt(match[1], 10) || 0;
    const minutes = parseInt(match[2], 10) || 0;

    return hours * 60 + minutes; // Return total duration in minutes
}


export const getSuggestionsByInput = async (input: string): Promise<string[] | null> => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.status === 'OK' && data.predictions.length > 0) {
            return data.predictions;
            // return data.predictions.map((prediction: any) => prediction.description)

            ;
        } else {
            console.error('No suggestions found for the input');
            return null;
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return null;
    }
}

export const getCaptainsInTheRadius = async (lat: number, lng: number, radius: number) => {
    const allCaptains = await prisma.captain.findMany({
        include: { location: true , vehicle: true},
    });

    const filteredCaptains = allCaptains.filter((captain) => {
        if (!captain.location) return false;

        const distance = haversineDistance(
            lat, lng,
            captain.location.latitude,
            captain.location.longitude
        );

        return distance <= radius;
    });

    return filteredCaptains;
};

// Haversine Formula (Great-Circle Distance)
const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
};


 
// export const getCaptainsInTheRadius = async (lat: number, lng: number, radius: number) => {
//     const captains = await prisma.$queryRaw`
//         SELECT * FROM "Captain"
//         JOIN "Location" ON "Captain".id = "Location".captainId
//         WHERE ST_DistanceSphere(
//             ST_MakePoint("Location".longitude, "Location".latitude),
//             ST_MakePoint(${lng}, ${lat})
//         ) <= ${radius * 1000}  -- Convert km to meters
//     `;
    
//     return captains;
// };
