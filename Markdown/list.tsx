import * as React from 'react';
import {
  Text,
  View,
} from 'react-native';
import styles from './styles';
import { listData } from './mddata';
import { Markdown } from './Markdown';

interface ListProp {
  // data: listData;
  title?: string;
  value: string;
  oreder: boolean;
}

class List extends React.Component<ListProp> {
  render() {
    if (this.props.oreder) {
      return (
        <View style={styles.bulletContainer}>
          <Text style={styles.numbered}>
            {'\t' + this.props.title + '  '}
          </Text>
          <Text style={styles.numbered}>
            {this.props.value}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletPrefix}>
            {'\t' + '\u2022 '}
          </Text>
          <Text style={styles.bullet}>
            {this.props.value}
          </Text>
        </View>
      );
    }
  }
}

export default List;
