import React, { useEffect, useState } from 'react';
import {
  Text, View, Alert, SafeAreaView, TouchableOpacity, ScrollView, Pressable, Picker,
} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
//import { components } from 'react-select';
import RNCalendarEvents from 'react-native-calendar-events';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
//import { Dropdown } from 'react-native-material-dropdown';
import { styles } from '../styles/preferencesStyle';
import DatePicker from 'react-native-date-picker';


export default function Preferences({ navigation }) {
  const [hasCalPermission, setHasCalPermission] = useState(false);
  const [availableCalendars, setAvailableCalendars] = useState([]);
  const [selectedCalendars, setSelectedCalendars] = useState(new Set());
  const [priorities, setPriorities] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState();
  const daysOfWeek = ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [workStart, setWorkStart] = useState(new Date());
  const [workEnd, setWorkEnd] = useState(new Date());
  const [selectedWorkDays, setSelectedWorkDays] = useState();




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

  function selectPriority(value) {
    const newValue = value;
    setSelectedPriority(newValue);
  }

  return (
    <SafeAreaView style={styles.scroll}>
      <ScrollView style={styles.scroll}>
        <View style={styles.card}>
          <DropShadow style={[styles.shadow, styles.newItemCard]}>
            <Text style={styles.title}>Preferences: </Text>
            <View style={styles.container}>
              <DropShadow style={[styles.shadow, styles.layerContainer]}>
                <Text style={styles.text}>Prioritize by: </Text>
                <Picker
                  selectedValue={selectedPriority}
                  style={{ width: 150, marginLeft: 30 }}
                  onValueChange={(itemValue, itemIndex) => selectPriority(itemValue)}
                >
                  <Picker.Item label="Due Date" value="duedate" />
                  <Picker.Item label="Difficulty" value="difficulty" />
                  <Picker.Item label="Longest First" value="longest" />
                  <Picker.Item label="Shortest First" value="shortest" />
                  <Picker.Item label="Importance" value="importance" />
                  <Picker.Item label="Start Date" value="startdate" />
                  <Picker.Item label="Work" value="work" />
                  <Picker.Item label="School" value="School" />
                </Picker>
              </DropShadow>
            </View>

            <View style={styles.setContainer}>
              <DropShadow style={[styles.shadow, styles.columnLayerContainer]}>
              
              <View style={styles.calendarItemLast}>
              <Text style={styles.text}>Work Days and Hours: </Text>
              </View>
              <View style={styles.layerContainer2}>

              <Picker
                  selectedValue={selectedWorkDays}
                  style={{  width: 150, marginLeft: 70 }}
                  onValueChange={(itemValue, itemIndex) => setSelectedWorkDays(itemValue)}
                >
                  <Picker.Item label="Weekdays" value="Weekdays" />
                  <Picker.Item label="All Days" value="All Days" />
                </Picker>
                </View>

                <View style={styles.calendarItemLast}>

<DatePicker style={styles.datePickerStyle} date={workStart} onDateChange={setWorkStart} mode="time"></DatePicker>

<Text style={styles.text}>-</Text>

<DatePicker style={styles.datePickerStyle} date={workEnd} onDateChange={setWorkEnd} mode="time"></DatePicker>
</View>
              </DropShadow>
            </View>

            <Text style={styles.title}>Calendars: </Text>
            {/* Calendars from iCal */}
            <View style={styles.calendarItemContainer}>
              <Pressable >
                {/* TODO: add other calendars like google and outlook */}
            <View style={styles.calendarItemInner}>
                        <Text style={styles.importText}>Import Calendar</Text>
                        <FontAwesomeIcon icon={faPlus} style={styles.checkImage} size={24} />

                      </View>
                      </Pressable>
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
                        {selectedCalendars.has(data.id)
                          ? <FontAwesomeIcon icon={faCircleCheck} style={styles.checkImage} size={20} />
                          : <View style={styles.uncheckedCircle} />}
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
                      {selectedCalendars.has(data.id)
                        ? <FontAwesomeIcon icon={faCircleCheck} style={styles.checkImage} size={20} />
                        : <View style={styles.uncheckedCircle} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <DropShadow
              style={[styles.shadow, styles.doneButtonWrapper]}
            >
              <Pressable
                style={({ pressed }) => [styles.doneButton, pressed ? styles.pressed : null, (selectedCalendars.size == 0 || selectPriority == null) ? styles.disabled : null]}
                onPress={submitCalendarChange}
                disabled={selectedCalendars.size == 0}
              >
                <Text style={styles.doneButtonText}>Update Preferences</Text>
              </Pressable>

            </DropShadow>
            <Pressable>
              { /* TODO: log usere out */}

              <Text style={styles.exitButton}>Logout</Text>
            </Pressable>
          </DropShadow>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
