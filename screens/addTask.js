import React, { useEffect, useState } from 'react';
import {
    Text, View, SafeAreaView, ScrollView, Pressable, TextInput, Form, Picker, Button, Switch
} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { styles } from '../styles/addTaskStyle';
import DatePicker from 'react-native-date-picker';

export default function AddTask({ navigation }) {
    const [selectedHours, setSelectedHours] = useState("0");
    const [selectedMins, setSelectedMins] = useState("30");
    const hours = ["0", "1", "2", "3", "4", "5"];
    const mins = Array.from(Array(60).keys()).map(String);
    const [date, setEndDate] = useState(new Date());
    const [title, onChangeTitle] = React.useState("New Item");
    const [location, onChangeLocation] = React.useState("");
    const [chunk, setChunking] = useState(false);
    const toggleChunking = () => setChunking(previousState => !previousState);
    const [importance, setImportance] = useState();
    const [difficulty, setDifficulty] = useState();
    const [category, setCategory] = useState();


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

    function selectHours(value) {
        const newValue = value;
        setSelectedHours(newValue);
    }
    function selectMins(value) {
        const newValue = value;
        setSelectedMins(newValue);
    }


    return (
        <SafeAreaView style={styles.scroll}>
            <ScrollView style={styles.scroll}>
                <View style={styles.card}>
                    <DropShadow style={[styles.shadow, styles.newItemCard]}>
                        <ScrollView style={styles.scroll}>
                            <Text style={styles.title}>{title}</Text>
                            <View style={styles.container}>
                                <DropShadow style={[styles.shadow, styles.newItemInput]}>
                                    <TextInput
                                        style={styles.largerText}
                                        onChangeText={onChangeTitle}
                                        placeholder="Title"
                                        keyboardType="ascii-capable"
                                    />
                                </DropShadow>
                            </View>
                            <View style={styles.container}>
                                <DropShadow style={[styles.shadow, styles.layerContainer]}>
                                    <Text style={styles.text}>
                                        Estimated Time:
                                    </Text>
                                    <Picker
                                        selectedValue={selectedHours}
                                        style={styles.timePicker}
                                        onValueChange={(itemValue, itemIndex) => selectHours(itemValue)}
                                    >
                                        {hours.map((hour) => (
                                            <Picker.Item style={styles.pickerItem} label={hour} value={hour} />

                                        ))}
                                    </Picker>
                                    <Text style={styles.lightText}>
                                        hrs
                                    </Text>
                                    <Picker
                                        selectedValue={selectedMins}
                                        style={styles.timePicker}
                                        onValueChange={(itemValue, itemIndex) => selectMins(itemValue)}
                                    >
                                        {mins.map((min) => (
                                            <Picker.Item tyle={styles.pickerItem} label={min} value={min} />

                                        ))}
                                    </Picker>
                                    <Text style={styles.lightText}>
                                        mins
                                    </Text>
                                </DropShadow>
                            </View>
                            <View style={styles.container}>
                                <DropShadow style={[styles.shadow, styles.dateTimeInput]}>
                                    <Text style={styles.text}>
                                        End Date:
                                    </Text>
                                    <DatePicker style={styles.datePickerStyle} date={date} onDateChange={setEndDate} />
                                </DropShadow>
                            </View>
                            <View style={styles.container}>
                                <DropShadow style={[styles.shadow, styles.newItemContainer]}>
                                    <View style={styles.row}>
                                        <Text style={styles.toggleText}>
                                            Break Task into Chunks:
                                        </Text>
                                        <Switch
                                            style={styles.toggleStyle}
                                            trackColor={{ false: "#767577", true: "#39A1FF" }}
                                            thumbColor={chunk ? "#f4f3f4" : "#f4f3f4"}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={toggleChunking}
                                            value={chunk}
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.toggleText2}>
                                            Importance:
                                        </Text>
                                        <Pressable style={importance=="Low" ? styles.pressedButton: styles.notPressedButton}
                                        onPress={() => setImportance('Low')} >
                                            <Text>Low</Text>
                                        </Pressable>
                                        <Pressable style={importance=="Med" ? styles.pressedButton: styles.notPressedButton}
                                        onPress={() => setImportance('Med')}>
                                            <Text>Med</Text>
                                        </Pressable>
                                        <Pressable style={importance=="High" ? styles.pressedButton: styles.notPressedButton}
                                        onPress={() => setImportance('High')}>
                                            <Text>High</Text>
                                        </Pressable>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.toggleText3}>
                                            Difficulty:
                                        </Text>
                                        <Pressable style={difficulty=="Low" ? styles.pressedButton: styles.notPressedButton}
                                        onPress={() => setDifficulty('Low')} >
                                            <Text>Low</Text>
                                        </Pressable>
                                        <Pressable style={difficulty=="Med" ? styles.pressedButton: styles.notPressedButton}
                                        onPress={() => setDifficulty('Med')}>
                                            <Text>Med</Text>
                                        </Pressable>
                                        <Pressable style={difficulty=="High" ? styles.pressedButton: styles.notPressedButton}
                                        onPress={() => setDifficulty('High')}>
                                            <Text>High</Text>
                                        </Pressable>
                                    </View>
                                    <View style={styles.lastRow}>
                                        <Text style={styles.toggleText4}>
                                            Category:
                                        </Text>
                                        <Pressable style={category=='Work' ? styles.pressedButton: styles.notPressedButton}
                                        onPress={() => setCategory('Work')} >
                                            <Text>Work</Text>
                                        </Pressable>
                                        <Pressable style={category=='School' ? styles.pressedButton: styles.notPressedButton}
                                        onPress={() => setCategory('School')}>
                                            <Text>School</Text>
                                        </Pressable>
                                    </View>
                                </DropShadow>
                            </View>
                            <View style={styles.container}>
                                <DropShadow style={[styles.shadow, styles.newItemInput]}>
                                    <TextInput
                                        style={styles.text}
                                        onChangeText={onChangeLocation}
                                        placeholder="Location/Url"
                                        keyboardType="ascii-capable"
                                    />
                                </DropShadow>
                            </View>
                            <View style={styles.container}>
                                <DropShadow style={[styles.shadow, styles.doneButtonWrapper]}>
                                <Pressable style={styles.doneButton}>
                                { /* TODO: save to-do for the user */ }
                                            <Text style={styles.text}>Create Item</Text>
                                        </Pressable>
                                </DropShadow>
                            </View>
                            <Pressable>
                            { /* TODO: delete this to-do from user */ }

                                            <Text style={styles.exitButton}>Clear Item</Text>
                                        </Pressable>
                        </ScrollView>
                    </DropShadow>
                </View >
            </ScrollView >
        </SafeAreaView >
    );
}
