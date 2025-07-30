import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Image,
    StatusBar,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../src/context/AuthContext';
import { Link } from 'expo-router';
import { API_BASE_URL } from '@env';
import AppText from '../../src/components/AppText';
import { FONT_SIZES, COLORS } from '../../assets/styles/stylesheet';

export default function QRProfileScreen() {
    const { profileData } = useContext(AuthContext)
    const [isLinkVisible, setIsLinkVisible] = useState(false);

    return (
        <SafeAreaView style={styles.container}>

            {/* Content */}
            <View style={styles.content}>

                {/* QR Code Section */}
                {profileData?.link &&
                    <>
                        <View style={styles.qrSection}>
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
                            gap: 5
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
                            >
                                DESTINATION LINK</AppText>
                        </View>

                        <TouchableOpacity style={styles.editButton}>
                            <Link href={'/edit-profile'}>
                                <AntDesign name="edit" size={20} color="#ffffff" />
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
                                    <Link
                                        href={profileData?.link}
                                        style={{
                                            fontSize: FONT_SIZES.medium,
                                            color: '#00e5ff',
                                        }}>
                                        {profileData?.link}
                                    </Link>
                                )

                        }

                    </View>

                </View>

            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    notSetLinkContainer: {
        width: '100%',
        height: 'auto',
        borderColor: '#373737',
        borderWidth: 1,
        borderRadius: 6,
        color: "#ffffff",
        padding: 15,

    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: COLORS.background,

    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },

    qrSection: {
        alignItems: 'center',
        marginBottom: 60,
    },
    qrContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    qrCode: {
        width: 200,
        height: 200,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.secondary,
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: COLORS.secondary,
        padding: 2,
        borderRadius: 2,
    },

});
