import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCalendarAlt, faList, faGear, faPlus,
} from '@fortawesome/free-solid-svg-icons';

// import Preferences from '../screens/preferencesScreen';

import SInfo from 'react-native-sensitive-info';
import Calendar from './screens/calendarScreen';
import Todo from './screens/todoScreen';
import Settings from './screens/preferencesScreen';
import AddTask from './screens/addTask';
import Login from './screens/loginScreen';
import Signup from './screens/signupScreen';

const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const CalendarStack = createStackNavigator();
const TodoStack = createStackNavigator();
const SettingsStack = createStackNavigator();
export const AuthContext = React.createContext();

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

function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
      case 'SIGN_IN':
        return {
          ...prevState,
          isSignout: false,
          userToken: action.token,
        };
      case 'SIGN_OUT':
        return {
          ...prevState,
          isSignout: true,
          userToken: null,
        };
      }
    },
    {
      isSignout: false,
      userToken: null,
    },
  );

  useEffect(async () => {
    const savingJWT = await SInfo.getItem('jwt', {
      sharedPreferencesName: 'dueItPrefs',
      keychainService: 'dueItAppKeychain',
    });

    if (savingJWT) {
      dispatch({ type: 'SIGN_IN', token: savingJWT });
    }
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        dispatch({ type: 'SIGN_IN', token: data.token });
      },
      signOut: async () => {
        await SInfo.deleteItem('jwt', {
          sharedPreferencesName: 'dueItPrefs',
          keychainService: 'dueItAppKeychain',
        });
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async (data) => {
        dispatch({ type: 'SIGN_IN', token: data.token });
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.userToken === null
          ? (
            <AuthStack.Navigator screenOptions={{
              headerShown: false,
              animationEnabled: false,
              cardStyle: { backgroundColor: 'white' },
            }}
            >
              <AuthStack.Screen name="Login" component={Login} />
              <AuthStack.Screen name="Signup" component={Signup} />
            </AuthStack.Navigator>
          )
          : (
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
          )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;
