import React, { useEffect, useState } from 'react';
import {
  Text, View, SafeAreaView, ScrollView, Pressable,
} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleCheck, faGear, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { styles } from '../styles/todoStyle';
import { createStackNavigator } from '@react-navigation/stack';
import SInfo from 'react-native-sensitive-info';

import { URL } from '../setup';
import { AuthContext } from '../App';

export default function Todo({ navigation }) {
  const [todos, setTodos] = useState([]);
  const [selectedTodos, setSelectedTodos] = useState(new Set());
  const changeAccomplishSetting = () => setAccomplished(previousState => !previousState);
  const [accomplished, setAccomplished] = useState(false);
  const [error, setError] = useState('');
 

  const { signOut } = React.useContext(AuthContext);

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
  },[]);

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
              'remaining_time' : time
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

  return (
    <SafeAreaView style={styles.scroll}>
      <ScrollView style={styles.scroll}>
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
          {todos.map((todo) => (
            <DropShadow style={[styles.shadow, styles.todoItem]}>
              { /* TODO: add a pressable here for editing the todo */ }
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
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
