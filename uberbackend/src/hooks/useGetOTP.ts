import crypto from "crypto"


export const useGetOtp = (num: number) => {
    function generateOtp(num: number) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}