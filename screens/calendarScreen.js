import React, { useEffect, useState } from 'react';
import {
  Text, View, TextInput, SafeAreaView, ScrollView, Pressable,
} from 'react-native';
import { Component } from 'react';
import DropShadow from 'react-native-drop-shadow';
import { BlurView } from '@react-native-community/blur';
import { styles } from '../styles/calendarStyle';
import { GestureDetector, Swipeable } from 'react-native-gesture-handler';
import { Settings2 } from 'react-native-web';

export default function Calendar({ route , navigation }) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getTasks();
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const [hour, setHour] = useState(6/* new Date().getHours() */);
  const [minute, setMinute] = useState(10/* new Date().getMinutes() */);
  const [times, setTimes] = useState([]);
  const [events, setEvents] = useState([]);
  const [todos, setTodos] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [timeDone, setTimeDone] = useState(0);
  const [ref, setRef] = useState(null);
  const topGap = 9;
  const hourSize = 100;
  const selectedDay = route.params.day;
  const numDaysAfterToday = route.params.daysAfter;
  const [today, setToday] = useState(new Date());
  const [todaysEvents, setTodaysEvents] = useState([]);
  today.setDate(today.getDate()+numDaysAfterToday);
  const [todaysTodos, setTodaysTodos] = useState([]);
  const LeftAction = () => {
    return CalendarDisplay()
  }

  useEffect(() => {
    setTimes(createCalendar());

    const testEvents = {
      items: [
        {
          title: 'CS 4510',
          start: '2022-04-27T22:30:00.000Z',
          end: '2022-04-27T23:00:00.000Z',
        },
        {
          title: 'CS 4261',
          start: '2022-04-27T21:00:00.000Z',
          end: '2022-04-27T21:45:00.000Z',
        },
        {
          title: 'Your mom',
          start: '2022-04-27T21:00:00.000Z',
          end: '2022-04-27T21:45:00.000Z',
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
    setEvents(testEvents.items);
    setTodaysEvents(getEventsForToday());

    const testTodos = {
      items: [
        {
          title: 'Math Homework',
          start: '2022-04-27T23:30:00.000Z',
          end: '2022-04-27T24:00:00.000Z',
        },
      ],
    };
    setTodos(testTodos.items);
    setTodaysTodos(getTodosForToday());
  }, []);


  // TODO: @Matt this need to return a list of events with title, start time and end time
  // These events should come from ical and google Calendar, and only be the events for the specified day
  function getEventsForToday() {
    console.log(events)
    console.log(events.filter(isToday))
    return events.filter(isToday)
  }

  function getTodosForToday() {
    return todos.filter(isToday)
  }

  function isToday(eventOrTodo){
    eventOrTodoDate = new Date(eventOrTodo);
    eventOrTodoDay = eventOrTodoDate.getDate();
    eventOrTodoMonth = eventOrTodoDate.getMonth();
    eventOrTodoYear = eventOrTodoDate.getFullYear();
    todayDay = today.getDate();
    todayMonth = today.getMonth();
    todayYear = today.getFullYear();

    return (eventOrTodoDay == todayDay && eventOrTodoMonth == todayMonth && eventOrTodoYear == todayYear)
  }

  function CalendarDisplay() {
    return (<>
      <View style={[styles.container,{marginTop:10}]}>
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
            <DropShadow style={[styles.shadow, styles.todoPopup, calcStyle()]}>
              <View style={styles.popupButtonWrapper}>
                <Pressable
                  style={({ pressed }) => [styles.popupButton,
                  styles.completeButton,
                  pressed ? styles.pressed : null]}
                  onPress={() => null}
                >
                  <Text style={[styles.popupButtonText]}>Update Time</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [styles.popupButton,
                  styles.delayButton,
                  pressed ? styles.pressed : null]}
                  onPress={() => null}
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
              <Pressable onPress={addTaskNavigate}>
                <Text style={styles.exitButton}>Delete Item</Text>
              </Pressable>
            </DropShadow>
          )}
      </View></>)
  }

  function addTaskNavigate() {
    navigation.navigate("AddTask");
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

  const getTasks = async () => {
    const jwt = await SInfo.getItem('jwt', {
      sharedPreferencesName: 'dueItPrefs',
      keychainService: 'dueItAppKeychain',
    });
    var obj = {
      method: 'GET',
      headers: {
        'Token': jwt
      }
    }
    try {
      const response = await fetch(`${URL}/get-tasks`, obj);
      const json = await response.json();
      setTodos(json.tasks);
      console.log()
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTasks();
  }, []);

  
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
      const event = todos[index];
      const min = (Date.parse(event.end) - Date.parse(event.start)) / 1000 / 60;
      setTimeDone(min.toString());
      setSelectedIndex(index);
      scrollHandler(offset);
    }
  }

  function closeTodo() {
    setSelectedIndex(-1);
  }

  function calcStyle() {
    const todoDisplay = calcEventDisplay(todos[selectedIndex]);
    const popupTop = 3 + todoDisplay.startOffset + todoDisplay.eventHeight;
    return { top: popupTop };
  }

  return (
    <SafeAreaView style={styles.scroll}>
    <ScrollView
        style={{ overflow: 'hidden' }}
        ref={(curRef) => {
          setRef(curRef);
        }}
        scrollEnabled={selectedIndex === -1}
      >
          <View collapsable={false}>
            <CalendarDisplay >
            </CalendarDisplay>
          </View>        
      </ScrollView>
    </SafeAreaView>
  );
}
