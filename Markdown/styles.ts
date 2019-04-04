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
  numbered: {
    
  } as TextStyle,
  bulletContainer: {
    flexDirection: 'row',
  } as TextStyle,
  bullet: {
    paddingLeft: 8,
    paddingRight: 24,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  } as TextStyle,
  bulletPrefix: {
    fontWeight: 'bold',
  } as TextStyle,
  link: {
    color: 'blue',
    // textDecorationLine: 'underline',
  } as TextStyle,  
});

export default styles;