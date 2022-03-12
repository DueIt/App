import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Pressable,
  SafeAreaView,
  TextInput,
} from 'react-native';

import SInfo from 'react-native-sensitive-info';
import { styles } from '../styles/authStyle';
import { AuthContext } from '../App';

import { URL } from '../setup';

export default function Signup({ navigation }) {
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [password2, onChangePassword2] = useState('');
  const [error, setError] = useState('');

  const { signIn } = React.useContext(AuthContext);

  const validateEmail = (curEmail) => String(curEmail)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

  function signUp() {
    if (!validateEmail(email)) {
      setError('Invalid email.');
    } else if (password !== password2) {
      setError('Passwords do not match.');
    } else {
      setError('');
      fetch(`${URL}/sign-up`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            email,
            password,
          },
        ),
      }).then((res) => {
        if (res.status === 401) {
          setError('This user already exists.');
        } else if (res.status === 500) {
          setError('Sorry, there was a server error. Please try again.');
        } else if (res.status !== 200) {
          setError('Something went wrong.');
        } else {
          res.json()
            .then(async (data) => {
              if (!('jwt' in data)) {
                setError('Sorry, there was a response issue. Please try again.');
              } else {
                const { jwt } = data;
                const savingJWT = await SInfo.setItem('jwt', jwt, {
                  sharedPreferencesName: 'dueItPrefs',
                  keychainService: 'dueItAppKeychain',
                });
                signIn({ token: jwt });
              }
            })
            .catch((curError) => {
              setError(`There has been a problem with login: ${curError.message}`);
            });
        }
      }).catch((curError) => {
        setError(`There was a problem connecting: ${curError.message}`);
      });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>DueIt</Text>
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
          placeholder="Email"
          placeholderTextColor="#707070"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          secureTextEntry
          onChangeText={onChangePassword}
          value={password}
          placeholder="Password"
          placeholderTextColor="#707070"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          secureTextEntry
          onChangeText={onChangePassword2}
          value={password2}
          placeholder="Re-Enter Password"
          placeholderTextColor="#707070"
          autoCapitalize="none"
          autoCorrect={false}
        />
        { error.length > 0
          && (
            <Text style={styles.error}>
              {error}
            </Text>
          )}
      </View>
      <View style={styles.buttonWrapper}>
        <Pressable
          style={({ pressed }) => [styles.loginButton,
            pressed ? styles.pressed : null,
            email.length == 0 || password.length == 0 || password2.length == 0 ? styles.disabled : null]}
          onPress={signUp}
          disabled={email.length === 0 || password.length === 0 || password2.length === 0}
        >
          <Text style={styles.loginButtonText}>Sign Up</Text>
        </Pressable>
        <View style={styles.signUpButton}>
          <Pressable style={({ pressed }) => [pressed ? styles.pressed : null]} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signUpButtonText}>Already have an account? Sign In</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
