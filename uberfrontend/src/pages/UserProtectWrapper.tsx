import React, { useEffect, useState } from 'react'
import useUserContext from '../context/UserContext'
import { useNavigate } from 'react-router'
import axios from 'axios'

const UserProtectWrapper = ({
    children
}: { children: React.ReactNode }) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { setUser } = useUserContext();
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!token) {
            navigate('/login')
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setUser(response.data.user)
                setIsLoading(false)
            }
        })
            .catch(err => {
                console.log(err)
                localStorage.removeItem('token')
                navigate('/login')
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

export default UserProtectWrapper