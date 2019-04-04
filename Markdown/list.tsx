import * as React from 'react';
import {
  Text,
  View,
} from 'react-native';
import styles from './styles';

interface ListProp {
  // data: listData;
  title?: string;
  value: string;
  oreder: boolean;
}

class List extends React.Component<ListProp> {
  render() {
    console.log('111');
    let style = this.props.oreder ? styles.numbered : styles.bulletPrefix;

      return (
        <View style={styles.bulletContainer}>
          <Text style={style}>
            {'\t' + this.props.title + '  '}
          </Text>
          <Text style={styles.numbered}>
            {this.props.value}
          </Text>
        </View>
      );
  }
}

export default List;
