import * as React from 'react';
import {
  Linking,
  Text,
  View,
} from 'react-native';
import styles from './styles';

interface HyperProp {
  link: string;
  value: string;
}

class Link extends React.Component<HyperProp> {
  render() {
    return (
      <Text style={styles.link} onPress={() => this.openUrl(this.props.link)} >{this.props.value}</Text>
    );
  }

  openUrl = (url: string) => {
    Linking.openURL(url).catch(error =>
      console.warn('An error occurred: ', error),
    )
  }
}

export default Link;