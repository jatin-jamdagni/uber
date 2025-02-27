import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import useSocketContext from '../context/SocketContext';
import useCaptainContext from '../context/CaptainContext';
import axios from 'axios';
import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/RidePopUp';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import { Ride } from '../types';

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false);
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
    const ridePopupPanelRef = useRef(null);
    const confirmRidePopupPanelRef = useRef(null);
    const [ride, setRide] = useState<Ride>({
        id: null,
        destination: "",
        fare: null,
        pickup: "",
        user: {
            firstName: "",
            lastName: ""
        }
    });

    const { socket } = useSocketContext();
    const { captain } = useCaptainContext(); // Ensure captain context is properly used

    useEffect(() => {
        if (!captain) return;

        socket.emit('join', {
            userId: captain.id,
            userType: 'captain',
        });

        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    socket.emit('update-location-captain', {
                        userId: captain.id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude,
                        },
                    });
                });
            }
        };

        const locationInterval = setInterval(updateLocation, 10000);
        updateLocation();

        // Cleanup on component unmount
        return () => clearInterval(locationInterval);
    }, [captain, socket]);

    useEffect(() => {
        socket.on('new-ride', (data) => {
            setRide(data);
            setRidePopupPanel(true);
        });

        return () => {
            socket.off('new-ride'); // Cleanup event listener
        };
    }, [socket]);

    async function confirmRide() {
        if (!ride) return; // Ensure ride data is available

        await axios.post(
            `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
            {
                rideId: ride.id,
                captainId: captain?.id,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        setRidePopupPanel(false);
        setConfirmRidePopupPanel(true);
    }

    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)',
            });
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)',
            });
        }
    }, [ridePopupPanel]);

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)',
            });
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)',
            });
        }
    }, [confirmRidePopupPanel]);

    if (!captain) {
        return <div>Loading...</div>; // Show loading while captain is not available
    }

    return (
        <div className='h-screen'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img
                    className='w-16'
                    src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png'
                    alt=''
                />
                <Link
                    to='/captain-home'
                    className='h-10 w-10 bg-white flex items-center justify-center rounded-full'
                >
                    <i className='text-lg font-medium ri-logout-box-r-line'></i>
                </Link>
            </div>
            <div className='h-3/5'>
                <img
                    className='h-full w-full object-cover'
                    src='https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif'
                    alt=''
                />
            </div>
            <div className='h-2/5 p-6'>
                <CaptainDetails />
            </div>
            <div
                ref={ridePopupPanelRef}
                className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'
            >
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>
            <div
                ref={confirmRidePopupPanelRef}
                className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'
            >
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    setRidePopupPanel={setRidePopupPanel}
                />
            </div>
        </div>
    );
};

export default CaptainHome;
