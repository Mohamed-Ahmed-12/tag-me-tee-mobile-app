import React, { createContext, useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { Alert } from 'react-native';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode'
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [tokens, setTokens] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState(null)
    const router = useRouter();

    // Check if token is expired
    const isTokenExpired = useCallback((token) => {
        if (!token) return true;
        try {
            // Check if it's a valid JWT structure first
            if (token.split('.').length !== 3) return true;

            const decoded = jwtDecode(token);
            // Add buffer (e.g., 5 minutes) to prevent edge cases
            return (decoded.exp * 1000) < (Date.now() + 300000);
        } catch (error) {
            console.error("Error decoding token:", error);
            return true;
        }
    }, []);

    const login = async (inputData) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputData)
            });

            if (response.status === 200) {
                const data = await response.json();
                setTokens(data)
                // Call userProfile manually using the new token
                await fetchUserProfileWithToken(data.access);
                return true
            }
            return false
        } catch (error) {
            console.error("Login error:", error);
            Alert.alert('Error', 'Failed to login')
            return false
        } finally {
            setLoading(false);
        }
    }

    const logout = useCallback(() => {
        setTokens(null);
        setProfileData(null)

    }, [])

    const userProfile = useCallback(async () => {
        if (!tokens?.access || isTokenExpired(tokens?.access)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/users/me/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokens.access}`,
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                setProfileData(data);
            }
        } catch (err) {
            console.error("error", err);
            Alert.alert('Error', 'Failed to get user profile');
        }
    }, [tokens]);

    const fetchUserProfileWithToken = async (accessToken) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/me/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                setProfileData(data);
            }
        } catch (err) {
            console.error("Profile fetch error after login:", err);
            Alert.alert('Error', 'Failed to get user profile');
        }
    };

    const updateUserProfile = useCallback(async (updatedFields, uid) => {

        if (!tokens?.access || isTokenExpired(tokens?.access)) return;
        setLoading(true)
        try {
            const url = `${API_BASE_URL}/users/${uid}/`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokens.access}`
                },
                body: JSON.stringify(updatedFields)
            });
            console.log(response)
            if (response.status === 200) {
                const data = await response.json();
                setProfileData(data);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Update profile failed:", error);
            Alert.alert("Error", `Failed to update profile: ${error.message}`);
            return false;
        } finally {
            setLoading(false)
        }
    }, [tokens]);

    const refreshToken = useCallback(async () => {
        if (!tokens?.refresh) return;

        try {
            const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: tokens.refresh }),
            });

            if (response.status === 200) {
                const data = await response.json();
                setTokens(prev => ({
                    ...prev,
                    access: data.access,
                }));
            } else {
                logout(); // force logout if refresh fails
            }
        } catch (error) {
            console.error("Refresh token error:", error);
            logout();
        }
    }, [tokens?.refresh, logout]);

    useEffect(() => {
        const checkAndRefreshToken = async () => {
            if (tokens?.access && isTokenExpired(tokens.access)) {
                await refreshToken();
            }
        };

        const interval = setInterval(checkAndRefreshToken, 23.5 * 60 * 60 * 1000); // 23.5 hours in milliseconds
        return () => clearInterval(interval);
    }, [refreshToken]); // remove tokens from deps to avoid re-running on setTokens




    const contextValue = useMemo(() => ({
        isLoading,
        login,
        tokens,
        userProfile,
        profileData,
        updateUserProfile,
        logout
    }), [
        isLoading,
        login,
        tokens,
        userProfile,
        profileData,
        updateUserProfile,
        logout
    ]);

    return (
        <AuthContext.Provider
            value={contextValue}
        >
            {children}
        </AuthContext.Provider>
    );
};