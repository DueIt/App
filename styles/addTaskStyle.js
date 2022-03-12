import { hide } from 'expo-splash-screen';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scroll: {
    overflow: 'hidden',
  },

  container: {
    marginHorizontal: 25,
    position: 'relative',
    color: 'white',
  },

  card: {
      flexDirection: 'column',
    marginTop: 10,
    marginBottom: 0,
  },

  pressed: {
    opacity: 0.8,
  },

  disabled: {
    opacity: 0.5,
  },
  doneButtonWrapper: {
    //width: '85%',
    height: 60,
    marginTop: 20,
  },
  doneButton: {
    backgroundColor: '#39A4FF',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
  },

  title: {
    marginBottom: 30,
    marginTop: 10,
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
  },

  exitButton: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FF0000',
    textAlign: 'center',
    padding: 18,
  },

  text: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  toggleText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    paddingRight: 40,
  },

  toggleText2: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    paddingRight: 31,
  },
  toggleText3: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    paddingRight: 45,
  },
  toggleText4: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    paddingRight: 75,
  },

  largerText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  lightText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3,
  },

  newItemInput: {
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start",
    padding: 18,
    marginBottom: 20,
  },
  newItemContainer: {
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: "flex-start",
    padding: 18,
    marginBottom: 20,
  },
    row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    padding: 16,
    borderBottomColor: '#A1A1A1',
    borderBottomWidth: 1,
  },

  lastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    padding: 16,
    
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomColor: '#A1A1A1',
    borderBottomWidth: 1,
    width: 100,
  },

  pressed: {
    opacity: 0.8,
  },

  disabled: {
    opacity: 0.5,
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

  layerContainer: {
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    padding: 18,
    marginBottom: 20,
    position: 'relative',
    color: 'white',
    height:120,
    overflow: "hidden",
  },

  dateTimeInput: {
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: "flex-start",

    padding: 18,
    marginBottom: 20,
  },

  datePickerStyle: {
    height:120,
    transform: [
        { scaleX: 0.9 }, 
        { scaleY: 0.9 },
     ],
  },
  toggleStyle: {
    transform: [
        { scaleX: 0.85 }, 
        { scaleY: 0.85 },
     ],
  },

  newItemCard: {
    borderRadius: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    //marginBottom: 20,
    marginTop: 30,
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
  timePicker: {
    width: 50,
  },
  pickerItem: {
      height: 40,
  },
}
);

// eslint-disable-next-line import/prefer-default-export
export { styles };