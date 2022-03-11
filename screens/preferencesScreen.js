import React, { useEffect, useState } from 'react';
import {
  Text, View, Alert, SafeAreaView, TouchableOpacity, ScrollView, Pressable, Picker
} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { components } from "react-select";
import RNCalendarEvents from "react-native-calendar-events";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { styles } from '../styles/preferencesStyle';
import { Dropdown } from 'react-native-material-dropdown';


export default function Preferences({ navigation }) {
  const [hasCalPermission, setHasCalPermission] = useState(false);
  const [availableCalendars, setAvailableCalendars] = useState([]);
  const [selectedCalendars, setSelectedCalendars] = useState(new Set());
  const [priorities, setPriorities] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState();

  useEffect(() => {
    RNCalendarEvents.checkPermissions(true)
      .then((result) => {
        if (result !== 'authorized') {
          RNCalendarEvents.requestPermissions((true))
            .then((result) => {
              if (result !== 'authorized') {
                Alert.alert('You need to enable calendar permissions to continue: ', 'Settings > CalApp > Calendars (On)');
              } else {
                setHasCalPermission(true);
              }
            });
        } else {
          setHasCalPermission(true);
        }
      }).catch((error) => {
        console.log('Error: ', error);
      });
  }, []);

  useEffect(() => {
    RNCalendarEvents.findCalendars()
      .then((result) => {
        result.forEach((element) => {
          setAvailableCalendars(result);
        });
      }).catch((error) => {
        console.log('Error: ', error);
      });
  }, [hasCalPermission]);

  useEffect(() => {
    const testPriorities = {
      items: [
        {
          label: 'Due Date',
          value: 'duedate',
        },
        {
          label: 'Length',
          value: 'length',
        },
        {
          label: 'Importance',
          value: 'importance',
        },
        {
          label: 'Difficulty',
          value: 'difficulty',
        },
      ],
    };
    setPriorities(testPriorities.items);
  }, []);

  function submitCalendarChange() {
    // const ids = ['BCB1FE69-C5AA-4434-A531-8717FEAD5E78'];
    const now = new Date();
    const curDate = now.toISOString();
    now.setDate(now.getDate() + 7);
    const weekDate = now.toISOString();
    if (selectedCalendars.size > 0) {
      RNCalendarEvents.fetchAllEvents(curDate, weekDate, Array.from(selectedCalendars))
        .then((result) => {
          result.forEach((element) => {
            console.log(element.title, element.startDate, element.endDate);
          });
          navigation.navigate('CalendarNav');
        });
    } else {
      [
      // handle the case of no calendars selected
      ];
    }
  }

  function setCalendar(id) {
    const newSet = new Set(selectedCalendars);
    if (newSet.has(id)) {
      newSet.delete(id);
      setSelectedCalendars(newSet);
    } else {
      newSet.add(id);
      setSelectedCalendars(newSet);
    }
  }


  function selectPriority(id) {
    const newSet = new Set();
    if (newSet.has(id)) {
      newSet.delete(id);
      setSelectedPriorities(newSet);
    } else {
      newSet.add(id);
      setSelectedPriorities(newSet);
    }
  }

  return (
    <SafeAreaView style={styles.scroll}>
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          <Text style={styles.title}>Settings: </Text>
        {/* Dropdown */}

        <View style={styles.container}>
          <Picker
            selectedValue={selectedValue}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue, itemIndex) => setSelectedPriority(itemValue)}
          >
            {priorities.map( (s, i) => {
            return <Picker.Item key={i} value={s} label={s} />
            })};
          </Picker>
        </View>

{/* Priorities */}
          <View style={styles.calendarItemContainer}>
          <Text style={styles.title}>Task Priority: </Text>
            {priorities.map((priority, i, row) => {
              if (i + 1 === row.length) {
                return (
                  <TouchableOpacity
                    style={[styles.calendarItem]}
                    onPress={() => selectPriority(priority.id)}
                    key={priority.id}
                  >
                    <View style={[styles.calendarItemInner, styles.calendarItemLast]}>
                      <Text style={styles.calendarItemText}>{priority.title}</Text>
                      { selectedPriorities.has(priority.id)
                        ? <FontAwesomeIcon icon={faCircleCheck} style={styles.checkImage} size={20} />
                        : null}
                    </View>
                  </TouchableOpacity>
                );
              }
              return (
                <TouchableOpacity
                  style={[styles.calendarItem]}
                  onPress={() => selectPriority(priority.id)}
                  key={priority.id}
                >
                  <View style={styles.calendarItemInner}>
                    <Text style={styles.calendarItemText}>{priority.title}</Text>
                    { selectedPriorities.has(priority.id)
                      ? <FontAwesomeIcon icon={faCircleCheck} style={styles.checkImage} size={20} />
                      : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
{/* Calendars from iCal */}
          <View style={styles.calendarItemContainer}>
          <Text style={styles.title}>Choose your Calendar: </Text>
            {availableCalendars.map((data, i, row) => {
              if (i + 1 === row.length) {
                return (
                  <TouchableOpacity
                    style={[styles.calendarItem]}
                    onPress={() => setCalendar(data.id)}
                    key={data.id}
                  >
                    <View style={[styles.calendarItemInner, styles.calendarItemLast]}>
                      <Text style={styles.calendarItemText}>{data.title}</Text>
                      { selectedCalendars.has(data.id)
                        ? <FontAwesomeIcon icon={faCircleCheck} style={styles.checkImage} size={20} />
                        : null}
                    </View>
                  </TouchableOpacity>
                );
              }
              return (
                <TouchableOpacity
                  style={[styles.calendarItem]}
                  onPress={() => setCalendar(data.id)}
                  key={data.id}
                >
                  <View style={styles.calendarItemInner}>
                    <Text style={styles.calendarItemText}>{data.title}</Text>
                    { selectedCalendars.has(data.id)
                      ? <FontAwesomeIcon icon={faCircleCheck} style={styles.checkImage} size={20} />
                      : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <DropShadow
            style={[styles.shadow, styles.doneButtonWrapper]}
          >
            <Pressable
              style={({ pressed }) => [styles.doneButton, pressed ? styles.pressed : null, selectedCalendars.size == 0 ? styles.disabled : null]}
              onPress={submitCalendarChange}
              disabled={selectedCalendars.size == 0}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          </DropShadow>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
