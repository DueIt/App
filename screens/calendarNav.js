import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Preferences from './screens/preferencesScreen';
import Calendar from './screens/calendarScreen';

const Stack = createStackNavigator();

export default function calendarNav() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false,
        animationEnabled: false,
        cardStyle: { backgroundColor: 'white' },
      }}
      >
        <Stack.Screen name="Calendar" component={Calendar} />
        <Stack.Screen name="Preferences" component={Preferences} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
