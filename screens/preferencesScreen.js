import React, { useEffect, useState } from 'react';
import {
  Text, View, Alert, SafeAreaView, TouchableOpacity, ScrollView, Pressable,
} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { styles } from '../styles/preferencesStyle';

export default function Preferences({ navigation }) {
  const [hasCalPermission, setHasCalPermission] = useState(false);
  const [availableCalendars, setAvailableCalendars] = useState([]);
  const [selectedCalendars, setSelectedCalendars] = useState(new Set());

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
          navigation.navigate('Calendar');
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

  return (
    <SafeAreaView style={styles.scroll}>
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          <Text style={styles.title}>Chose your Calendars: </Text>
          <View style={styles.calendarItemContainer}>
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
