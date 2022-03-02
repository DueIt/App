import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scroll: {
    overflow: 'visible',
  },

  container: {
    marginHorizontal: 25,
    position: 'relative',
  },

  pressed: {
    opacity: 0.8,
  },

  disabled: {
    opacity: 0.5,
  },

  title: {
    marginBottom: 30,
    marginTop: 20,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },

  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.07,
    shadowRadius: 5,
  },

  todoItem: {
    borderRadius: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    marginBottom: 20,
  },

  todoItemTitle: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
  },

  todoInfoWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  todoTimeText: {
    fontSize: 16,
    fontWeight: '500',
  },

  todoDueText: {
    fontSize: 14,
    fontWeight: '400',
  },

  checkImage: {
    marginRight: 15,
    color: '#39A4FF',
  },
  uncheckedCircle: {
    width: 23,
    height: 23,
    borderColor: '#39A4FF',
    borderWidth: 2,
    borderRadius: 20,
    marginRight: 15,
  },
});

// eslint-disable-next-line import/prefer-default-export
export { styles };
