import React, { useContext, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'expo-router';

const ProtectedRoute = ({ children }) => {
    const { tokens, isLoading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !tokens) {
            router.replace('/login');
        }
    }, [tokens, isLoading]);

    if (isLoading || (!tokens && !isLoading)) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return children;
};

export default ProtectedRoute;
