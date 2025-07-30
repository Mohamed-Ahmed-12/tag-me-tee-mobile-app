import React, { createContext, useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const [tokens, setTokens] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [errors, setErrors] = useState(null);

    // Clear all auth-related data
    const clearAuthData = async () => {
        try {
            await AsyncStorage.removeItem('tokens');
            setTokens(null);
            setProfileData(null);
            setErrors(null);
        } catch (error) {
            console.error("Failed to clear auth data:", error);
            throw error;
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await clearAuthData();
            router.replace('/login');
        } catch (error) {
            console.error("Logout failed:", error);
            Alert.alert("Error", "An error occurred while logging out. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (inputData) => {
        setIsLoading(true);
        setErrors(null);
        
        try {
            const url = `${API_BASE_URL}/login/`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Login failed:", response.status, errorData);
                setErrors(errorData?.detail || "Invalid credentials");
                Alert.alert("Login Failed", errorData.message || "Please check your credentials.");
                return false;
            }

            const data = await response.json();
            await AsyncStorage.setItem('tokens', JSON.stringify(data));
            setTokens(data);
            await userProfile(); // Fetch user profile immediately after login
            return true;
        } catch (error) {
            console.error("Network error or request failed:", error);
            setErrors("Network error");
            Alert.alert("Error", "Could not connect to the server. Please check your internet connection.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const userProfile = useCallback(async () => {
        if (!tokens?.access) return;
        
        setIsProfileLoading(true);
        setErrors(null);
        
        try {
            const url = `${API_BASE_URL}/users/me/`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokens.access}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 401) {
                    await clearAuthData();
                    Alert.alert("Session Expired", "Your session has expired. Please login again.");
                    router.replace('/login');
                    return false;
                }
                throw new Error(errorData.message || "Failed to fetch profile");
            }

            const data = await response.json();
            setProfileData(data);
            return true;
        } catch (error) {
            console.error("Fetch profile failed:", error);
            setErrors(error.message);
            Alert.alert("Error", "Failed to fetch profile data. Please try again.");
            return false;
        } finally {
            setIsProfileLoading(false);
        }
    }, [tokens, router]);

    const updateUserProfile = async (updatedFields, uid) => {
        setIsUpdating(true);
        setErrors(null);
        
        try {
            const url = `${API_BASE_URL}/users/${uid}/`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokens?.access}`
                },
                body: JSON.stringify(updatedFields),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update profile");
            }

            const updatedData = await response.json();
            setProfileData(updatedData);
            Alert.alert("Success", "Profile updated successfully!");
            return true;
        } catch (error) {
            console.error("Update profile failed:", error);
            setErrors(error.message);
            Alert.alert("Error", `Failed to update profile: ${error.message}`);
            return false;
        } finally {
            setIsUpdating(false);
        }
    };

    const refreshTokens = async () => {
        if (!tokens?.refresh) return false;
        
        try {
            const url = `${API_BASE_URL}/token/refresh/`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: tokens.refresh }),
            });

            if (!response.ok) {
                throw new Error("Failed to refresh tokens");
            }

            const newTokens = await response.json();
            await AsyncStorage.setItem('tokens', JSON.stringify(newTokens));
            setTokens(newTokens);
            return true;
        } catch (error) {
            console.error("Token refresh failed:", error);
            await clearAuthData();
            return false;
        }
    };

    // Initialize auth state from storage
    useEffect(() => {
        const loadUserFromStorage = async () => {
            setIsLoading(true);
            try {
                const storedTokens = await AsyncStorage.getItem('tokens');
                if (storedTokens) {
                    const parsedTokens = JSON.parse(storedTokens);
                    setTokens(parsedTokens);
                    await userProfile();
                }else{
                    await clearAuthData();
                    router.replace('/login')
                    
                }
            } catch (error) {
                console.error("Failed to load tokens from storage", error);
                await clearAuthData();
            } finally {
                setIsLoading(false);
            }
        };

        loadUserFromStorage();
    }, [userProfile]);

    return (
        <AuthContext.Provider
            value={{
                tokens,
                profileData,
                errors,
                isLoading,
                isProfileLoading,
                isUpdating,
                login,
                logout,
                userProfile,
                updateUserProfile,
                refreshTokens,
                clearAuthData,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};