import axios from 'axios';
import { getCoordinatesBody, getDistanceTimeBody } from '../validator/maps.validator';

interface Coordinates {
    lat: number;
    lng: number;
}
export const getCoordinatesByAddress = async (address: string): Promise<Coordinates | null> => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    console.log("uri", url)
    try {
        const response = await axios.get(url);
        const data = response.data;
        console.log("this is location", data)

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
    console.log(url)
    try {
        const response = await axios.get(url);
        const data = response.data;
        console.log("this is distance and time", data)

        if (data.status === 'OK' && data.rows.length > 0 && data.rows[0].elements.length > 0) {

            const element = data.rows[0].elements[0];
            if (element.status === 'OK') {
                return {
                    distance: element.distance.text,
                    duration: element.duration.text
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
}


export const getSuggestionsByInput = async (input: string): Promise<string[] | null> => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        const data = response.data;
        console.log("this is suggestion", data);

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