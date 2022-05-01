import React, { useEffect, useState } from 'react';
import {
  Text, View, Pressable,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { styles } from './styles/calendarStyle';
import {
  faCalendarAlt, faList, faGear, faPlus, faCheckSquare
} from '@fortawesome/free-solid-svg-icons';

// import Preferences from '../screens/preferencesScreen';

import SInfo from 'react-native-sensitive-info';
import Calendar from './screens/calendarScreen';
import Todo from './screens/todoScreen';
import Completed from './screens/completedScreen';
import Settings from './screens/preferencesScreen';
import AddTask from './screens/addTask';
import Login from './screens/loginScreen';
import Signup from './screens/signupScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import { NonceProvider } from 'react-select';

const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const CalendarStack =  createMaterialTopTabNavigator();
const TodoStack = createStackNavigator();
const CompletedStack = createMaterialTopTabNavigator();
const SettingsStack = createStackNavigator();
const daysOfWeek = calculateDaysOfWeekLeft();
export const AuthContext = React.createContext();

function calculateDaysOfWeekLeft(){
  curDate = new Date;
  curDay = curDate.getUTCDay();
  daysOfWeekTemplate = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  newDaysOfWeek = daysOfWeekTemplate.slice(curDay,curDay+7);
  return newDaysOfWeek
}

function CalendarNav({navigation}) {
  return (
      <View style={[{margin:0,flex:1}]}>
      <CalendarTabBar initialParams={{navigation: navigation}}
      ></CalendarTabBar>
    <CalendarStack.Navigator screenOptions={{
      initialRouteName:daysOfWeek[0],

      initialParams:{day: daysOfWeek[0], daysAfter: 0},
      animationEnabled: false,
      cardStyle: { backgroundColor: 'white' },
    }}>
      {daysOfWeek.map((dayOfWeek, i) => (
              <CalendarStack.Screen name={dayOfWeek} component={Calendar} initialParams={{day: dayOfWeek, daysAfter: i}}/>
      ))}
    </CalendarStack.Navigator>
    </View>
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
      <TodoStack.Screen name="CompletedNav" component={CompletedNav}/>
    </TodoStack.Navigator>
  );
}

function CalendarTabBar({navigation}) {
  // function settingsNavigate(navigation) {
  //   navigation.navigate("Settings");
  // }

  //TODO @Matt i tried for like two hours to get this navigation to work. its kinda tricky since its not a direct child of the og tab.navigator 
  //otherwise, might have to put settings back on bottom so sorry :/


  return (
  <View style={[styles.calendarTabBar]}>
          <FontAwesomeIcon icon={faGear} style={styles.settings} size={24} color='white' />
          <Text style={styles.title}>{"Calendar"}</Text>
          <Pressable onPress={
            //settingsNavigate(navigation)
            null
          }
          >
            <FontAwesomeIcon icon={faGear} style={styles.settings} size={24} />
          </Pressable>
        </View> 
  );
}

function CompletedNav() {
  return (
      <View style={[{flex:1}]}>
        <CompletedTabBar></CompletedTabBar>
    <CompletedStack.Navigator screenOptions={{
      headerShown: false,
      animationEnabled: false,
      cardStyle: { backgroundColor: 'white' },
    }}
    >
      <CompletedStack.Screen name="Week" component={Completed} />
      <CompletedStack.Screen name="Month" component={Completed} />
      <TodoStack.Screen name="Year" component={Completed} />

    </CompletedStack.Navigator>
    </View>
  );
}

function todoNavigate() {
  navigation.navigate("Todo");
}
function settingsNavigate(navigation) {
  navigation.navigate("Settings");
}

function CompletedTabBar() {
  return (<View style={styles.calendarTabBar}>
                    <Pressable onPress={() => todoNavigate()}>
                        <FontAwesomeIcon icon={faCheckSquare} style={styles.checkImage} size={24} />
                    </Pressable>
                    <Text style={styles.title2}>Completed</Text>
                    <Pressable onPress={settingsNavigate}
                    >
                        <FontAwesomeIcon icon={faGear} style={styles.settings} size={24} />
                    </Pressable>
                </View>)}

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
        {state.userToken == null
          ? (
            <AuthStack.Navigator screenOptions={{
              headerShown: false,
              //headerMode: 'none',
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
              <Tab.Screen name="CalendarNav" component={CalendarNav}/>
              {/* <Tab.Screen name="SettingsNav" component={SettingsNav} /> */}
            </Tab.Navigator>
          )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;
