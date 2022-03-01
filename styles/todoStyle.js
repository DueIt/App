import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scroll: {
    overflow: 'visible',
  },

  container: {
    marginHorizontal: 15,
  },

  pressed: {
    opacity: 0.8,
  },

  disabled: {
    opacity: 0.5,
  },

  eventItem: {
    width: '70%',
    backgroundColor: '#58A5FF',
    borderRadius: 20,
    marginLeft: 48,
    position: 'absolute',
  },
});

// eslint-disable-next-line import/prefer-default-export
export { styles };
