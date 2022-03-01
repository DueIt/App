import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scroll: {
    overflow: 'visible',
  },

  calendarItemContainer: {
    width: '85%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },

  calendarItem: {
    // backgroundColor: 'blue',
  },

  calendarItemText: {
    flex: 1,
    height: 20,
  },

  calendarItemInner: {
    paddingVertical: 17,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#D6D6D6',
    flexDirection: 'row',
  },

  calendarItemLast: {
    borderBottomWidth: 0,
  },

  container: {
    alignItems: 'center',
  },

  doneButtonWrapper: {
    width: '85%',
    height: 60,
    marginTop: 20,
  },

  doneButton: {
    backgroundColor: '#39A4FF',
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
  },

  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  title: {
    marginBottom: 30,
    marginTop: 20,
    fontSize: 24,
    fontWeight: '600',
  },

  checkImage: {
    color: '#39A4FF',
  },

  pressed: {
    opacity: 0.8,
  },

  disabled: {
    opacity: 0.5,
  },
});

// eslint-disable-next-line import/prefer-default-export
export { styles };
