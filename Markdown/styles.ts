import {
  StyleSheet,
  TextStyle,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 200,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  bold: {
    fontWeight: 'bold',
  } as TextStyle,
  italic: {
    fontStyle: 'italic',
  } as TextStyle,
  listItem: {
    flexDirection: 'row',
  } as TextStyle,
  listItemContent: {
    paddingRight: 24,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  } as TextStyle,
  listItemBullet: {
    paddingLeft: 16,
    paddingRight: 8,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  } as TextStyle,
  listItemNumber: {
    paddingLeft: 16,
    paddingRight: 8,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  } as TextStyle,
  link: {
    color: 'blue',
    // textDecorationLine: 'underline',
  } as TextStyle,  
});

export default styles;