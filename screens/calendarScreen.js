import React, { useEffect, useState, Component } from 'react';
import {
  Text, View, TextInput, SafeAreaView, ScrollView, Pressable,
} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { BlurView } from '@react-native-community/blur';
import { styles } from '../styles/calendarStyle';
import { GestureDetector, Swipeable } from 'react-native-gesture-handler';
import { Settings2 } from 'react-native-web';

export default function Calendar({ route , navigation }) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getEvents();
      getEventsAndTodosForToday()
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    console.log(todaysEvents)
    getEventsAndTodosForToday() 
  }, [events, todos])

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
  chosenDay = addDays(today, numDaysAfterToday);
  const [todaysEvents, setTodaysEvents] = useState([]);
  const [todaysTodos, setTodaysTodos] = useState([]);
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
        start: '2022-04-30T23:30:00.000Z',
        end: '2022-04-30T24:00:00.000Z',
      },
    ],
  };

  async function getEvents() {
    setTimes(createCalendar());
    setEvents(testEvents.items);
    setTodos(testTodos.items);
  };

  // TODO: @Matt this needs to set two lists of events and todos with title, start time and end time
  // These events should come from ical and google Calendar, and are sorted to only be the events for the chosen
  // Todos should come from your alg. also i think todos will also need task_id for backend calls like update time
  //side note sometimes you have to click around the days a bit for the items to populate on calendar or do control s... i think i did async wrong and that's the issue? could also be calendar navigatioin in App.js

  async function getEventsAndTodosForToday() {
    temp = await getEvents();
    setTodaysTodos(todos.filter(isToday))
    setTodaysEvents(events.filter(isToday))
    return
  }

  const LeftAction = () => {
    return CalendarDisplay()
  } 

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function isToday(eventOrTodo){
    eventOrTodoDate = new Date(eventOrTodo.start);
    eventOrTodoDay = eventOrTodoDate.getUTCDate();
    eventOrTodoMonth = eventOrTodoDate.getUTCMonth()
    eventOrTodoYear = eventOrTodoDate.getUTCFullYear();
    chosenDayDay = chosenDay.getUTCDate();
    chosenDayMonth = chosenDay.getUTCMonth();
    chosenDayYear = chosenDay.getUTCFullYear();
    return (eventOrTodoDay == chosenDayDay && eventOrTodoMonth == chosenDayMonth && eventOrTodoYear == chosenDayYear)
  }


  async function updateRemainingTime(task_id, time) {
    const jwt = await SInfo.getItem('jwt', {
        sharedPreferencesName: 'dueItPrefs',
        keychainService: 'dueItAppKeychain',
    });
    var obj = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Token': jwt
        },
        body: JSON.stringify(
            {
                'remaining_time': time
            }
        )
    }
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
      setSelectedTodoDisplay( calcEventDisplay(event));
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

  return (
    <SafeAreaView style={styles.scroll}>
    <ScrollView
        style={{ overflow: 'hidden' }}
        ref={(curRef) => {
          setRef(curRef);
        }}
        //scrollEnabled={selectedIndex === -1}
      >
          <View collapsable={false}>
          <View style={[styles.container,{marginTop:10}]}>
        {times.map((time) => {
          return (<View style={styles.timeSlot}>
            <Text style={styles.timeText}>{time}</Text>
            <View style={styles.timeLine} />
          </View>);})}
        
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

                    //TODO: @Sewick update time with todayTodos[selectedIndex].eventTimeString which is a string of minutes
                    //will need to wait until matt finishes the task population stuff
                    //because you will need todayTodos[selectedIndex].task_id which doesn't exist yet
                    //side note sometimes you have to click around the days a bit for the items to populatee in the calendar screen or save a tiny change to this file...
                    { null,
                      todoPress(selectedIndex,9)}}
                >
                  <Text style={[styles.popupButtonText]}>Update Time</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [styles.popupButton,
                  styles.delayButton,
                  pressed ? styles.pressed : null]}
                  onPress={() => {todoPress(selectedIndex,9),setTodaysTodos(todaysTodos.splice(selectedIndex-1,1))}}
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
                //TODO: @Sewick add the remove function and remove this task... will need to wait until matt finishes the task population stuff
                //because you will need todayTodos[selectedIndex].task_id which doesn't exist yet
                
                { null,
                  todoPress(selectedIndex,9)}
              }>
                <Text style={styles.exitButton}>Delete Item</Text>
              </Pressable>
            </DropShadow>
            </View>
          )}
      </View>
          </View>   
          <View style={[{height:50}]}></View>     
      </ScrollView>
    </SafeAreaView>
  );
}
