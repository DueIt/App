import React, { useEffect } from 'react';
import {
  Text, View, SafeAreaView, ScrollView,
} from 'react-native';
import { styles } from '../styles/todoStyle';

export default function Todo({ navigation }) {
  useEffect(() => {

  }, []);

  return (
    <SafeAreaView style={styles.scroll}>
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          <Text>TODO SCREEN</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
