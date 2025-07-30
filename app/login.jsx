import { useRouter } from 'expo-router';
import React, { useContext, useState, useCallback, useEffect } from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    KeyboardAvoidingView, // Consider using this for better keyboard handling
    Platform // To check platform for KeyboardAvoidingView behavior
} from 'react-native';
import { AuthContext } from "../src/context/AuthContext";
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../src/components/AppText';
import { COLORS, FONT_SIZES } from '../assets/styles/stylesheet';




export default function LoginScreen() {
    const router = useRouter();
    const { isLoading, login, errors } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState(""); // Separate state for each input
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    // Using useCallback to memoize functions that don't change often
    const handleSubmit = useCallback(async () => {
        // Trim and validate inputs immediately
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        let hasError = false;

        if (!trimmedUsername) {
            setUsernameError(true);
            hasError = true;
        } else {
            setUsernameError(false);
        }

        if (!trimmedPassword) {
            setPasswordError(true);
            hasError = true;
        } else {
            setPasswordError(false);
        }

        if (hasError) {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }

        // Call login function
        const isSuccess = await login({ username: trimmedUsername, password: trimmedPassword })
        if (isSuccess) {
            router.replace('/profile'); // Navigate on successful login
        }
    }, [username, password, login, router]); // Dependencies for useCallback

    // Determine if the button should be active (not disabled)
    const isButtonActive = username.trim() !== '' && password.trim() !== '';

    return (
        <KeyboardAvoidingView // Use KeyboardAvoidingView for better keyboard management
            style={profileStyles.fullScreenContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"} // "height" or "position" on Android, "padding" on iOS
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Adjust offset as needed
        >
            <ScrollView
                contentContainerStyle={profileStyles.scrollViewContent} // Use this for padding within the scroll view
                keyboardShouldPersistTaps="handled" // Keep keyboard open when tapping on other elements
            >
                <View style={profileStyles.profileCard}>
                    <Image
                        source={require("../assets/logo-white.png")}
                        contentFit="contain" // Changed to 'contain' to ensure full logo visibility
                        transition={1000}
                        style={profileStyles.logo}
                    />

                    <AppText style={profileStyles.slogan}>your tee, your identity</AppText>

                    <AppText style={profileStyles.text}>
                        Log in to customize your QR code and manage your digital identity
                    </AppText>
                    {/* Error */}
                    {errors &&
                        <AppText style={{
                            fontSize: FONT_SIZES.small,
                            color: COLORS.error,
                            textAlign: 'end'
                        }}>{errors}
                        </AppText>
                    }

                    <AppText style={profileStyles.label}>Username:</AppText>
                    <TextInput
                        style={[
                            profileStyles.input,
                            usernameError && profileStyles.inputError, // Highlight if empty on submit
                        ]}
                        placeholderTextColor={COLORS.placeholder}
                        value={username}
                        onChangeText={setUsername} // Direct state update
                        placeholder="Enter username"
                        autoCapitalize="none" // Prevent auto-capitalization
                        autoCorrect={false} // Prevent auto-correction
                        keyboardType="default" // Explicitly set keyboard type
                    />
                    {usernameError && <AppText style={profileStyles.errorMessage}>Username is required.</AppText>}

                    <AppText style={profileStyles.label}>Password:</AppText>
                    <View style={profileStyles.passwordContainer}>
                        <TextInput
                            style={[
                                profileStyles.input,
                                profileStyles.passwordInput, // Add specific style for password input if needed
                                passwordError && profileStyles.inputError, // Highlight if empty on submit
                            ]}
                            placeholderTextColor={COLORS.placeholder}
                            onChangeText={setPassword} // Direct state update
                            value={password} // Bind value
                            placeholder="Enter your password"
                            secureTextEntry={!showPassword} // Correct prop name
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="default" // Set a more appropriate keyboard type
                        />
                        <TouchableOpacity
                            style={profileStyles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                            accessibilityLabel={showPassword ? "Hide password" : "Show password"} // Accessibility
                        >
                            <Ionicons
                                name={showPassword ? "eye-off" : "eye"}
                                size={20}
                                color={COLORS.icon}
                            />
                        </TouchableOpacity>
                    </View>
                    {passwordError && <AppText style={profileStyles.errorMessage}>Password is required.</AppText>}


                    {/* Forgot Password Link */}
                    <TouchableOpacity
                        onPress={() => Alert.alert('Forgot Password', 'Implement navigation to password reset screen.')}
                        style={profileStyles.forgotPasswordButton}
                    >
                        <AppText style={profileStyles.forgotPassword}>Forgot Password?</AppText>
                    </TouchableOpacity>
                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        style={[
                            profileStyles.fullWidthButton,
                            isLoading && profileStyles.buttonDisabled,
                            !isButtonActive && profileStyles.buttonInactive // Apply inactive style
                        ]}
                        disabled={isLoading || !isButtonActive} // Disable if isLoading or inputs are empty
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color={COLORS.text} /> // White spinner on button
                        ) : (
                            <AppText style={profileStyles.buttonText}>Log in</AppText>
                        )}
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// Using useMemo to memoize styles if they depend on props (though not directly here)
// For static styles, StyleSheet.create is already efficient.
const profileStyles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollViewContent: {
        flexGrow: 1, // Allow content to grow and be scrollable
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    profileCard: {
        width: '100%', // Use 100% width and let padding handle inner spacing
        maxWidth: 400, // Max width for larger screens
        padding: 25,
        alignItems: 'center',
        // No specific background for the card, background is handled by fullScreenContainer
    },
    logo: {
        width: 200,
        height: 150,
        borderRadius: 10,
        marginBottom: 20, // Add some margin below the logo
        backgroundColor: COLORS.logoBackground, // If logo has transparent background
    },
    slogan: {
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: 20,
        fontSize: FONT_SIZES.xLarge,
        fontFamily: 'EthnocentricBold'
    },
    text: {
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 20,
        fontSize: FONT_SIZES.small,
    },
    label: {
        fontSize: FONT_SIZES.medium,
        fontWeight: '600',
        marginBottom: 5,
        alignSelf: 'flex-start', // Align label to the left
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
        backgroundColor: 'transparent',
        color: COLORS.text,
    },
    passwordContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 15, // Adjusted margin for password container
    },
    passwordInput: {
        flex: 1, // Take up available space

    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        bottom: '45%',
    },
    inputError: {
        borderColor: COLORS.error, // Red border for errors
    },
    errorMessage: {
        color: COLORS.error,
        fontSize: FONT_SIZES.small,
        alignSelf: 'flex-start',
        marginTop: -10, // Adjust to position correctly below input
        marginBottom: 10,
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginTop: -10, // Adjust to align with password input
        marginBottom: 15,
    },
    forgotPassword: {
        color: COLORS.primary,
        fontSize: FONT_SIZES.small,
    },
    fullWidthButton: {
        width: '100%',
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
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