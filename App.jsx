import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import RecorderScreen from './screens/RecorderScreen'; // Your existing Recorder tab
import RegisterScreen from './screens/RegisterScreen'; // Registration screen
import LoginScreen from './screens/LoginScreen'; // Login screen
import ProfileScreen from './screens/ProfileScreen'; // Profile screen
import RecordingsListScreen from './screens/RecordingsListScreen'; // Recordings list

const Drawer = createDrawerNavigator();
const ProfileStack = createStackNavigator();

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator initialRouteName="Register">
      <ProfileStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Register' }}
      />
      <ProfileStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Login' }}
      />
      <ProfileStack.Screen
        name="RecordingsList"
        component={RecordingsListScreen}
        options={{ title: 'Recordings List' }}
      />
    </ProfileStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={({ route }) => ({
          drawerIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Recorder') {
              iconName = focused ? 'mic' : 'mic-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Drawer.Screen name="Recorder" component={RecorderScreen} />
        <Drawer.Screen
          name="Profile"
          component={ProfileStackNavigator}
          options={{ headerShown: false }}
        />
      </Drawer.Navigator>
      
    </NavigationContainer>
  );
}
