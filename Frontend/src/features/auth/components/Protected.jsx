import React from 'react'
import { useAuth } from "../hooks/useAuth"
import { Navigate } from "react-router"
import AppLoadingScreen from "../../../components/AppLoadingScreen"

const Protected = ({ children }) => {
    const { loading, user } = useAuth()

    if (loading) {
        return (
            <AppLoadingScreen 
                badge="⚡ Authenticating Session"
                subtitle="Verifying your account and connecting to HireReady platform..."
            />
        )
    }

    if (!user) {
        return <Navigate to={'/login'} replace />
    }

    return children
}

export default Protected