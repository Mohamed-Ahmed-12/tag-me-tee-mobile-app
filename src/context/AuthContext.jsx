import React, { createContext, useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
    const router = useRouter();
    const [tokens, setTokens] = useState(null);
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [errors, setErrors] = useState(null);

    const logout = async () => {
        setLoading(true);
        try {
            await AsyncStorage.removeItem('tokens');
            setTokens(null);
            setProfileData(null);
            router.replace('/login'); // Redirect to login
        } catch (error) {
            console.error("Logout failed:", error);
            Alert.alert("Error", "An error occurred while logging out. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const login = async (inputData) => {
        setLoading(true);
        try {
            const url = `${API_BASE_URL}/login/`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputData),
            });

            if (!response.ok) { // Check if the HTTP status code is in the 200s
                const errorData = await response.json(); // Attempt to parse error response
                console.error("Login failed:", response.status, errorData);
                Alert.alert("Login Failed", errorData.message || "Please check your credentials.");
                setErrors(errorData?.detail)
                return false;
            } else {
                const data = await response.json(); // Parse the successful JSON response
                console.log("Login successful:", data);
                Alert.alert("Success", "You have logged in successfully!");
                await AsyncStorage.setItem('tokens', JSON.stringify(data)); // Save tokens data
                setTokens(data);
                return true;
            }
        } catch (error) {
            console.error("Network error or request failed:", error);
            Alert.alert("Error", "Could not connect to the server. Please check your internet connection.");
            return false;
        } finally {
            setLoading(false);
        }
    }


    const userProfile = useCallback(async () => {
        setLoading(true);
        const url = `${API_BASE_URL}/users/me/`;
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokens?.access}`
                },
            });
            if (!response.ok) { // Check if the HTTP status code is in the 200s
                const errorData = await response.json(); // Attempt to parse error response
                if (response.status === 401) {
                    Alert.alert("Session Expired", "Your session has expired. Please login again.");
                    setTokens(null);
                    return false;
                }
                console.error("Fetching data failed:", response.status, errorData);
                Alert.alert("Featching data Failed", errorData.message || "Please check your Connection.");
                setProfileData(null);
            } else {
                const data = await response.json();
                console.log(data)
                setProfileData(data);
            }
        } catch (error) {
            console.error("Network error or request failed:", error);
            Alert.alert("Error", "Could not connect to the server. Please check your internet connection.");
        } finally {
            setLoading(false);
        }
    }, [tokens])

    const updateUserProfile = async (updatedFields, uid) => {
        setLoading(true); // Can use a more specific loading state if needed for submission
        try {
            const url = `${API_BASE_URL}/users/${uid}/`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokens?.access}` // Make sure 'tokens' and 'tokens.access' are available in this context
                },
                body: JSON.stringify(updatedFields),
            });

            if (response.ok) {
                const updatedData = await response.json();
                setProfileData(updatedData); // Update the profileData in context
                Alert.alert("Success", "Profile updated successfully!");
                return true; // Indicate success
            } else {
                const errorData = await response.json();
                console.error("Failed to update profile:", errorData);
                Alert.alert("Error", `Failed to update profile: ${errorData.message || response.statusText}`);
                return false; // Indicate failure
            }
        } catch (error) {
            console.error("Error sending data to backend:", error);
            Alert.alert("Error", "An error occurred while connecting to the server.");
            return false; // Indicate failure
        } finally {
            setLoading(false); // Stop general loading or specific submission loading
        }
    };


    useEffect(() => {
        const loadUserFromStorage = async () => {
            try {
                const storedUserTokens = await AsyncStorage.getItem('tokens');
                if (storedUserTokens) {
                    const parsedUser = JSON.parse(storedUserTokens);
                    setTokens(parsedUser);
                    router.replace('/profile'); // Redirect to profile
                } else {
                    router.replace('/login'); // Redirect to login
                }
            } catch (error) {
                console.error("Failed to load tokens from storage", error);
                router.replace('/login');
            } finally {
                setLoading(false);
            }
        };
        loadUserFromStorage();
    }, []);

    return (
        <MyContext.Provider value={{ tokens, loading, profileData, errors, setTokens, login, logout, userProfile, updateUserProfile }}>
            {children}
        </MyContext.Provider>
    );
};