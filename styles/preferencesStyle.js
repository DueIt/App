import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  text: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  scroll: {
    overflow: 'visible',
  },

  calendarItemContainer: {
    width: '85%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    marginBottom: 30,
  },

  calendarItem: {
    // backgroundColor: 'blue',
  },

  calendarItemText: {
    flex: 1,
    height: 20,
  },
  card: {
    flexDirection: 'column',
  marginTop: 10,
  marginBottom: 0,
},

newItemCard: {
  borderRadius: 20,
  backgroundColor: 'white',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 18,
  //marginBottom: 20,
  marginTop: 30,
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
    width: '85%',

    alignItems: 'center',
    marginHorizontal: 25,
  },

  doneButtonWrapper: {
    width: '85%',
    height: 60,
    marginTop: 20,
  },

  priorityItem: {
    borderRadius: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    marginBottom: 20,
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
    paddingLeft: 20,
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

  layerContainer: {
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    //justifyContent: "space-between",
    padding: 18,
    marginBottom: 20,
    width: '100%',

    position: 'relative',
    color: 'white',
    height:100,
    overflow: "hidden",
  },
});

// eslint-disable-next-line import/prefer-default-export
export { styles };
