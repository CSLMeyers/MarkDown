import * as React from 'react';
import {
  Text,
  View,
  TextStyle,
} from 'react-native';
import styles from './styles';
import Link from './link';
import { rulers } from './rulers';
import { types, enableDataType, linkData, textData } from './mddata';
import { merge } from 'lodash'

var mergedStyles: any;

interface MarkdownProp {
  styles?: TextStyle;
}

export class Markdown extends React.Component<MarkdownProp> {
  
  componentWillMount() {
    mergedStyles = merge({}, styles, this.props.styles);
  }

  render() { 
    let data = [];
    const child = Array.isArray(this.props.children) 
                ? this.props.children.join('') 
                : this.props.children;
    if (typeof child === 'string') {
      data = rulers.parse(child);  
    }
    
    let content = this.renderNode(data);
    return (
      <View style={styles.container}>
        {content}
      </View>
    );
  }

  private renderList(data: [], order: boolean) {
    if (!Array.isArray(data)) {
      return;
    }

    return data.map((node, index) => {
      const newKey = index + '';
      return this.renderListItem(node, newKey, index, order);
    });
  }

  private renderListBullet(ordered: boolean, index: number) {
    if (ordered) {
        return (
            <Text key={'listBullet_' + index} style={styles.listItemNumber}>{index + 1 + '.'}</Text>
        );
    }

    return (
        <Text key={'listBullet_' + index} style={styles.listItemBullet}>{'\u2022  '}</Text>
    );
  }

  private renderListItem(node: any, key: string, index: number, ordered: boolean) {
    let content = this.renderNode(node, index);

    return (
        <View style={styles.listItem} key={'listItem_' + key}>
            {this.renderListBullet(ordered, index)}
            <View key={'listItemContent_' + key} style={styles.listItemContent}>
                {content}
            </View>
        </View>
    );
  }

  private renderText(node: textData, key: string, style: TextStyle): JSX.Element {
    if (typeof node ==="string") {
      return (
        <Text key={key} style={style}>{node}</Text>
      );
    } else {
      return (
        <Text key={key} style={style}>{this.renderNode(node.data)}</Text>
      );
    }
  }

  private renderLink(node: linkData, key: string, style: TextStyle): any {
    if (typeof node.data === "string") {
      return (<Link key={key} link={node.link} value={node.data}/>);
    } else {
      return (<Link key={key} link={node.link} value={this.renderNode(node.data)}/>);
    }
  }

  private renderNode(node: enableDataType, i?: number): any {
    i = !i ? 0 : i++;
    if (Array.isArray(node)) {
      return node.map(this.renderNode.bind(this));
    } else {
      switch (node.type) {
        case types.simple: return this.renderText(node, "simple_" + i, mergedStyles.simple);
        case types.bold: return this.renderText(node, "bold_" + i, mergedStyles.bold);
        case types.italic: return this.renderText(node, "italic_" + i, mergedStyles.italic);
        case types.hyperlinks: return this.renderLink(node, "link_" + i, mergedStyles.link);
        case types.orderlist: return this.renderList(node.data, true);
        case types.unorderlist: return this.renderList(node.data, false);
        case undefined: return this.renderText(node, "simple_" + i, mergedStyles.simple);
        default: return (<Text>{'data.type' + node.type + ' is not supported!'}</Text>);
      }
    }
  }
}
