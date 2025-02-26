// import { useGetFare } from "../hooks/useGetFare";


// // module.exports.createRide = async ({
// //     user, pickup, destination, vehicleType
// // }) => {


// //     const fare = await useGetFare({
// //         destination: destination
// //     });



// //     // const ride = rideModel.create({
// //     //     user,
// //     //     pickup,
// //     //     destination,
// //     //     otp: getOtp(6),
// //     //     fare: fare[vehicleType]
// //     // })

// //     return ride;
// // }

// module.exports.confirmRide = async ({
//     rideId, captain
// }) => {
//     if (!rideId) {
//         throw new Error('Ride id is required');
//     }

//     await rideModel.findOneAndUpdate({
//         _id: rideId
//     }, {
//         status: 'accepted',
//         captain: captain._id
//     })

//     const ride = await rideModel.findOne({
//         _id: rideId
//     }).populate('user').populate('captain').select('+otp');

//     if (!ride) {
//         throw new Error('Ride not found');
//     }

//     return ride;

// }

// module.exports.startRide = async ({ rideId, otp, captain }) => {
//     if (!rideId || !otp) {
//         throw new Error('Ride id and OTP are required');
//     }

//     const ride = await rideModel.findOne({
//         _id: rideId
//     }).populate('user').populate('captain').select('+otp');

//     if (!ride) {
//         throw new Error('Ride not found');
//     }

//     if (ride.status !== 'accepted') {
//         throw new Error('Ride not accepted');
//     }

//     if (ride.otp !== otp) {
//         throw new Error('Invalid OTP');
//     }

//     await rideModel.findOneAndUpdate({
//         _id: rideId
//     }, {
//         status: 'ongoing'
//     })

//     return ride;
// }

// module.exports.endRide = async ({ rideId, captain }) => {
//     if (!rideId) {
//         throw new Error('Ride id is required');
//     }

//     const ride = await rideModel.findOne({
//         _id: rideId,
//         captain: captain._id
//     }).populate('user').populate('captain').select('+otp');

//     if (!ride) {
//         throw new Error('Ride not found');
//     }

//     if (ride.status !== 'ongoing') {
//         throw new Error('Ride not ongoing');
//     }

//     await rideModel.findOneAndUpdate({
//         _id: rideId
//     }, {
//         status: 'completed'
//     })

//     return ride;
// }

