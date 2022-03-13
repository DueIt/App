import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    margin: 20,
  },

  logo: {
    marginTop: 10,
    marginBottom: 10,
    resizeMode: 'contain',
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  logoText: {
    fontSize: 50,
    alignSelf: 'center',
  },

  pressed: {
    opacity: 0.8,
  },

  disabled: {
    opacity: 0.5,
  },

  input: {
    height: 50,
    borderRadius: 20,
    paddingHorizontal: 20,
    borderColor: '#707070',
    borderWidth: 1,
    marginVertical: 10,
    color: 'black',
  },

  inputWrapper: {
    flex: 1,
    marginHorizontal: 30,
    justifyContent: 'center',
  },

  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    width: 140,
    backgroundColor: '#39A4FF',
    padding: 10,
  },

  loginButtonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },

  buttonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  signUpButton: {
    marginVertical: 25,
  },

  signUpButtonText: {
    fontSize: 15,
    color: '#0A97FF',
  },

  error: {
    color: 'red',
    fontSize: 15,
    marginVertical: 15,
    textAlign: 'center',
  },
});

// eslint-disable-next-line import/prefer-default-export
export { styles };
