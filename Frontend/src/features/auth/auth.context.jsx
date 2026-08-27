import { createContext, useState, useEffect } from "react";
import { login, register, logout, getMe } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => { 
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            if (data?.user) {
                setUser(data.user)
            }
            return data
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            if (data?.user) {
                setUser(data.user)
            }
            return data
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const data = await getMe()
                if (data?.user) {
                    setUser(data.user)
                } else {
                    setUser(null)
                }
            } catch (err) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        checkUserSession()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, handleLogin, handleRegister, handleLogout }} >
            {children}
        </AuthContext.Provider>
    )
}