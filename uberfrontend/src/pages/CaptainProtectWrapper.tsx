import React, { useEffect, useState } from 'react'
import useCaptainContext from '../context/CaptainContext'
import { useNavigate } from 'react-router'
import axios from 'axios'

const CaptainProtectWrapper = ({
    children
}: { children: React.ReactNode }) => {

    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { setCaptain } = useCaptainContext()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!token) {
            navigate('/captain-login')
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/captain/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setCaptain(response.data.captain)
                setIsLoading(false)
            }
        })
            .catch(err => {

                localStorage.removeItem('token')
                navigate('/captain-login')
            })
    }, [token])



    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <>
            {children}
        </>
    )
}

export default CaptainProtectWrapper