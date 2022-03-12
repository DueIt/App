import React, { useEffect, useState } from 'react';
import {
  Text, View, TextInput, SafeAreaView, ScrollView, Pressable,
} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { BlurView } from '@react-native-community/blur';
import { styles } from '../styles/calendarStyle';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

export default function Calendar({ navigation }) {
  const [hour, setHour] = useState(14/* new Date().getHours() */);
  const [minute, setMinute] = useState(10/* new Date().getMinutes() */);
  const [times, setTimes] = useState([]);
  const [events, setEvents] = useState([]);
  const [todos, setTodos] = useState([]);
  const [curDate, setCurDate] = useState(new Date);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [timeDone, setTimeDone] = useState(0);
  const [ref, setRef] = useState(null);
  const topGap = 9;
  const hourSize = 100;
  const daysOfWeek = ["S", "M", "T", "W", "R", "F", "Sa"];
  const [chosenDay, setChosenDay] = useState(daysOfWeek[curDate.getDay()]);




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

  useEffect(() => {
    setTimes(createCalendar());

    const testEvents = {
      items: [
        {
          title: 'CS 4510',
          start: '2022-02-25T22:30:00.000Z',
          end: '2022-02-25T23:00:00.000Z',
        },
        {
          title: 'CS 4261',
          start: '2022-02-25T21:00:00.000Z',
          end: '2022-02-25T21:45:00.000Z',
        },
      ],
    };
    setEvents(testEvents.items);

    const testTodos = {
      items: [
        {
          title: 'Math Homework',
          start: '2022-02-25T23:30:00.000Z',
          end: '2022-02-25T24:00:00.000Z',
        },
      ],
    };
    setTodos(testTodos.items);
  }, []);

  function calcEventDisplay(event) {
    const eventDate = Date.parse(event.start);
    const eventHours = new Date(event.start).getHours() - (hour + (minute > 30 ? 0.5 : 0));
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

  function settingsNavigate() {
    navigation.navigate("Settings");
  }

  return (
    <SafeAreaView tyle={{ overflow: 'visible' }}>
      <ScrollView
        style={{ overflow: 'visible' }}
        ref={(curRef) => {
          setRef(curRef);
        }}
        scrollEnabled={selectedIndex === -1}
      >
        <View style={styles.row}>
        
            <FontAwesomeIcon icon={faGear} style={styles.settings} size={24} color= 'white' />
          
          <Text style={styles.title}>{"Calendar"}</Text>
          <Pressable onPress={settingsNavigate}>
            <FontAwesomeIcon icon={faGear} style={styles.settings} size={24} />
          </Pressable>
        </View>
        <View style={styles.daysOfWeek}>
          {daysOfWeek.map((dayOfWeek) => (
            <Pressable style={chosenDay == dayOfWeek ? styles.pressedButton : styles.notPressedButton}
              onPress={() => setChosenDay(dayOfWeek)} >
              <Text>{dayOfWeek == "Sa" ? "S" : dayOfWeek}</Text>
            </Pressable>

          ))}

        </View>
        {selectedIndex !== -1
          && (
            <BlurView
              style={[styles.blur]}
              blurType="light"
              blurAmount={3}
            />
          )}
        <View style={styles.container}>
          {times.map((time) => (
            <View style={styles.timeSlot}>
              <Text style={styles.timeText}>{time}</Text>
              <View style={styles.timeLine} />
            </View>
          ))}
          {events.map((event) => {
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
          {todos.map((todo, i) => {
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
                    <Text style={[styles.popupButtonText]}>Complete</Text>
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
              </DropShadow>
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
