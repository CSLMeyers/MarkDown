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
- Item 1\r- Item **bold** text2\r- Item 3\r
2. Numbered\r2. List\r3. List\r
this is [**Adaptive** ssss _Cards_](http://adaptivecards.io)
` ;

const text6 = `
[Adaptive **Cards**](http://adaptivecards.io)
` ;

const text7 = `
5. Numbered\r2. List\r3. List
- Bullet\r- List\r
sss
- Bullet\r- Listsss
- Bullet\r- Listsss
sss
` ;

const text8 = "Bulletbu\r- Now that\r1. we have defined the main rules and\r2. features of\r- the format, \r3. we need to produce\r4)  a schema and publish it to GitHub. The schema will be the starting point of our reference documentation.";

const text9 = `
No offset {{DATE(2017-02-14T06:08:00Z)}} {{TIME(2017-02-14T06:08:00Z)}}

No offset {{DATE(2011-12-31T16:48:00Z)}} at {{TIME(2011-12-31T16:48:00Z)}}

Positive offset {{DATE(2017-02-14T06:08:00+04:00)}} {{TIME(2017-02-14T06:08:00+04:00)}}

Negative offset {{DATE(2017-02-14T06:08:00-07:00)}} {{TIME(2017-02-14T06:08:00-07:00)}}

{{DATE(2017-02-14T06:08:00Z, COMPACT)}} (Default)

{{DATE(2017-02-14T06:08:00Z, SHORT)}}

{{DATE(2017-02-14T06:08:00Z, LONG)}}

Invalid Spaces {{ DATE(2017-02-14T06:08:00Z) }} {{ TIME(2017-02-14T06:08:00Z) }}

Invalid Date {{DATE(2017-99-14T06:08:00Z)}} {{TIME(2017-99-14T06:08:00Z)}}

Invalid casing {{date(2017-02-14T06:08:00Z)}} {{Time(2017-02-14T06:08:00Z)}}

Missing seconds {{DATE(2017-10-27T22:27Z)}} {{TIME(2017-10-27T22:27:00Z)}}

TIME doesn't allow a format param {{TIME(2017-02-14T06:08:00Z, SHORT)}}

{{DATE(2017-02-14T06:08:00Z, RANDOMTEXT)}}
` ;

const text10 = `
Invalid Date {{DATE(2017-99-14T06:08:00Z)}} {{TIME(2017-99-14T06:08:00Z)}}

No offset {{DATE(2011-12-31T16:48:00Z)}} at {{TIME(2011-12-31T16:48:00Z)}}

Positive offset {{DATE(2017-02-14T06:08:00+04:00)}} {{TIME(2017-02-14T06:08:00+04:00)}}

Positive offset {{DATE(2017-02-14T06:08:00+04:30)}} {{TIME(2017-02-14T06:08:00+04:30)}}

Negative offset {{DATE(2017-02-14T06:08:00-07:00)}} {{TIME(2017-02-14T06:08:00-07:00)}}
` ;


const text = `
This is some _italic_ text
- Bulletbul_italic_letbulletbul etbutbulletbu[**Adaptive** _Cards_](http://adaptivecards.io)bulletbulletbulletbulletbulletbulletbulletbulletbulletbullet \r- List
This is some _italic_ text
5. Numbered\r2. List\r3. List
Check out [**百度**](http://baidu.com)link[Adaptive Cards](http://adaptivecards.io)
` ;

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
        <View style={styles.container}>
          <Markdown markdownStyles={styles.markdown} style={{color: 'black'}} >
            {text9}
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


// {
//   "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
//   "type": "AdaptiveCard",
//   "lang": "en",
//   "version": "1.0",
//   "body": [
//       {
//           "type": "Container",
//           "items": [
//               {
//                   "type": "TextBlock",
//                   "text": "VALID DATE / TIME FORMATS",
//                   "size": "large",
//                   "color": "good"
//               },
//               {
//                   "type": "TextBlock",
//                   "text": "No offset {{DATE(2017-02-14T06:08:00Z)}} {{TIME(2017-02-14T06:08:00Z)}}",
//                   "wrap": true
//               },
//               {
//                   "type": "TextBlock",
//                   "text": "Positive offset {{DATE(2017-02-14T06:08:00+04:00)}} {{TIME(2017-02-14T06:08:00+04:00)}}",
//                   "wrap": true
//               },
//               {
//                   "type": "TextBlock",
//                   "text": "Negative offset {{DATE(2017-02-14T06:08:00-07:00)}} {{TIME(2017-02-14T06:08:00-07:00)}}",
//                   "wrap": true
//               }
//           ]
//       },
//       {
//           "type": "Container",
//           "spacing": "large",
//           "items": [
//               {
//                   "type": "TextBlock",
//                   "text": "VALID DATE FORMAT OPTIONS",
//                   "size": "large",
//                   "color": "good"
//               },
//               {
//                   "type": "TextBlock",
//                   "text": "{{DATE(2017-02-14T06:08:00Z, COMPACT)}} (Default)",
//                   "wrap": true
//               },
//               {
//                   "type": "TextBlock",
//                   "text": "{{DATE(2017-02-14T06:08:00Z, SHORT)}}",
//                   "wrap": true
//               },
//               {
//                   "type": "TextBlock",
//                   "text": "{{DATE(2017-02-14T06:08:00Z, LONG)}}",
//                   "wrap": true
//               }
//           ]
//       },
//       {
//           "type": "Container",
//           "spacing": "large",
//           "items": [
//               {
//                   "type": "TextBlock",
//                   "text": "INVALID DATE / TIME FORMATS",
//                   "size": "large",
//                   "color": "attention"
//               },
//               {
//                   "type": "TextBlock",
//                   "text": "Invalid Spaces {{ DATE(2017-02-14T06:08:00Z) }} {{ TIME(2017-02-14T06:08:00Z) }}",
//                   "wrap": true
//               },
//               {
//                   "type": "TextBlock",
//                   "text": "Invalid Date {{DATE(2017-99-14T06:08:00Z)}} {{TIME(2017-99-14T06:08:00Z)}}",
//                   "wrap": true
//               },                
//               {
//                   "type": "TextBlock",
//                   "text": "Invalid casing {{date(2017-02-14T06:08:00Z)}} {{Time(2017-02-14T06:08:00Z)}}",
//                   "wrap": true
//               },                                
//               {
//                   "type": "TextBlock",
//                   "text": "Missing seconds {{DATE(2017-10-27T22:27Z)}} {{TIME(2017-10-27T22:27:00Z)}}",
//                   "wrap": true
//               },
//               {
//                   "type": "TextBlock",
//                   "text": "TIME doesn't allow a format param {{TIME(2017-02-14T06:08:00Z, SHORT)}}",
//                   "wrap": true
//               },
//               {
//                   "type": "TextBlock",
//                   "text": "{{DATE(2017-02-14T06:08:00Z, RANDOMTEXT)}}"
//               }

//           ]
//       }
//     ]
// }