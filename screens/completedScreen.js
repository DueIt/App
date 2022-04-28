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
            setcompleteds(json.tasks);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getTasks();
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

    return (
        <SafeAreaView style={[styles.scroll,{backgroundColor: 'white'}]}>
            <ScrollView style={styles.scroll} >
                <View style={[{height: 15}]}></View>
                <View style={styles.container}>
                    {completeds.map((completed, i) => (
                        completed.remaining_time == 0 ?
                            <Pressable>
                                <DropShadow style={[styles.shadow, styles.completedItem]}>
                                    <Pressable>
                                        {   <View style={styles.checkedCircle} />}
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
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
