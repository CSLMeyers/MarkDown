import {
  StyleSheet,
  TextStyle,
} from 'react-native';

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 200,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  simple: {
    
  } as TextStyle,
  bold: {
    fontWeight: 'bold',
    color: 'yellow',
  } as TextStyle,
  italic: {
    fontStyle: 'italic',
  } as TextStyle,
  list: {
    marginTop: 8,
  } as TextStyle,
  listItem: {
    flexDirection: 'row',
  } as TextStyle,
  listItemContent: {
    
  } as TextStyle,
  listItemBullet: {
    paddingLeft: 16,
    paddingRight: 8,
  } as TextStyle,
  listItemNumber: {
    paddingLeft: 16,
    paddingRight: 8,
  } as TextStyle,
  link: {
    color: 'blue',
  } as TextStyle,  
});


