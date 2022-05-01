import React, { useEffect, useState, useRef, setState } from 'react';
import {
  Text, View, SafeAreaView, ScrollView, Pressable, TextInput, forceUpdate
} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleCheck, faGear, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { styles } from '../styles/todoStyle';
import { createStackNavigator, StackView } from '@react-navigation/stack';
import SInfo from 'react-native-sensitive-info';
import { BlurView } from '@react-native-community/blur';
import ConfettiCannon from 'react-native-confetti-cannon';

import { URL } from '../setup';
import { AuthContext } from '../App';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import FadeInOut from 'react-native-fade-in-out';
import update from 'react-addons-update';


export default function Todo({ navigation }) {
  //This listener reloads the api call for getTasks when the todo screen is opened so that the list is up to date
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getTasks();
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);


  const [todos, setTodos] = useState([]);
  const [todosLength, setTodoLength] = useState(0);
  const [selectedTodos, setSelectedTodos] = useState(new Set());
  const changeAccomplishSetting = () => setAccomplished(previousState => !previousState);
  const [accomplished, setAccomplished] = useState(false);
  const [error, setError] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [timeDone, setTimeDone] = useState("0");
  const [todoLocations, setTodoLocations] = useState([]);

  const scrollViewRef = useRef();
  const [visible, setVisible] = useState(Array(todos.length).fill(true))
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false
  };

  const toggleVisible = (index) => {
    newState = Array(todosLength).fill(true);
    newState[index] = false;
    setVisible(newState)
  }

  const { signOut } = React.useContext(AuthContext);

  function explodeConfetti() {
    this.explosion && this.explosion.start();
  }


  function closeTodo() {
    setSelectedIndex(-1);
  }

  async function getJWT() {
    const jwt = await SInfo.getItem('jwt', {
      sharedPreferencesName: 'dueItPrefs',
      keychainService: 'dueItAppKeychain',
    });
    return jwt;
  }

  function errorMessage(statusCode) {
      if (statusCode === 401) {
        setError('Invalid auth token.');
        console.log(error);
      } else if (statusCode === 500) {
        setError('Sorry, there was a server error. Please try again.');
        console.log(error);
      } else if (statusCode !== 200) {
        setError('Something went wrong.');
        console.log(error);
      }
  }

  const getTasks = async () => {
    const jwt = await getJWT();
    var obj = {
      method: 'GET',
      headers: {
        'Token': jwt
      }
    }
    try {
      const response = await fetch(`${URL}/get-tasks`, obj);
      errorMessage(response.status);
      const json = await response.json();
      setTodos(json.tasks);
      setTodoLength(todos.length+50);
      setVisible(Array(todosLength).fill(true));
    } catch (curError) {
      console.log(curError.message);
    }
  }

  useEffect(() => {
    getTasks();
  }, []);

  async function updateRemainingTime(task_id, time) {
    const jwt = await getJWT();
    if (time < 0) {
      time = 0
    }
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
      errorMessage(res.status);
    }).catch((curError) => {
      console.log(`There was a problem updating the time: ${curError.message}`);
    });
  }

  async function removeTask(taskID) {
    const jwt = await getJWT();
    var obj = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Token': jwt
      }
    }
    fetch(`${URL}/remove-tasks/${taskID}`, obj).then((res) => {
      errorMessage(res.status);
    }).catch((curError) => {
      console.log(`There was a problem removing the task: ${curError.message}`);
    });
  }

  function removeTaskPress(taskID) {
    setTodos(todos => todos.filter((item,i) => i != selectedIndex));
    setSelectedIndex(-1);
    removeTask(taskID);
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


  function selectTodo(index, id, total_time) {
    const newSet = new Set(selectedTodos);
    // if (newSet.has(id)) {
    //   updateRemainingTime(id, total_time);
    //   newSet.delete(id);
    //   setSelectedTodos(newSet);
    // } else {
      updateRemainingTime(id, 0);
      newSet.add(id);
      setSelectedTodos(newSet);
      explodeConfetti();
      ReactNativeHapticFeedback.trigger("impactLight", options);
      toggleVisible(index);
      setTimeout(() => {
        remainingTimeZero(index);
        }, 3000);
    // }
  }

  function remainingTimeZero(index){
    todos[index].remaining_time = 0;
    getTasks();
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
      //scrollHandler();
    }
  }

  function updateTimePress(task_id, remaining_time){
    updateRemainingTime(task_id, remaining_time);
    ReactNativeHapticFeedback.trigger("impactLight", options);
    setSelectedIndex(-1)
    todos[selectedIndex].remaining_time = remaining_time;
  }

  function scrollHandler() {
    scrollViewRef.current.scrollTo({
      y: 0,
      animated: true,
    });
  }

  function calcStyle() {
    return { top: 9 };
  }

  function completedNavigate() {
    navigation.navigate("CompletedNav");
  }

  function getVisibleVal(i) {
    if (visible == []) {
      return true
    } else if (visible.length < (i + 1)){
      return true
    } else {
      return visible[i]
    }
  }

  function addTodoLocation(index, y) {
    newArray = todoLocations;
    newArray[index] = y;
    setTodoLocations(newArray)
  }

  return (
    <SafeAreaView style={styles.dropDown}>
        <View style={[styles.row, styles.shadow2]}>
          <Pressable onPress={() => completedNavigate()}>
            <FontAwesomeIcon icon={faCheckSquare} style={styles.settings} size={24} />
          </Pressable>
          <Text style={styles.title}>{accomplished == false ? "To-Do's" : "Completed"}</Text>
          <Pressable onPress={settingsNavigate}>
            <FontAwesomeIcon icon={faGear} style={styles.settings} size={24} />
          </Pressable>
        </View>
        <ScrollView style={[styles.scroll]} contentContainerStyle={{
     growflex: 1
  }} 
  ref = {scrollViewRef}
        scrollEnabled={true}
        
      >
        <View style={[{height: 10}]}>
</View>
        <View style={styles.container}>
          {todos.map((todo, i) => (
            todo.remaining_time !== 0?
            <View onLayout={({nativeEvent})=> {
              addTodoLocation(i, nativeEvent.layout.y)}
            } >
            <FadeInOut visible={getVisibleVal(i)}>

            <Pressable onPress={() => {todoPress(i, 9)}}>
              <DropShadow style={[styles.shadow, styles.todoItem]}>
                <Pressable onPress={() => {selectTodo(i, todo.task_id, todo.remaining_time)}} style={styles.todoPressWrapper}>
                  {
                    selectedTodos.has(todo.task_id)
                      ? <FontAwesomeIcon icon={faCircleCheck} style={styles.checkImage} size={23} />
                      : <View style={styles.uncheckedCircle} />
                  }
                </Pressable>
                <Text style={styles.todoItemTitle}>{todo.title}</Text>
                <View style={styles.todoInfoWrapper}>
                  <Text style={styles.todoTimeText}>{timeFromMin(todo.remaining_time)}</Text>
                  <Text style={styles.todoDueText}>{`Due ${dateFromString(todo.due_date)}`}</Text>
                </View>
              </DropShadow>
            </Pressable>
            </FadeInOut>
            </View>
            : null
          ))}
          <View style={[{height: 300}]}>
          </View>
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
              <View style={[styles.absolute, {top: todoLocations[selectedIndex]}]}>
                
              <Pressable onPress={() => todoPress(selectedIndex, 9)}>
                <DropShadow style={[styles.shadow, styles.todoItemPopup]}>
                  <Pressable onPress={() => {selectTodo(selectedIndex, todos[selectedIndex].task_id, todos[selectedIndex].total_time)}} style={styles.todoPressWrapper}>
                    {
                      selectedTodos.has(todos[selectedIndex].task_id)
                        ? <FontAwesomeIcon icon={faCircleCheck} style={styles.checkImage} size={23} />
                        : <View style={styles.uncheckedCircle} />
                    }
                  </Pressable>
                  <Text style={styles.todoItemTitle}>{todos[selectedIndex].title}</Text>
                  <View style={styles.todoInfoWrapper}>
                    <Text style={styles.todoTimeText}>{timeFromMin(todos[selectedIndex].remaining_time)}</Text>
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
                    onPress={() => updateTimePress(todos[selectedIndex].task_id, todos[selectedIndex].remaining_time - timeDone)}
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
                <Pressable onPress={() => removeTaskPress(todos[selectedIndex].task_id)}>
                  <Text style={styles.exitButton}>Delete Item</Text>
                </Pressable>
              </DropShadow>
              </View> 
            )}
        </View> 
      </ScrollView>
      <ConfettiCannon
        count={200}
        origin={{x: 0, y: 0}}
        autoStart={false}
        ref={ref => (this.explosion = ref)}
      />
    </SafeAreaView>
  );
}
