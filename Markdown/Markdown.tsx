import * as React from 'react';
import {
  Text,
  View,
  TextStyle,
} from 'react-native';
import styles from './styles';
import List from './list';
import Link from './link';
import { rulers } from './rulers';
import { types, enableDataType, linkData, listData } from './mddata';
import { merge } from 'lodash'

var mergedStyles: any;

interface MarkdownProp {
  text: string;
  styles?: TextStyle;
}

export class Markdown extends React.Component<MarkdownProp> {
  componentWillMount() {
    mergedStyles = merge({}, styles, this.props.styles);
  }
  render() {
    let data: enableDataType = rulers.parse(this.props.text);
    
    return (
      <View style={styles.container}>
        {this.renderView(data)}
      </View>
    );
  }

  renderView(data: enableDataType, i?: number): any {
    i = !i ? 0 : i++;
    if (Array.isArray(data)) {
      return data.map(this.renderView.bind(this));
    } else if (typeof data == "object") {
      switch (data.type) {
        case types.simple:
          return <Text key={i}>{this.renderView(data.data)}</Text>;
        case types.bold:
          return (
          <Text key={i} style={mergedStyles.bold}>{this.renderView(data.data)}</Text>
          );
        case types.italic:
          return (
            <Text key={i} style={styles.italic}>{this.renderView(data.data)}</Text>
            );
        case types.bullet:
          return (<List key={i} oreder={false} title={data.title} value={this.renderView(data.data)}/>);
        case types.numbered:
          return (<List key={i} oreder={true} title={data.title} value={this.renderView(data.data)}/>);
        case types.hyperlinks:
        // if (data instanceof linkData)
          return (<Link key={i} link={data.link} value={this.renderView(data.data)}/>);
        default:
          return (<Text>{'data.type' + data.type + ' is not supported!'}</Text>);
      }
    } else if (typeof data == "string") {
      return <Text key={i}>{data}</Text>;
    }
  }
}
