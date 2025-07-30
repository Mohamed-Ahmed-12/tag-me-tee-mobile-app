import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { MyContext } from '../context/AuthContext';
import AppText from './AppText';
import { COLORS, FONT_SIZES } from '../../assets/styles/stylesheet';

export default function CustomDrawerContent(props) {
    const { logout, profileData } = useContext(MyContext);
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
            <View>
                <View style={styles.header}>
                    <AppText style={styles.welcome}>Hello, {profileData?.username || 'Guest'} 👋</AppText>
                </View>
                <DrawerItemList {...props} />
            </View>

            <View style={styles.footer}>
                <Button title="Logout" onPress={logout}  />
                <Text style={styles.note}>Thanks for using our app!</Text>
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    header: {
        padding: 16,
        backgroundColor: '#f0f0f0',
        marginBottom: 16
    },
    welcome: {
        fontSize: FONT_SIZES.large,
        color: COLORS.primary
    },
    footer: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    note: {
        marginTop: 10,
        fontSize: 14,
        color: '#888',
    },
});
