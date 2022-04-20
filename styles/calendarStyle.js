import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scroll: {
    overflow: 'hidden',
  },

  title: {
    marginBottom: 30,
    marginTop: 20,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },

  pressedButton: {
    backgroundColor: '#39A4FF',
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
  },

  notPressedButton: {
    //backgroundColor: 'white',
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    marginHorizontal: 30,
    marginTop: 10,
  },
  daysOfWeek: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    marginHorizontal: 30,
    marginTop: 10,
    marginBottom: 20,
  },

  container: {
    paddingHorizontal: 15,
    position: 'relative',
  },

  timeSlot: {
    height: 50,
    flexDirection: 'row',
  },

  exitButton: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FF0000',
    textAlign: 'center',
    padding: 7,
  },

  timeText: {
    color: '#C7C7C7',
    fontSize: 15,
  },

  timeLine: {
    marginTop: 9,
    marginBottom: 7,
    marginLeft: 10,
    marginRight: 20,
    backgroundColor: '#E5E5E5',
    flex: 1,
    height: 1,
  },

  pressed: {
    opacity: 0.8,
  },

  disabled: {
    opacity: 0.5,
  },

  eventItem: {
    width: '70%',
    backgroundColor: '#EAEAEA',
    borderRadius: 15,
    marginLeft: 63,
    position: 'absolute',
  },

  eventTitle: {
    color: 'black',
    fontWeight: '600',
    marginLeft: 10,
    marginTop: 7,
  },

  eventSubtitle: {
    color: 'black',
    marginLeft: 10,
  },

  todoItem: {
    width: '70%',
    backgroundColor: '#58A5FF',
    borderRadius: 15,
    marginLeft: 63,
    position: 'absolute',
  },

  todoTitle: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 10,
    marginTop: 7,
  },

  todoSubtitle: {
    color: 'white',
    marginLeft: 10,
  },

  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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

  todoPopup: {
    width: '70%',
    backgroundColor: 'white',
    position: 'absolute',
    marginLeft: 63,
    borderRadius: 15,
    padding: 7,
  },

  completeButton: {
    backgroundColor: '#44D97E',
    marginRight: 3,
  },

  delayButton: {
    backgroundColor: '#58A5FF',
    marginLeft: 3,
  },

  popupButton: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    flex: 1,
    borderRadius: 15,
  },

  popupButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },

  popupButtonWrapper: {
    flexDirection: 'row',
  },

  popupTimeLabel: {
    color: '#808080',
    fontSize: 16,
  },

  popupTimeWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 5,
  },

  timeInputWrapper: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    width: 50,
  },

  timeInput: {
    paddingHorizontal: 5,
    textAlign: 'center',
    flex: 1,
    flexWrap: 'wrap',
  },
});

// eslint-disable-next-line import/prefer-default-export
export { styles };
