import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    TextInput,
    View,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { AuthContext } from '../../src/context/AuthContext';
import AppText from '../../src/components/AppText';
import { COLORS, FONT_SIZES } from '../../assets/styles/stylesheet';
import ProtectedRoute from '../../src/components/ProtectedRoute';

export default function EditProfile() {
    const {
        isLoading,
        profileData,
        userProfile,
        updateUserProfile
    } = useContext(AuthContext);

    const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        link: ''
    });
    const [formErrors, setFormErrors] = useState({
        username: false,
        email: false,
        link: false
    });

    // Initialize form data
    useEffect(() => {
        const loadProfileData = async () => {
            try {
                if (!profileData) {
                    await userProfile();
                }

                if (profileData) {
                    setFormData({
                        username: profileData.username || '',
                        email: profileData.email || '',
                        link: profileData.link || ''
                    });
                }
            } catch (error) {
                console.error("Failed to load profile data:", error);
                Alert.alert("Error", "Failed to load profile data");
            } finally {
                setIsLoadingInitialData(false);
            }
        };

        loadProfileData();
    }, [profileData, userProfile]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setFormErrors(prev => ({ ...prev, [field]: false }));
    };

    const validateForm = () => {
        const newErrors = {
            username: !formData.username.trim(),
            email: !formData.email.trim(),
            link: !formData.link.trim()
        };

        setFormErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = useCallback(async () => {
        if (!validateForm()) {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }

        try {
            const success = await updateUserProfile({
                username: formData.username.trim(),
                email: formData.email.trim(),
                link: formData.link.trim()
            }, profileData.id);

            if (success) {
                Alert.alert("Success", "Profile updated successfully!");
            }
        } catch (error) {
            console.error("Profile update failed:", error);
            // Errors are already handled in AuthContext
        }
    }, [formData, profileData?.id, updateUserProfile]);



    return (
        <ProtectedRoute>
            {isLoadingInitialData ?
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <AppText style={styles.loadingText}>Loading Profile...</AppText>
                </View>
                :
                <KeyboardAvoidingView
                    style={styles.fullScreenContainer}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollViewContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.profileCard}>
                            <AppText style={styles.title}>Edit Your Profile</AppText>

                            {/* Error display from context */}
                            {/* {errors && (
                                <View style={styles.errorContainer}>
                                    <AppText style={styles.errorText}>{errors}</AppText>
                                </View>
                            )} */}

                            <AppText style={styles.label}>Username:</AppText>
                            <TextInput
                                style={[
                                    styles.input,
                                    formErrors.username && styles.inputError
                                ]}
                                placeholderTextColor={COLORS.placeholder}
                                value={formData.username}
                                onChangeText={(text) => handleInputChange('username', text)}
                                placeholder="Enter your username"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {formErrors.username && (
                                <AppText style={styles.errorMessage}>Username is required.</AppText>
                            )}

                            <AppText style={styles.label}>Email Address:</AppText>
                            <TextInput
                                style={[
                                    styles.input,
                                    formErrors.email && styles.inputError
                                ]}
                                placeholderTextColor={COLORS.placeholder}
                                value={formData.email}
                                onChangeText={(text) => handleInputChange('email', text)}
                                placeholder="Enter your email address"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {formErrors.email && (
                                <AppText style={styles.errorMessage}>Email is required.</AppText>
                            )}

                            <AppText style={styles.label}>QR Code Link:</AppText>
                            <TextInput
                                style={[
                                    styles.input,
                                    formErrors.link && styles.inputError
                                ]}
                                placeholderTextColor={COLORS.placeholder}
                                value={formData.link}
                                onChangeText={(text) => handleInputChange('link', text)}
                                placeholder="Enter your QR code link"
                                keyboardType="url"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {formErrors.link && (
                                <AppText style={styles.errorMessage}>QR Code Link is required.</AppText>
                            )}

                            <TouchableOpacity
                                onPress={handleSubmit}
                                style={[
                                    styles.fullWidthButton,
                                    isLoading && styles.buttonDisabled,
                                    (!formData.username || !formData.email || !formData.link) && styles.buttonInactive
                                ]}
                                disabled={isLoading || !formData.username || !formData.email || !formData.link}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color={COLORS.text} />
                                ) : (
                                    <AppText style={styles.buttonText}>Apply Changes</AppText>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            }
        </ProtectedRoute>

    );
}
const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    loadingText: {
        color: COLORS.primary,
        marginTop: 10,
        fontSize: FONT_SIZES.large,
    },
    profileCard: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: COLORS.cardBackground, // Use a slightly lighter black for the card
        borderRadius: 15,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, // Increased shadow for better depth
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 1, // Subtle border to match the login card feel
        borderColor: COLORS.primary + '30', // A transparent version of primary color
    },
    title: {
        fontSize: FONT_SIZES.xxLarge,
        color: COLORS.primary,
        marginBottom: 30, // More space below title
        textAlign: 'center',
    },
    label: {
        fontSize: FONT_SIZES.medium,
        fontWeight: '600',
        marginBottom: 5,
        alignSelf: 'flex-start',
        width: '100%',
        color: COLORS.primary,
    },
    input: {
        width: '100%',
        height: 45,
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: FONT_SIZES.large,
        backgroundColor: 'transparent', // Keep background transparent
        color: COLORS.text, // Text color
        // Add shadow/elevation for inputs if desired, similar to login screen
    },
    inputError: {
        borderColor: COLORS.error, // Red border for errors
    },
    errorMessage: {
        color: COLORS.error,
        fontSize: FONT_SIZES.small,
        alignSelf: 'flex-start',
        marginTop: -10,
        marginBottom: 10,
    },
    fullWidthButton: {
        width: '100%',
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20, // More space above the button
    },
    buttonText: {
        color: COLORS.text,
        fontSize: FONT_SIZES.large,
        fontWeight: '600',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonInactive: {
        backgroundColor: COLORS.buttonInactive, // Different color when inactive
    },
    activityIndicator: {
        marginTop: 10,
        marginBottom: 10,
    },
});