export const  convertDurationToMinutes  = (duration: string): number  =>{
    const match = duration.match(/(\d+)(?: hour| hr| hrs)?(?: (\d+))? (?:min|minute|minutes)/i);
    if (!match) {
        return 0;
    }

    const hours = parseInt(match[1], 10) || 0;
    const minutes = parseInt(match[2], 10) || 0;

    return hours * 60 + minutes; // Return total duration in minutes
}

export const convertDistanceInMeters = (distance: string) =>{ 

    
}