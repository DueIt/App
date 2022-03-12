import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarAlt, faList, faGear, faPlus} from '@fortawesome/free-solid-svg-icons';

//import Preferences from '../screens/preferencesScreen';
import Calendar from './screens/calendarScreen';
import Todo from './screens/todoScreen';
import Settings from './screens/preferencesScreen'; 
import AddTask from './screens/addTask';

const Tab = createBottomTabNavigator();
const CalendarStack = createStackNavigator();
const TodoStack = createStackNavigator();
const SettingsStack = createStackNavigator();

function CalendarNav() {
  return (
    <CalendarStack.Navigator screenOptions={{
      headerShown: false,
      animationEnabled: false,
      cardStyle: { backgroundColor: 'white' },
    }}
    >
      <CalendarStack.Screen name="Calendar" component={Calendar} />
      <CalendarStack.Screen name="Settings" component={Settings} />
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
      <TodoStack.Screen name="Settings" component={Settings} />
    </TodoStack.Navigator>
  );
}

function SettingsNav() {
  return (
    <SettingsStack.Navigator screenOptions={{
      headerShown: false,
      animationEnabled: false,
      cardStyle: { backgroundColor: 'white' },
    }}
    >
      <SettingsStack.Screen name="Settings" component={Settings} />
    </SettingsStack.Navigator>
  );
}

function AddTaskNav() {
  return (
    <AddTaskStack.Navigator screenOptions={{
      headerShown: false,
      animationEnabled: false,
      cardStyle: { backgroundColor: 'white' },
    }}
    >
      <AddTaskStack.Screen name="AddTask" component={AddTask} />
      <AddTaskStack.Screen name="Settings" component={Settings} />
    </AddTaskStack.Navigator>
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
          if (route.name === 'SettingsNav') {
            return <FontAwesomeIcon icon={faGear} size={20} />;
          }
          if (route.name === 'AddTask') {
            return <FontAwesomeIcon icon={faPlus} size={35} />;
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
        <Tab.Screen name="AddTask" component={AddTask} />
        <Tab.Screen name="CalendarNav" component={CalendarNav} />
        <Tab.Screen name="SettingsNav" component={SettingsNav} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
