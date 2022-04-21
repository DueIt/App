import React, { useEffect, useState } from 'react';
import {
  Text, View, SafeAreaView, ScrollView, Pressable, TextInput
} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleCheck, faGear, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { styles } from '../styles/completedStyle';
import { createStackNavigator, StackView } from '@react-navigation/stack';
import SInfo from 'react-native-sensitive-info';
import { BlurView } from '@react-native-community/blur';

import { URL } from '../setup';
import { AuthContext } from '../App';

export default function Completed({ navigation }) {
  //This listener reloads the api call for getTasks when the completed screen is opened so that the list is up to date
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getTasks()
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);


  const [completeds, setcompleteds] = useState([]);
  const [selectedcompleteds, setSelectedcompleteds] = useState(new Set());
  const changeAccomplishSetting = () => setAccomplished(previousState => !previousState);
  const [accomplished, setAccomplished] = useState(false);
  const [error, setError] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [timeDone, setTimeDone] = useState("0");
  const [ref, setRef] = useState(null);


  const { signOut } = React.useContext(AuthContext);


  function closecompleted() {
    setSelectedIndex(-1);
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
      setcompleteds(json.tasks);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTasks();
  }, []);

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

  function dateFromString(date) {
    const fDate = new Date(date);
    return `${fDate.getMonth()}/${fDate.getDay()}`;
  }

  function timeFromMin(time) {
    if (time >= 60) {
      const mins = time % 60;
      const hours = parseInt(time / 60);
      return `${hours} h ${mins} m`;
    }
    return `${time} m`;
  }

  function selectcompleted(id, total_time) {
    const newSet = new Set(selectedcompleteds);
    if (newSet.has(id)) {
      updateRemainingTime(id, total_time);
      newSet.delete(id);
      setSelectedcompleteds(newSet);
    } else {
      updateRemainingTime(id, 0);
      newSet.add(id);
      setSelectedcompleteds(newSet);
    }
  }

  function settingsNavigate() {
    navigation.navigate("Settings");
  }

  function completedPress(index, offset) {
    if (selectedIndex === index) {
      setSelectedIndex(-1);
    } else {
      // const event = completeds[index];
      // const min = (Date.parse(event.end) - Date.parse(event.start)) / 1000 / 60;
      // setTimeDone(min.toString());
      setSelectedIndex(index);
      scrollHandler(9);
    }
  }

  function scrollHandler(offset) {
    ref.scrollTo({
      x: 0,
      y: offset,
      animated: true,
    });
  }

  function calcStyle() {
    return { top: 9 };
  }

  function todoNavigate() {
    navigation.navigate("Todo");
  }

  return (
    <SafeAreaView style={styles.scroll}>
      <ScrollView style={styles.scroll} ref={(ref) => {
        setRef(ref);}}
        scrollEnabled={selectedIndex === -1}
      >
        <View style={styles.row}>
          <Pressable onPress={() => todoNavigate()}>
            <FontAwesomeIcon icon={faCheckSquare} style={styles.checkImage} size={24} />
          </Pressable>
          <Text style={styles.title}>Completed</Text>
          <Pressable onPress={settingsNavigate}>
            <FontAwesomeIcon icon={faGear} style={styles.settings} size={24} />
          </Pressable>
        </View>
        <View style={styles.container}>
          {completeds.map((completed, i) => (
            completed.total_time == 0?
            <Pressable onPress={() => completedPress(i, 9)}>
              <DropShadow style={[styles.shadow, styles.completedItem]}>
                <Pressable onPress={() => selectcompleted(completed.task_id, completed.total_time)} style={styles.completedPressWrapper}>
                  {
                    selectedcompleteds.has(completed.task_id)
                      ? <FontAwesomeIcon icon={faCircleCheck} style={styles.checkImage} size={23} />
                      : <View style={styles.uncheckedCircle} />
                  }
                </Pressable>
                <Text style={styles.completedItemTitle}>{completed.title}</Text>
                <View style={styles.completedInfoWrapper}>
                  <Text style={styles.completedTimeText}>{timeFromMin(completed.total_time)}</Text>
                  <Text style={styles.completedDueText}>{`Due ${dateFromString(completed.due_date)}`}</Text>
                </View>
              </DropShadow>
            </Pressable>
            : null
          ))}
          {selectedIndex !== -1
            && (
              <Pressable
                style={[styles.blur]}
                onPress={() => closecompleted()}
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
                
              <Pressable onPress={() => completedPress(selectedIndex, 9)}>
                <DropShadow style={[styles.shadow, styles.completedItemPopup]}>
                  <Pressable onPress={() => selectcompleted(completeds[selectedIndex].task_id, completeds[selectedIndex].total_time)} style={styles.completedPressWrapper}>
                    {
                      selectedcompleteds.has(completeds[selectedIndex].task_id)
                        ? <FontAwesomeIcon icon={faCircleCheck} style={styles.checkImage} size={23} />
                        : <View style={styles.uncheckedCircle} />
                    }
                  </Pressable>
                  <Text style={styles.completedItemTitle}>{completeds[selectedIndex].title}</Text>
                  <View style={styles.completedInfoWrapper}>
                    <Text style={styles.completedTimeText}>{timeFromMin(completeds[selectedIndex].total_time)}</Text>
                    <Text style={styles.completedDueText}>{`Due ${dateFromString(completeds[selectedIndex].due_date)}`}</Text>
                  </View>
                </DropShadow>
              </Pressable>
              <DropShadow style={[styles.shadow, styles.completedPopup, calcStyle()]}>
                <View style={styles.popupButtonWrapper}>
                  <Pressable
                    style={({ pressed }) => [styles.popupButton,
                    styles.completeButton,
                    pressed ? styles.pressed : null]}
                    onPress={() => null}
                  >
                    <Text style={[styles.popupButtonText]}>Update Time</Text>
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
              </View>
            
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
