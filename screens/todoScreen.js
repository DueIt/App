import React, { useEffect, useState } from 'react';
import {
  Text, View, SafeAreaView, ScrollView, Pressable, TextInput
} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleCheck, faGear, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { styles } from '../styles/todoStyle';
import { createStackNavigator, StackView } from '@react-navigation/stack';
import SInfo from 'react-native-sensitive-info';
import { BlurView } from '@react-native-community/blur';

import { URL } from '../setup';
import { AuthContext } from '../App';

export default function Todo({ navigation }) {
  //This listener reloads the api call for getTasks when the todo screen is opened so that the list is up to date
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getTasks()
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);


  const [todos, setTodos] = useState([]);
  const [selectedTodos, setSelectedTodos] = useState(new Set());
  const changeAccomplishSetting = () => setAccomplished(previousState => !previousState);
  const [accomplished, setAccomplished] = useState(false);
  const [error, setError] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [timeDone, setTimeDone] = useState("0");
  const [ref, setRef] = useState(null);


  const { signOut } = React.useContext(AuthContext);


  function closeTodo() {
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
      setTodos(json.tasks);
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

  function selectTodo(id, total_time) {
    const newSet = new Set(selectedTodos);
    if (newSet.has(id)) {
      updateRemainingTime(id, total_time);
      newSet.delete(id);
      setSelectedTodos(newSet);
    } else {
      updateRemainingTime(id, 0);
      newSet.add(id);
      setSelectedTodos(newSet);
    }
  }

  function settingsNavigate() {
    navigation.navigate("Settings");
  }

  function todoPress(index, offset) {
    if (selectedIndex === index) {
      setSelectedIndex(-1);
    } else {
      // const event = todos[index];
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

  return (
    <SafeAreaView style={styles.scroll}>
      <ScrollView style={styles.scroll} ref={(ref) => {
        setRef(ref);}}
        scrollEnabled={selectedIndex === -1}
      >
        <View style={styles.row}>
          <Pressable onPress={() => changeAccomplishSetting()}>
            <FontAwesomeIcon icon={faCheckSquare} style={accomplished == false ? styles.settings : styles.checkImage} size={24} />
          </Pressable>
          <Text style={styles.title}>{accomplished == false ? "To-Do's" : "Completed"}</Text>
          <Pressable onPress={settingsNavigate}>
            <FontAwesomeIcon icon={faGear} style={styles.settings} size={24} />
          </Pressable>
        </View>
        <View style={styles.container}>
          {todos.map((todo, i) => (
            <Pressable onPress={() => todoPress(i, 9)}>
              <DropShadow style={[styles.shadow, styles.todoItem]}>
                <Pressable onPress={() => selectTodo(todo.task_id, todo.total_time)} style={styles.todoPressWrapper}>
                  {
                    selectedTodos.has(todo.task_id)
                      ? <FontAwesomeIcon icon={faCircleCheck} style={styles.checkImage} size={23} />
                      : <View style={styles.uncheckedCircle} />
                  }
                </Pressable>
                <Text style={styles.todoItemTitle}>{todo.title}</Text>
                <View style={styles.todoInfoWrapper}>
                  <Text style={styles.todoTimeText}>{timeFromMin(todo.total_time)}</Text>
                  <Text style={styles.todoDueText}>{`Due ${dateFromString(todo.due_date)}`}</Text>
                </View>
              </DropShadow>
            </Pressable>
          ))}
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
                
              <Pressable onPress={() => todoPress(selectedIndex, 9)}>
                <DropShadow style={[styles.shadow, styles.todoItemPopup]}>
                  <Pressable onPress={() => selectTodo(todos[selectedIndex].task_id, todos[selectedIndex].total_time)} style={styles.todoPressWrapper}>
                    {
                      selectedTodos.has(todos[selectedIndex].task_id)
                        ? <FontAwesomeIcon icon={faCircleCheck} style={styles.checkImage} size={23} />
                        : <View style={styles.uncheckedCircle} />
                    }
                  </Pressable>
                  <Text style={styles.todoItemTitle}>{todos[selectedIndex].title}</Text>
                  <View style={styles.todoInfoWrapper}>
                    <Text style={styles.todoTimeText}>{timeFromMin(todos[selectedIndex].total_time)}</Text>
                    <Text style={styles.todoDueText}>{`Due ${dateFromString(todos[selectedIndex].due_date)}`}</Text>
                  </View>
                </DropShadow>
              </Pressable>
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
