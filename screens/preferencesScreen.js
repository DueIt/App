import React, { useEffect, useState } from 'react';
import {
  Text, View, Alert, SafeAreaView, TouchableOpacity, ScrollView, Pressable, Picker,
} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
// import { components } from 'react-select';
import RNCalendarEvents from 'react-native-calendar-events';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
// import { Dropdown } from 'react-native-material-dropdown';
import DatePicker from 'react-native-date-picker';
import SInfo from 'react-native-sensitive-info';
import { styles } from '../styles/preferencesStyle';
import { URL } from '../setup';
import { AuthContext } from '../App';

export default function Preferences({ navigation }) {
  const [hasCalPermission, setHasCalPermission] = useState(false);
  const [hasGooglePermission, setHasGooglePermission] = useState(false);
  const [availableCalendars, setAvailableCalendars] = useState([]);
  const [selectedCalendars, setSelectedCalendars] = useState(new Set());
  const [priorities, setPriorities] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState();
  const [error, setError] = useState('');
  const [availableGoogleCalendars, setAvailableGoogleCalendars] = useState([]);
  const [selectedGoogleCalendars, setSelectedGoogleCalendars] = useState(new Set());
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [workStart, setWorkStart] = useState(new Date());
  const [workEnd, setWorkEnd] = useState(new Date());
  const [selectedWorkDays, setSelectedWorkDays] = useState();
  const { signOut } = React.useContext(AuthContext);

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
    if (hasGooglePermission) {
      const fetchData = async () => {
        const data = await getCalendars();
        return data;
      };
      fetchData().then((calendars) => {
        calendars.forEach((element) => {
          setAvailableGoogleCalendars(calendars);
        });
      })
        .catch((curError) => {
          console.log(`There has been a problem with login: ${curError.message}`);
        });
    }
  }, [hasGooglePermission]);

  async function submitCalendarChange() {
    // const ids = ['BCB1FE69-C5AA-4434-A531-8717FEAD5E78'];
    const jwt = await SInfo.getItem('jwt', {
      sharedPreferencesName: 'dueItPrefs',
      keychainService: 'dueItAppKeychain',
    });

    // change to be a single request
    Array.from(selectedCalendars).forEach((element) => {
      const obj = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Token: jwt,
        },
        body: JSON.stringify(
          {
            ref_id: element,
            cal_type: 0,
          },
        ),
      };
      fetch(`${URL}/add-calendar`, obj).then((res) => {
        console.log('Success', res.status);
      }).catch((curError) => {
        console.log(`There was a problem connecting: ${curError.message}`);
      });
    });
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

  function setGoogleCalendar(id) {
    const newSet = new Set(selectedGoogleCalendars);
    if (newSet.has(id)) {
      newSet.delete(id);
      setSelectedGoogleCalendars(newSet);
    } else {
      newSet.add(id);
      setSelectedGoogleCalendars(newSet);
    }
  }

  async function getCalendars() {
    setError('');
    const jwt = await SInfo.getItem('jwt', {
      sharedPreferencesName: 'dueItPrefs',
      keychainService: 'dueItAppKeychain',
    });
    cals = await fetch(`${URL}/getcalendarlist`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Token: jwt,
      },
    }).then((res) => res.json())
      .then((data) => {
        if (!('calendars' in data)) {
          setError('Sorry, there was a response issue with calendars. Please try again.');
        }
        return data.calendars;
      }).catch((curError) => {
        setError(`There has been a problem with login: ${curError.message}`);
      });
    return cals;
  }

  async function getGoogleEvents(calID) {
    setError('');
    const jwt = await SInfo.getItem('jwt', {
      sharedPreferencesName: 'dueItPrefs',
      keychainService: 'dueItAppKeychain',
    });
    cals = await fetch(`${URL}/getrecentevents`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Token: jwt,
        CalID: calID,
      },
    }).then((res) => res.json())
      .then((data) => {
        if (!('events' in data)) {
          setError('Sorry, there was a response issue with google events. Please try again.');
        }
        return data.events;
      }).catch((curError) => {
        setError(`There has been a problem with login: ${curError.message}`);
      });
    return events;
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
                    style={{ width: 150, marginLeft: 70 }}
                    onValueChange={(itemValue, itemIndex) => setSelectedWorkDays(itemValue)}
                  >
                    <Picker.Item label="Weekdays" value="Weekdays" />
                    <Picker.Item label="All Days" value="All Days" />
                  </Picker>
                </View>

                <View style={styles.calendarItemLast}>

                  <DatePicker style={styles.datePickerStyle} date={workStart} onDateChange={setWorkStart} mode="time" />

                  <Text style={styles.text}>-</Text>

                  <DatePicker style={styles.datePickerStyle} date={workEnd} onDateChange={setWorkEnd} mode="time" />
                </View>
              </DropShadow>
            </View>

            <Text style={styles.title}>Calendars: </Text>
            {/* Calendars from iCal */}
            <View style={styles.calendarItemContainer}>
              <Pressable>
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
            <Pressable onPress={() => signOut()}>
              <Text style={styles.exitButton}>Logout</Text>
            </Pressable>
          </DropShadow>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
