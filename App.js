import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarAlt, faList } from '@fortawesome/free-solid-svg-icons';

import Preferences from './screens/preferencesScreen';
import Calendar from './screens/calendarScreen';
import Todo from './screens/todoScreen';

const Tab = createBottomTabNavigator();
const CalendarStack = createStackNavigator();
const TodoStack = createStackNavigator();

function CalendarNav() {
  return (
    <CalendarStack.Navigator screenOptions={{
      headerShown: false,
      animationEnabled: false,
      cardStyle: { backgroundColor: 'white' },
    }}
    >
      <CalendarStack.Screen name="Calendar" component={Calendar} />
      <CalendarStack.Screen name="Preferences" component={Preferences} />
    </CalendarStack.Navigator>
  );
}

function TodoNav() {
  return (
    <TodoStack.Navigator screenOptions={{
      headerShown: false,
      animationEnabled: false,
      cardStyle: { backgroundColor: 'white' },
    }}
    >
      <TodoStack.Screen name="Todo" component={Todo} />
    </TodoStack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'CalendarNav') {
            return <FontAwesomeIcon icon={faCalendarAlt} size={20} />;
          } if (route.name === 'TodoNav') {
            return <FontAwesomeIcon icon={faList} size={20} />;
          }
        },
        tabBarActiveTintColor: '#39A4FF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        animationEnabled: false,
        cardStyle: { backgroundColor: 'white' },
        tabBarShowLabel: false,
      })}
      >
        <Tab.Screen name="TodoNav" component={TodoNav} />
        <Tab.Screen name="CalendarNav" component={CalendarNav} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
