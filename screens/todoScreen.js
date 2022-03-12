import React, { useEffect, useState } from 'react';
import {
  Text, View, SafeAreaView, ScrollView, Pressable,
} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleCheck, faGear, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { styles } from '../styles/todoStyle';
import { createStackNavigator } from '@react-navigation/stack';


export default function Todo({ navigation }) {
  const [todos, setTodos] = useState([]);
  const [selectedTodos, setSelectedTodos] = useState(new Set());
  const changeAccomplishSetting = () => setAccomplished(previousState => !previousState);

  const [accomplished, setAccomplished] = useState(false);
 

  useEffect(() => {
    const testTodos = {
      items: [
        {
          title: 'Math Homework',
          time: 30,
          due: '2022-02-25T24:00:00.000Z',
          id: '1',
        },
        {
          title: 'English Homework',
          time: 150,
          due: '2022-02-15T24:00:00.000Z',
          id: '2',
        },
      ],
    };
    setTodos(testTodos.items);
  }, []);

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

  function selectTodo(id) {
    const newSet = new Set(selectedTodos);
    if (newSet.has(id)) {
      newSet.delete(id);
      setSelectedTodos(newSet);
    } else {
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
              <Pressable onPress={() => selectTodo(todo.id)} style={styles.todoPressWrapper}>
                {
                  selectedTodos.has(todo.id)
                    ? <View style={styles.uncheckedCircle} />
                    : <FontAwesomeIcon icon={faCircleCheck} style={styles.checkImage} size={23} />
                }
              </Pressable>
              <Text style={styles.todoItemTitle}>{todo.title}</Text>
              <View style={styles.todoInfoWrapper}>
                <Text style={styles.todoTimeText}>{timeFromMin(todo.time)}</Text>
                <Text style={styles.todoDueText}>{`Due ${dateFromString(todo.due)}`}</Text>
              </View>
            </DropShadow>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
