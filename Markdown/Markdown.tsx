import * as React from 'react';
import { Link } from './Link';
import { LinkData, TextData, Types } from './Mddata';

import { merge } from 'lodash';
import { Rules } from './Rulers';
import { Styles } from './Styles';

import {
  Text,
  TextStyle,
  View,
} from 'react-native';

var mergedStyles: any;

interface MarkdownProp {
  styles?: TextStyle;
}

export class Markdown extends React.Component<MarkdownProp> {

  public render() { 
    mergedStyles = merge({}, Styles, this.props.styles);
    let data = [];
    const child = Array.isArray(this.props.children) 
                ? this.props.children.join('') 
                : this.props.children;
    if (typeof child === 'string') {
      data = Rules.parse(child);  
    }
    
    let content = this.renderNode(data);
    return (
      <View style={Styles.container}>
        {content}
      </View>
    );
  }

  private renderList(data: [], order: boolean) {
    if (!Array.isArray(data)) {
      return (
        <Text>{'List should be array!'}</Text>
      );
    }

    return data.map((node, index) => {
      const newKey = index + '';
      return this.renderListItem(node, newKey, index, order);
    });
  }

  private renderListBullet(ordered: boolean, index: number) {
    if (ordered) {
        return (
            <Text key={'listBullet_' + index} style={Styles.listItemNumber}>{index + 1 + '.'}</Text>
        );
    }

    return (
        <Text key={'listBullet_' + index} style={Styles.listItemBullet}>{'\u2022  '}</Text>
    );
  }

  private renderListItem(node: any, key: string, index: number, ordered: boolean) {
    let content = this.renderNode(node, index);

    return (
        <View style={Styles.listItem} key={'listItem_' + key}>
            {this.renderListBullet(ordered, index)}
            <View key={'listItemContent_' + key} style={Styles.listItemContent}>
                {content}
            </View>
        </View>
    );
  }

  private renderText(node: TextData, key: string, style: TextStyle): JSX.Element {
    if (typeof node === 'string') {
      return (
        <Text key={key} style={style}>{node}</Text>
      );
    } else {
      return (
        <Text key={key} style={style}>{this.renderNode(node.data)}</Text>
      );
    }
  }

  private renderLink(node: LinkData, key: string, style: TextStyle): any {
    if (typeof node.data === 'string') {
      return (
        <Link key={key} link={node.link} value={node.data}/>
      );
    } else {
      return (
        <Link key={key} link={node.link} value={this.renderNode(node.data)}/>
      );
    }
  }

  private renderNode(node: any, i?: number): any {
    i = !i ? 0 : i++;
    if (Array.isArray(node)) {
      return node.map(this.renderNode.bind(this));
    } else {
      switch (node.type) {
        case Types.simple: return this.renderText(node, 'simple_' + i, mergedStyles.simple);
        case Types.bold: return this.renderText(node, 'bold_' + i, mergedStyles.bold);
        case Types.italic: return this.renderText(node, 'italic_' + i, mergedStyles.italic);
        case Types.hyperlinks: return this.renderLink((node as LinkData), 'link_' + i, mergedStyles.link);
        case Types.orderlist: return this.renderList(node.data, true);
        case Types.unorderlist: return this.renderList(node.data, false);
        case undefined: return this.renderText(node, 'simple_' + i, mergedStyles.simple);
        default: return (<Text>{'data.type' + node.type + ' is not supported!'}</Text>);
      }
    }
  }
}
