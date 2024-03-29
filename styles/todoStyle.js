import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scroll: {
    overflow: 'hidden',
    height: '100%',
    //position: 'absolute'
    //flex: 1
  },
  dropDown: {
    overflow: 'hidden',
    //flex: 1
  },

  container: {
    marginHorizontal: 25,
    position: 'relative',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    //padding: 16,
    marginHorizontal: 30,
    marginTop: 10,

  },

  spanBottom: {
    width: '100%',
    flexDirection: 'row'
  },

  absolute: {
    position: "absolute",
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    //top: 0
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

  shadow2: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.07,
    shadowRadius: 9,
    //elevation: 1,
    zIndex:999,
    
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

  todoPressableWrapper: {
    flexDirection: 'row',
  },
  todoItemPopup: {
    borderRadius: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    marginBottom: 0,
  },

  todoPopup: {
    width: '70%',
    backgroundColor: 'white',
    //position: 'absolute',
    marginLeft: 63,
    borderRadius: 15,
    padding: 9,
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
  settings: {
    marginRight: 15,
  },
  uncheckedCircle: {
    width: 23,
    height: 23,
    borderColor: '#39A4FF',
    borderWidth: 2,
    borderRadius: 20,
    marginRight: 15,
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
    padding: 4
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
    //padding: 5
  },

  timeInputWrapper: {
    backgroundColor: '#F5F5F5',
    //paddingVertical: 13,
    marginHorizontal: 10,
    borderRadius: 10,
    width: 50,
    height: 30
  },

  timeInput: {
    //paddingVertical: 5,
    paddingHorizontal: 5,
    textAlign: 'center',
    flex: 1,
    flexWrap: 'wrap',
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
  exitButton: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FF0000',
    textAlign: 'center',
    padding: 7,
  },
  fadingContainer: {
    //paddingVertical: 5,
    //paddingHorizontal: 25,
    //backgroundColor: "lightseagreen"
  },
});

// eslint-disable-next-line import/prefer-default-export
export { styles };
