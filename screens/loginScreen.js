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
import { URL } from '../setup';
import { AuthContext } from '../App';

export default function Login({ navigation }) {
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [error, setError] = useState('');

  const { signIn } = React.useContext(AuthContext);

  function login() {
    if (!validateEmail(email)) {
      setError('Invalid email.');
    } else {
      setError('');
      fetch(`${URL}/sign-in`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            'email' : email,
            'password' : password
          }
        )
      }).then((res) => {
        if (res.status === 401) {
          setError('Invalid login credentials.');
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

  const validateEmail = (curEmail) => String(curEmail)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

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
            email.length == 0 || password.length == 0 ? styles.disabled : null]}
          onPress={login}
          disabled={email.length == 0 || password.length == 0}
        >
          <Text style={styles.loginButtonText}>Sign In</Text>
        </Pressable>
        <View style={styles.signUpButton}>
          <Pressable style={({ pressed }) => [pressed ? styles.pressed : null]} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signUpButtonText}>Don't have an account? Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
