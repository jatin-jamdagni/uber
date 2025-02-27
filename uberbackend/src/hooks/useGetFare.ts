export const useGetFare = async (distanceTime: any) => {
    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };

    // Validate and process the distance
    let distanceValue = 0;
    if (distanceTime.distance && typeof distanceTime.distance === 'string') {
        distanceValue = parseFloat(distanceTime.distance.replace(' km', '')) * 1000; // Convert to meters
    }

    // Validate and process the duration
    let durationValue = 0;
    if (distanceTime.duration && typeof distanceTime.duration === 'string') {
        const durationParts = distanceTime.duration.split(' hour ');
        const hoursInMinutes = parseInt(durationParts[0]) * 60; // Convert hours to minutes
        const minutes = parseInt(durationParts[1].replace(' mins', ''));
        durationValue = (hoursInMinutes + minutes) * 60; // Convert to total seconds
    }

    // Calculating fare
    const fare = {
        AUTO: Math.round(baseFare.auto + ((distanceValue / 1000) * perKmRate.auto) + ((durationValue / 60) * perMinuteRate.auto)),
        CAR: Math.round(baseFare.car + ((distanceValue / 1000) * perKmRate.car) + ((durationValue / 60) * perMinuteRate.car)),
        BIKE: Math.round(baseFare.moto + ((distanceValue / 1000) * perKmRate.moto) + ((durationValue / 60) * perMinuteRate.moto))
    };

    return fare;
};
