import React, { useEffect, useState, Component } from 'react';
import {
  Text, View, TextInput, SafeAreaView, ScrollView, Pressable,
} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { BlurView } from '@react-native-community/blur';
import RNCalendarEvents from 'react-native-calendar-events';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faRotateRight, faGear,
} from '@fortawesome/free-solid-svg-icons';

import SInfo from 'react-native-sensitive-info';

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { GestureDetector, Swipeable } from 'react-native-gesture-handler';
import { Settings2 } from 'react-native-web';
import { styles } from '../styles/calendarStyle';
import InnerCalendar from './calendarSubScreen';

import { URL } from '../setup';

const CalendarSubStack = createMaterialTopTabNavigator();

export default function Calendar({ route, navigation }) {
  useEffect(() => {
    getEvents();
  }, []);

  function calculateDaysOfWeekLeft() {
    curDate = new Date();
    curDay = curDate.getUTCDay();
    daysOfWeekTemplate = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    newDaysOfWeek = daysOfWeekTemplate.slice(curDay, curDay + 7);
    return newDaysOfWeek;
  }

  const daysOfWeek = calculateDaysOfWeekLeft();

  const [events, setEvents] = useState([]);
  const [todos, setTodos] = useState(['APE']);
  const selectedDay = daysOfWeek[0];
  const numDaysAfterToday = 0;
  const [today, setToday] = useState(new Date());
  const chosenDay = addDays(today, numDaysAfterToday);
  const [selectedTodoDisplay, setSelectedTodoDisplay] = useState([]);

  const testEvents = {
    items: [
      {
        title: 'CS 4510',
        start: '2022-05-03T22:30:00.000Z',
        end: '2022-05-03T23:00:00.000Z',
      },
      {
        title: 'CS 4261',
        start: '2022-05-03T21:00:00.000Z',
        end: '2022-05-03T21:45:00.000Z',
      },
      {
        title: 'Your mom',
        start: '2022-05-03T21:00:00.000Z',
        end: '2022-05-03T21:45:00.000Z',
      },
      {
        title: 'cool',
        start: '2022-04-28T23:00:00.000Z',
        end: '2022-04-28T23:45:00.000Z',
      },
      {
        title: 'another day another duty',
        start: '2022-04-28T08:00:00.000Z',
        end: '2022-04-28T08:45:00.000Z',
      },
    ],
  };
  const testTodos = {
    items: [
      {
        title: 'Math Homework',
        start: '2022-05-03T23:30:00.000Z',
        end: '2022-05-03T24:00:00.000Z',
      },
      {
        title: 'Finish sprint',
        start: '2022-05-03T08:30:00.000Z',
        end: '2022-05-03T09:00:00.000Z',
      },
      {
        title: 'meditate',
        start: '2022-04-28T09:30:00.000Z',
        end: '2022-04-28T10:00:00.000Z',
      },
      {
        title: 'take practice exam',
        start: '2022-04-28T11:30:00.000Z',
        end: '2022-04-28T12:45:00.000Z',
      },
      {
        title: 'cry',
        start: '2022-04-29T23:30:00.000Z',
        end: '2022-04-29T24:00:00.000Z',
      },
      {
        title: 'finish individual assignment',
        start: '2022-05-2T23:30:00.000Z',
        end: '2022-05-2T24:00:00.000Z',
      },
    ],
  };

  async function getEvents() {
    setEvents(testEvents.items);
    setTodos(testTodos.items);
  }

  // TODO: @Matt this needs to set two lists of events and todos with title, start time and end time
  // These events should come from ical and google Calendar, and are sorted to only be the events for the chosen
  // Todos should come from your alg. also i think todos will also need task_id for backend calls like update time
  // side note sometimes you have to click around the days a bit for the items to populate on calendar or do control s... i think i did async wrong and that's the issue? could also be calendar navigatioin in App.js

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  async function generateSchedule() {
    const jwt = await SInfo.getItem('jwt', {
      sharedPreferencesName: 'dueItPrefs',
      keychainService: 'dueItAppKeychain',
    });

    fetch(`${URL}/get-apple-calendars`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Token: jwt,
      },
    }).then((res) => {
      res.json().then(async (res) => {
        const { calendars } = res;

        const now = new Date();
        const curDate = now.toISOString();
        now.setDate(now.getDate() + 7);
        const weekDate = now.toISOString();

        const calEvents = [];

        await RNCalendarEvents.fetchAllEvents(curDate, weekDate, Array.from(calendars))
          .then(async (result) => {
            result.forEach((element) => {
              calEvents.push({
                start: element.startDate,
                end: element.endDate,
              });
            });
          });

        // Generate the calendar here
        console.log(calEvents);
        fetch(`${URL}/generate-schedule`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Token: jwt,
          },
          body: calEvents ? JSON.stringify(
            {
              startDate: curDate,
              events: calEvents,
            },
          ) : null,
        }).then((res) => {
          res.json().then(async (TaskRes) => {
            if (res.status === 200) {
              setTodos(TaskRes.tasks);
            } else {
              console.log(TaskRes.status);
            }
          }).catch((curError) => {
            console.log(curError);
            console.log(`${curError.status}: There was a problem getting the calendar: ${curError.message}`);
          });
        });
      }).catch((curError) => {
        console.log(`There was a problem connecting: ${curError.message}`);
      });
    }).catch((curError) => {
      console.log(`There was a problem connecting: ${curError.message}`);
    });
  }

  function settingsNavigate() {
    navigation.navigate('Settings');
  }

  return (
    <SafeAreaView style={[styles.body]}>
      <View style={[styles.calendarTabBar]}>
        <Pressable onPress={generateSchedule}>
          <FontAwesomeIcon icon={faRotateRight} style={styles.settings} size={24} />
        </Pressable>
        <Text style={styles.title}>Calendar</Text>
        <Pressable onPress={settingsNavigate}>
          <FontAwesomeIcon icon={faGear} style={styles.settings} size={24} />
        </Pressable>
      </View>
      <CalendarSubStack.Navigator screenOptions={{
        initialRouteName: daysOfWeek[0],
        headerShown: false,
        initialParams: { day: daysOfWeek[0], daysAfter: 0 },
        animationEnabled: false,
        cardStyle: { backgroundColor: 'white' },
      }}
      >
        {daysOfWeek.map((dayOfWeek, i) => (
          <CalendarSubStack.Screen name={dayOfWeek}>
            {(props) => (
              <InnerCalendar props={{ events, todos, day: addDays(chosenDay, i) }} />
            )}
          </CalendarSubStack.Screen>
        ))}
        {/* <CalendarSubStack.Screen name="FUCK" component={InnerCalendar} initialParams={{ events, todos }} /> */}
      </CalendarSubStack.Navigator>
    </SafeAreaView>
  );
}
