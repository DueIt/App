import React, { useEffect, useState } from 'react';
import {
  Text, View, Alert, SafeAreaView, TouchableOpacity, ScrollView, Pressable, Picker,
} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
//import { components } from 'react-select';
import RNCalendarEvents from 'react-native-calendar-events';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
//import { Dropdown } from 'react-native-material-dropdown';
import { styles } from '../styles/preferencesStyle';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

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

  function getToken() {
    const tokens= {};
    const curr = '';
    isSignedIn = async () => {
      const isSignedIn = await GoogleSignin.isSignedIn();
      this.setState({ isLoginScreenPresented: !isSignedIn });
      return isSignedIn
    };
    console.log(isSignedIn)
    getCurrentUser = async () => {
      const currentUser = await GoogleSignin.getCurrentUser();
      this.setState({ currentUser });
      console.log(currentUser.getTokens())
      curr = currentUser;
      tokens = currentUser.getTokens()
    };
    console.log(JSON.stringify(this.currentUser));
    console.log(JSON.stringify(tokens));
  }

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

  var gapi = window.gapi
  /* 
    Update with your own Client Id and Api key 
  */
  var CLIENT_ID = "224295704614-tk6lcdqut4ef8atb8ppq3i38kuili358.apps.googleusercontent.com"
  var API_KEY = "AIzaSyCLKZgpn4ia-lUgWjlgsv_MT9Br2DlhhA8"
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
  var SCOPES = "https://www.googleapis.com/auth/calendar.events"

  const handleClickGoogleCal = () => {
    gapi.load('client:auth2', () => {
      console.log('loaded client')

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })

      gapi.client.load('calendar', 'v3', () => console.log('bam!'))

      gapi.auth2.getAuthInstance().signIn()
      .then(() => {

        request.execute(event => {
          console.log(event)
          window.open(event.htmlLink)
        })
        

        /*
            Uncomment the following block to get events
        */
        // get events
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(response => {
          const events = response.result.items
          console.log('EVENTS: ', events)
        })
    

      })
    })
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
              <Picker.Item label="Length" value="length" />
              <Picker.Item label="Importance" value="importance" />
            </Picker>
            </DropShadow>
          </View>
          
          {/* Calendars from iCal */}
          <View style={styles.calendarItemContainer}>
            <Text style={styles.title}>Choose your Calendars: </Text>
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

            <Pressable
              style={styles.doneButton}
              onPress={() =>  {
                GoogleSignin.configure({
                    iosClientId: '224295704614-tk6lcdqut4ef8atb8ppq3i38kuili358.apps.googleusercontent.com',
                    scope: ['https://www.googleapis.com/auth/calendar.readonly',
                    'https://www.googleapis.com/auth/calendar',
                    'https://www.googleapis.com/auth/calendar.events',
                    'https://www.googleapis.com/auth/calendarlist.readonly'],
                });
            GoogleSignin.hasPlayServices().then((hasPlayService) => {
                    if (hasPlayService) {
                      GoogleSignin.getTokens().then((tokens) => {
                                  console.log(JSON.stringify(tokens['accessToken']))
                                  const accessTokenGoogle = JSON.stringify(tokens['accessToken'])
                                  // getUsersCalendarList = async (accessTokenGoogle) => {
                                  //   let calendarsList = await fetch('https://www.googleapis.com/calenda/v3/users/me/calendarList',
                                  //   {
                                  //     headers:
                                  //     { Authorization: 'Bearer ${accessTokenGoogle}'},
                                  //   });     
                                  //   return calendarsList.json(); 
                                  // }
                                  // console.log(JSON.stringify(getUsersCalendarList))

                                  fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList?key=AIzaSyCLKZgpn4ia-lUgWjlgsv_MT9Br2DlhhA8', {
                                    method: 'GET',
                                    headers: {
                                      Accept: 'application/json',
                                      'Content-Type': 'application/json',
                                      Authorization: `Bearer ${accessTokenGoogle}`,
                                      Scope: ["https://www.googleapis.com/auth/calendar",'https://www.googleapis.com/auth/userinfo.profile'],
                                    },
                                  }).then((res) => {
                                    console.log(res)
                                    if (res.status === 401) {
                                      console.log('Invalid login credentials.');
                                    } else if (res.status === 500) {
                                      console.log('Sorry, there was a server error. Please try again.');
                                    } else if (res.status !== 200) {
                                      console.log(res.status)
                                      console.log(res.headers)
                                      console.log('Something went wrong.');
                                      console.log(res.body)
                                    } else {
                                      res.json()
                                        .then(async (data) => {
                                          console.log(data)
                                        })
                                        .catch((curError) => {
                                          console.log(`There has been a problem with login: ${curError.message}`);
                                        });
                                    }
                                  }).catch((curError) => {
                                    console.log(`There was a problem connecting: ${curError.message}`);
                                  });

                        }).catch((e) => {
                        console.log("ERROR IS: " + JSON.stringify(e));
                        })
                    }
            }).catch((e) => {
                console.log("ERROR IS: " + JSON.stringify(e));
            })
            }}
            >
              <FontAwesomeIcon icon={faCircleCheck} style={styles.checkImage} size={20} />
              <Text style={styles.doneButtonText}>Sign in to Google Calendar</Text>
            </Pressable>
          </View>

          <DropShadow
            style={[styles.shadow, styles.doneButtonWrapper]}
          >
            <Pressable
              style={({ pressed }) => [styles.doneButton, pressed ? styles.pressed : null, (selectedCalendars.size == 0 || selectPriority == null) ? styles.disabled : null]}
              onPress={submitCalendarChange}
              disabled={selectedCalendars.size == 0}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          </DropShadow>
          </DropShadow>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
