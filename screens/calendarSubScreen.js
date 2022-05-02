import React, { useEffect, useState, Component } from 'react';
import {
  Text, View, TextInput, SafeAreaView, ScrollView, Pressable,
} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { BlurView } from '@react-native-community/blur';
import RNCalendarEvents from 'react-native-calendar-events';

import { GestureDetector, Swipeable } from 'react-native-gesture-handler';
import { Settings2 } from 'react-native-web';
import { styles } from '../styles/calendarStyle';

export default function InnerCalendar({ props }) {
//   React.useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       getEventsAndTodosForToday();
//     });
//     // Return the function to unsubscribe from the event so it gets removed on unmount
//     return unsubscribe;
//   }, []);

  React.useEffect(() => {
    getEventsAndTodosForToday();
  }, [props.events, props.todos]);

  const [hour, setHour] = useState(6/* new Date().getHours() */);
  const [minute, setMinute] = useState(10/* new Date().getMinutes() */);
  const [times, setTimes] = useState(createCalendar());
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [timeDone, setTimeDone] = useState(0);
  const [ref, setRef] = useState(null);
  const chosenDay = props.day;
  const topGap = 9;
  const hourSize = 100;
  const [todaysEvents, setTodaysEvents] = useState([]);
  const [todaysTodos, setTodaysTodos] = useState([]);
  const [selectedTodoDisplay, setSelectedTodoDisplay] = useState([]);

  async function updateRemainingTime(task_id, time) {
    const jwt = await SInfo.getItem('jwt', {
      sharedPreferencesName: 'dueItPrefs',
      keychainService: 'dueItAppKeychain',
    });
    const obj = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Token: jwt,
      },
      body: JSON.stringify(
        {
          remaining_time: time,
        },
      ),
    };
    fetch(`${URL}/update-time/${task_id}`, obj).then((res) => {
      if (res.status === 401) {
        setError('Invalid auth token.');
      } else if (res.status === 500) {
        setError('Sorry, there was a server error. Please try again.');
      } else if (res.status !== 200) {
        setError('Something went wrong.');
      }
    }).catch((curError) => {
      console.log(`There was a problem connecting: ${curError.message}`);
    });
  }

  function getEventsAndTodosForToday() {
    setTodaysTodos(props.todos.filter(isToday));
    setTodaysEvents(props.events.filter(isToday));
  }

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function isToday(eventOrTodo) {
    const eventOrTodoDate = new Date(eventOrTodo.start);
    const eventOrTodoDay = eventOrTodoDate.getUTCDate();
    const eventOrTodoMonth = eventOrTodoDate.getUTCMonth();
    const eventOrTodoYear = eventOrTodoDate.getUTCFullYear();
    const chosenDayDay = chosenDay.getUTCDate();
    const chosenDayMonth = chosenDay.getUTCMonth();
    const chosenDayYear = chosenDay.getUTCFullYear();
    return (eventOrTodoDay == chosenDayDay && eventOrTodoMonth == chosenDayMonth && eventOrTodoYear == chosenDayYear);
  }

  function createCalendar() {
    const newTimes = [];
    let curHour = hour;
    let curMinute = minute > 30 ? 30 : 0;
    while (curHour + (curMinute / 60) <= 24) {
      const minString = curMinute === 0 ? '00' : '30';
      newTimes.push(`${curHour}:${minString}`);
      if (curMinute === 0) {
        curMinute = 30;
      } else {
        curHour += 1;
        curMinute = 0;
      }
    }
    return newTimes;
  }

  function calcEventDisplay(event) {
    const eventDate = Date.parse(event.start);
    const eventHours = new Date(event.start).getHours() - (hour - 4 + (minute > 30 ? 0.5 : 0));
    const startOffset = topGap + eventHours * hourSize;
    const eventTime = (Date.parse(event.end) - eventDate) / 1000 / 60 / 60;
    const mins = parseInt(eventTime * 60 % 60);
    const hours = parseInt(eventTime);
    let eventTimeString = `${mins} ${mins === 1 ? 'min' : 'mins'}`;
    if (eventTime >= 1) {
      eventTimeString = `${hours} ${hours === 1 ? 'hour' : 'hours'} ${mins} ${mins === 1 ? 'min' : 'mins'}`;
    }
    const eventHeight = hourSize * eventTime;

    return {
      eventHeight,
      startOffset,
      eventTimeString,
    };
  }

  function scrollHandler(offset) {
    ref.scrollTo({
      x: 0,
      y: offset,
      animated: true,
    });
  }

  function todoPress(index, offset) {
    if (selectedIndex === index) {
      setSelectedIndex(-1);
    } else {
      const event = todaysTodos[index];
      const min = (Date.parse(event.end) - Date.parse(event.start)) / 1000 / 60;
      setTimeDone(min.toString());
      setSelectedIndex(index);
      setSelectedTodoDisplay(calcEventDisplay(event));
      scrollHandler(offset);
    }
  }

  function closeTodo() {
    setSelectedIndex(-1);
  }

  function calcStyle() {
    const todoDisplay = calcEventDisplay(todaysTodos[selectedIndex]);
    const popupTop = 3 + todoDisplay.startOffset + todoDisplay.eventHeight;
    return { top: popupTop };
  }

  // TODO: change update for props from setting a state to being it's own thing for events and todos

  return (
    <ScrollView
      style={{
        overflow: 'hidden',
        backgroundColor: 'white',
      }}
      ref={(curRef) => {
        setRef(curRef);
      }}
    >
      <View collapsable={false}>
        <View style={[styles.container, { marginTop: 10 }]}>
          {times.map((time) => (
            <View style={styles.timeSlot}>
              <Text style={styles.timeText}>{time}</Text>
              <View style={styles.timeLine} />
            </View>
          ))}

          {todaysEvents.map((event) => {
            const eventDisplay = calcEventDisplay(event);

            return (
              <View
                style={[{ height: eventDisplay.eventHeight, top: eventDisplay.startOffset },
                  styles.eventItem]}
              >
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventSubtitle}>{eventDisplay.eventTimeString}</Text>
              </View>
            );
          })}
          {todaysTodos.map((todo, i) => {
            const todoDisplay = calcEventDisplay(todo);
            return (
              <Pressable
                style={[{ height: todoDisplay.eventHeight, top: todoDisplay.startOffset },
                  styles.todoItem]}
                onPress={() => todoPress(i, todoDisplay.startOffset)}
              >
                <Text style={styles.todoTitle}>{todo.title}</Text>
                <Text style={styles.todoSubtitle}>{todoDisplay.eventTimeString}</Text>
              </Pressable>
            );
          })}
          {selectedIndex !== -1
          && (
            <Pressable
              style={[styles.blur]}
              onPress={() => closeTodo()}
            >
              <BlurView
                style={[styles.blur]}
                blurType="light"
                blurAmount={3}
              />
            </Pressable>
          )}
          {selectedIndex !== -1
          && (
            <View style={styles.absolute}>
              <Pressable
                style={[{ height: selectedTodoDisplay.eventHeight, top: selectedTodoDisplay.startOffset },
                  styles.todoItem]}
                onPress={() => todoPress(selectedIndex, selectedTodoDisplay.startOffset)}
              >
                <Text style={styles.todoTitle}>{todaysTodos[selectedIndex].title}</Text>
                <Text style={styles.todoSubtitle}>{selectedTodoDisplay.eventTimeString}</Text>
              </Pressable>
              <DropShadow style={[styles.shadow, styles.todoPopup, calcStyle()]}>
                <View style={styles.popupButtonWrapper}>
                  <Pressable
                    style={({ pressed }) => [styles.popupButton,
                      styles.completeButton,
                      pressed ? styles.pressed : null]}
                    onPress={() =>

                    // TODO: @Sewick update time with todayTodos[selectedIndex].eventTimeString which is a string of minutes
                    // will need to wait until matt finishes the task population stuff
                    // because you will need todayTodos[selectedIndex].task_id which doesn't exist yet
                    // side note sometimes you have to click around the days a bit for the items to populatee in the calendar screen or save a tiny change to this file...
                    {
                      null,
                      todoPress(selectedIndex, 9);
                    }}
                  >
                    <Text style={[styles.popupButtonText]}>Update Time</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [styles.popupButton,
                      styles.delayButton,
                      pressed ? styles.pressed : null]}
                    onPress={() => { todoPress(selectedIndex, 9), setTodaysTodos(todaysTodos.splice(selectedIndex - 1, 1)); }}
                  >
                    <Text style={[styles.popupButtonText]}>Do later</Text>
                  </Pressable>
                </View>
                <View style={styles.popupTimeWrapper}>
                  <Text style={styles.popupTimeLabel}>Time done</Text>
                  <View style={styles.timeInputWrapper}>
                    <TextInput
                      style={styles.timeInput}
                      onChangeText={(text) => setTimeDone(text.replace(/[^0-9]/g, ''))}
                      value={timeDone}
                      placeholder={timeDone}
                      keyboardType="numeric"
                    />
                  </View>
                  <Text style={styles.timeMin}>min</Text>
                </View>
                <Pressable onPress={() =>
                // TODO: @Sewick add the remove function and remove this task... will need to wait until matt finishes the task population stuff
                // because you will need todayTodos[selectedIndex].task_id which doesn't exist yet

                {
                  null,
                  todoPress(selectedIndex, 9);
                }}
                >
                  <Text style={styles.exitButton}>Delete Item</Text>
                </Pressable>
              </DropShadow>
            </View>
          )}
        </View>
      </View>
      <View style={[{ height: 50 }]} />
    </ScrollView>
  );
}
