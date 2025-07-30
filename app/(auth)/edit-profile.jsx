import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { AuthContext } from '../../src/context/AuthContext';
import AppText from '../../src/components/AppText';
import { COLORS , FONT_SIZES } from '../../assets/styles/stylesheet';



export default function EditProfile() {
    const { profileData, userProfile , updateUserProfile} = useContext(AuthContext);
    const [isLoadingInitialData, setIsLoadingInitialData] = useState(true); // New state for initial data loading
    const [isSubmitting, setIsSubmitting] = useState(false); // Renamed from 'loading' for clarity

    const [uid , setUID] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [link, setLink] = useState("");

    // State for input errors
    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [linkError, setLinkError] = useState(false);

    // Effect to populate input fields when profileData is available
    useEffect(() => {
        if (profileData) {
            setUID(profileData.id);
            setUsername(profileData.username || "");
            setEmail(profileData.email || "");
            setLink(profileData.link || "");
            setIsLoadingInitialData(false); // Data loaded, stop initial loading
        } else {
            // If profileData is not available, try to fetch it
            userProfile().then(() => {
                setIsLoadingInitialData(false); // Stop loading after fetch attempt
            }).catch(() => {
                setIsLoadingInitialData(false);
            });
        }
    }, [profileData, userProfile]);

     const handleSubmit = useCallback(async () => {
        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();
        const trimmedLink = link.trim();

        let hasError = false;
        if (!trimmedUsername) {
            setUsernameError(true);
            hasError = true;
        } else {
            setUsernameError(false);
        }

        if (!trimmedEmail) {
            setEmailError(true);
            hasError = true;
        } else {
            setEmailError(false);
        }

        if (!trimmedLink) {
            setLinkError(true);
            hasError = true;
        } else {
            setLinkError(false);
        }

        if (hasError) {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Call the updateUserProfile function from context
            await updateUserProfile({
                username: trimmedUsername,
                email: trimmedEmail,
                link: trimmedLink, // Make sure 'link' is the correct key expected by your backend via updateUserProfile
            },profileData.id);

        } catch (error) {
            console.error("Error during profile update submission:", error);
            Alert.alert("Error", "An unexpected error occurred during update.");
        } finally {
            setIsSubmitting(false);
        }
    }, [username, email, link, updateUserProfile]); // Add updateUserProfile to dependencies

    // Determine if the "Apply Changes" button should be active
    const isButtonActive = username.trim() !== '' && email.trim() !== '' && link.trim() !== '';

    if (isLoadingInitialData) {
        return (
            <View style={profileStyles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <AppText style={profileStyles.loadingText}>Loading Profile...</AppText>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={profileStyles.fullScreenContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
            <ScrollView
                contentContainerStyle={profileStyles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={profileStyles.profileCard}>
                    <AppText style={profileStyles.title}>Edit Your Profile</AppText>
                    {/* --- */}

                    <AppText style={profileStyles.label}>Username:</AppText>
                    <TextInput
                        style={[
                            profileStyles.input,
                            usernameError && profileStyles.inputError
                        ]}
                        placeholderTextColor={COLORS.placeholder}
                        value={username}
                        onChangeText={(text) => {
                            setUsername(text);
                            setUsernameError(false); // Clear error on change
                        }}
                        placeholder="Enter your username"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {usernameError && <AppText style={profileStyles.errorMessage}>Username is required.</AppText>}

                    <AppText style={profileStyles.label}>Email Address:</AppText>
                    <TextInput
                        style={[
                            profileStyles.input,
                            emailError && profileStyles.inputError
                        ]}
                        placeholderTextColor={COLORS.placeholder}
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setEmailError(false); // Clear error on change
                        }}
                        placeholder="Enter your email address"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {emailError && <AppText style={profileStyles.errorMessage}>Email is required.</AppText>}

                    <AppText style={profileStyles.label}>QR Code Link:</AppText>
                    <TextInput
                        style={[
                            profileStyles.input,
                            linkError && profileStyles.inputError
                        ]}
                        placeholderTextColor={COLORS.placeholder}
                        value={link}
                        onChangeText={(text) => {
                            setLink(text);
                            setLinkError(false); // Clear error on change
                        }}
                        placeholder="Enter your QR code link (e.g., your website, portfolio)"
                        keyboardType="url"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {linkError && <AppText style={profileStyles.errorMessage}>QR Code Link is required.</AppText>}

                    {/* --- */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        style={[
                            profileStyles.fullWidthButton,
                            isSubmitting && profileStyles.buttonDisabled,
                            !isButtonActive && profileStyles.buttonInactive
                        ]}
                        disabled={isSubmitting || !isButtonActive}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color={COLORS.text} />
                        ) : (
                            <AppText style={profileStyles.buttonText}>Apply Changes</AppText>
                        )}
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const profileStyles = StyleSheet.create({
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