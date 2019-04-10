import * as React from 'react';
import {
  Linking,
  Text,
} from 'react-native';
import { Styles } from './Styles';

interface HyperProp {
  link: string;
  value: string;
}

export class Link extends React.Component<HyperProp> {
  public render() {
    return (
      <Text style={Styles.link} onPress={() => this.openUrl(this.props.link)} >{this.props.value}</Text>
    );
  }

  private openUrl = (url: string) => {
    Linking.openURL(url).catch(error =>
      console.warn('An error occurred: ', error),
    );
  }
}
