import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Image,
    StatusBar,
    ActivityIndicator,
    Alert,
    Clipboard,
    Text
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../src/context/AuthContext';
import { Link, useRouter } from 'expo-router';
import { API_BASE_URL } from '@env';
import AppText from '../../src/components/AppText';
import { FONT_SIZES, COLORS } from '../../assets/styles/stylesheet';
import ProtectedRoute from '../../src/components/ProtectedRoute';

export default function QRProfileScreen() {
    const {
        userProfile,
        profileData,
        tokens
    } = useContext(AuthContext);
    const [isProfileLoading, setIsProfileLoading] = useState(false)
    const [isLinkVisible, setIsLinkVisible] = useState(false);
    const router = useRouter();

    // Load profile data when component mounts
    useEffect(() => {
        if (!profileData && tokens) {
            setIsProfileLoading(true);
            userProfile().finally(() => setIsProfileLoading(false));
        }
    }, [profileData, tokens]);


    // Handle copying link to clipboard
    const handleCopyLink = () => {
        if (profileData?.link) {
            Clipboard.setString(profileData.link);
            Alert.alert('Copied!', 'Link copied to clipboard');
        }
    };

    return (
        <ProtectedRoute>
            {isProfileLoading ?
                <SafeAreaView style={styles.container}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                </SafeAreaView>
                :
                <SafeAreaView style={styles.container}>
                    {/* Content */}
                    <View style={styles.content}>

                        {/* QR Code Section */}
                        {profileData?.link &&
                            <>
                                <View style={styles.qrSection}>
                                    <AppText style={{ color: '#ccc', fontSize: FONT_SIZES.medium, marginBottom: 10 }}>
                                        Your QR Code
                                    </AppText>
                                    <View style={styles.qrContainer}>
                                        <Image source={{ uri: `${API_BASE_URL}/static/${profileData?.qr_image}` }} style={styles.qrCode} />
                                    </View>
                                </View>
                                <View style={{
                                    marginBottom: 15
                                }}>
                                    <TouchableOpacity style={styles.actionButtons} onPress={() => setIsLinkVisible(!isLinkVisible)}>
                                        <Ionicons name={isLinkVisible ? "eye-off" : "eye"} size={20} color="#00e5ff" />
                                        <AppText style={{ color: COLORS.primary }} onPress={() => setIsLinkVisible(!isLinkVisible)} > {isLinkVisible ? 'Hide QR Link' : 'View QR Link'}</AppText>
                                    </TouchableOpacity>
                                </View>
                            </>


                        }
                        <View style={styles.notSetLinkContainer}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: "center",
                                marginBottom: 15
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: "center",
                                    gap: 2
                                }}>
                                    <AntDesign name="link" size={20} color="#00e5ff" />
                                    <View style={{
                                        flexDirection: "column"
                                    }}>

                                    </View>
                                    <AppText
                                        style={{
                                            color: "#ffffff",
                                            fontSize: FONT_SIZES.large,
                                        }}
                                    >DESTINATION LINK</AppText>
                                </View>

                                <TouchableOpacity style={styles.editButton}>
                                    <Link href={'/edit-profile'}>
                                        <AntDesign name="edit" size={FONT_SIZES.small} color="#ffffff" />
                                    </Link>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                paddingHorizontal: 20
                            }}>
                                {
                                    !profileData?.link ?
                                        <>
                                            <AppText style={{
                                                color: "#ffffff",
                                                marginBottom: 10
                                            }}>
                                                No link set yet
                                            </AppText>
                                            <AppText
                                                style={{
                                                    color: "#999999",
                                                }}>
                                                Add a link where people will be redirected when they scan your code
                                            </AppText>
                                        </>
                                        :
                                        isLinkVisible && (
                                            <TouchableOpacity
                                                style={styles.linkUrlContainer}
                                                onPress={handleCopyLink}
                                                onLongPress={handleCopyLink}
                                            >
                                                <AppText
                                                    style={styles.linkUrl}
                                                    numberOfLines={1}
                                                    ellipsizeMode="tail"
                                                >
                                                    {profileData.link}
                                                </AppText>
                                                <Ionicons
                                                    name="copy"
                                                    size={16}
                                                    color={COLORS.primary}
                                                    style={styles.copyIcon}
                                                />
                                            </TouchableOpacity>
                                        )

                                }

                            </View>

                        </View>

                    </View>

                </SafeAreaView>
            }
        </ProtectedRoute>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: StatusBar.currentHeight,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    qrContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    qrCode: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: COLORS.secondary,
        borderWidth: 1,
        borderColor: COLORS.primary,
        gap: 8,
    },
    notSetLinkContainer: {
        width: '100%',
        backgroundColor: '#1d1d1d',
        borderRadius: 12,
        padding: 20,
        marginTop: 10,
    },
    editButton: {
        padding: 8,
        backgroundColor: '#444',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    linkUrlContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    linkUrl: {
        fontSize: FONT_SIZES.medium,
        color: COLORS.primary,
        flex: 1,
    },
    copyIcon: {
        marginLeft: 10,
    },
});
