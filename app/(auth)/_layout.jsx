import { createDrawerNavigator } from '@react-navigation/drawer';
import { Slot } from 'expo-router';
import CustomDrawerContent from '../../src/components/CustomDrawerContent';
import QRProfileScreen from './profile';
import EditProfile from './edit-profile';

const Drawer = createDrawerNavigator();

export default function AuthLayout() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props}/>}
    >
      <Drawer.Screen name="profile" component={QRProfileScreen} options={{title:"My Profile"}}/>
      <Drawer.Screen name="edit-profile" component={EditProfile} options={{title:"Edit Profile"}} />
    </Drawer.Navigator>
  );
}
