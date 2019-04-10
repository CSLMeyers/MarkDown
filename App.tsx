/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { Component } from 'react';
import {Platform, StyleSheet, Text, View, Linking} from 'react-native';
import { Markdown } from './Markdown/Markdown';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const text1 = `
Check out [**Adaptive** _Cards_](http://adaptivecards.io)
` ;

const text2 = `
- Bulletbul_italic_letbulletbul etbutbulletbu[**Adaptive** _Cards_](http://adaptivecards.io)bulletbulletbulletbulletbulletbulletbulletbulletbulletbullet \r- List \r
This is some **bold** text
1. Numbered\r2. List\r3. List
` ;

const text3 = `
This is some **bold** text
This is some _italic_ text
And this is some **_boldanditalic_** text 
` ;

const text4 = `
1. Numbered\r2. List\r3. List
- Item 1\r- Item 2\r- Item 3
This is some **bold** text
This is some **_italic_bold** text
` ;

const text5 = `
this is why we play.
This is some **bold** text
- Item 1\r- Item **bold** text2\r- Item 3
This is some **bold** text
2. Numbered\r2. List\r3. List
this is [**Adaptive** ssss _Cards_](http://adaptivecards.io)
` ;

const text6 = `
- Bullet\r- Listthis [Adaptive Cards](http://adaptivecards.io)
` ;

const text7 = `
5. Numbered\r2. List\r3. List
- Bullet\r- List
5. Numbered\r2. List\r3. List
- Bullet\r- List
` ;

const text8 = `
dfdfdf
` ;

const text = `
1. Bulletbul_italic_letbulletbul etbutbulletbu[**Adaptive** _Cards_](http://adaptivecards.io)bulletbulletbulletbulletbulletbulletbulletbulletbulletbullet\r2. List\r3. List
- Item 1\r- Item 2\r- Item 3
This is some **bold** text
This is some _italic_ text
- Bulletbul_italic_letbulletbul etbutbulletbu[**Adaptive** _Cards_](http://adaptivecards.io)bulletbulletbulletbulletbulletbulletbulletbulletbulletbullet \r- List
- Item 1\r- Item 2\r- Item 3
Check out [**百度**](http://baidu.com)link[Adaptive Cards](http://adaptivecards.io)
` ;

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
        <View style={styles.container}>
          <Markdown styles={styles.markdown} >
            {text}
          </Markdown>
        </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  markdown: {
    bold: {
      color: 'red',
    }
  }
};
