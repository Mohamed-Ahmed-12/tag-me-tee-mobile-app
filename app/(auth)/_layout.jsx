import { createDrawerNavigator } from '@react-navigation/drawer';
import { Slot } from 'expo-router';
import CustomDrawerContent from '../../src/components/CustomDrawerContent';
import QRProfileScreen from './profile';
import EditProfile from './edit-profile';
import { COLORS, FONT_SIZES } from '../../assets/styles/stylesheet';
import { Text } from 'react-native';

const Drawer = createDrawerNavigator();

export default function AuthLayout() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="profile" component={QRProfileScreen} options={{
        title: "My Profile", drawerLabel: ({ focused, color }) => (
          <Text style={{
            fontSize: FONT_SIZES.medium,
            color: focused ? COLORS.primary : COLORS.background,
            fontFamily: 'EthnocentricBold'
          }}>
            My Profile
          </Text>)
      }} />
      <Drawer.Screen name="edit-profile" component={EditProfile} options={{
        title: "Edit Profile", drawerLabel: ({ focused, color }) => (
          <Text style={{
            fontSize: FONT_SIZES.medium,
            color: focused ? COLORS.primary : COLORS.background,
            fontFamily: 'EthnocentricBold'
          }}>
            Edit Profile
          </Text>)
      }} />
    </Drawer.Navigator>
  );
}
