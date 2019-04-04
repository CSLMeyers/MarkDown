import * as React from 'react';
import {
  Text,
  View,
  Linking,
} from 'react-native';
import styles from './styles';
import List from './list';
import { rulers } from './rulers';

const BULLET = '•'
const UNORDERED_PREFIX = `${BULLET} `
type MdData = string | Type | Type[];
interface Type {
  type:  'bold' | 'italic' | 'bullet' | 'numbered' | 'hyperlinks';
  text: string;
  link: string;
  data: Type;
}

var listtype = ['bullet', 'numbered'];

interface MarkdownProp {
  text: string;
}

function flatArray(input) {
  return input.reduce(function(prev, cur) {
    let more = [].concat(cur).some(Array.isArray);
    return prev.concat(more ? flatArray(cur) : cur);
  },[]);
}

export class Markdown extends React.Component<MarkdownProp> {
  render() {
    let text: MdData = this.parse(this.props.text);
    return (
      <View style={styles.container}>
        {this.renderMarkdownView(text)}
      </View>
    );
  }

  parse(text: string) {
    if (!text || !text.length) return;
    text = text.replace(/\n/g, '↵\n');
    let data = this.execType(text, this.findNumberedList.bind(this));
    data = this.execType(data, this.findBulletList.bind(this));
    data = this.execType(data, rulers.findHyperlinks.bind(this));
    data = this.execType(data, this.findItalic.bind(this));
    data = this.execType(data, this.findBold.bind(this));

    if (Array.isArray(data)) {
      data = flatArray(data);
      data = this.replaceEnter(data);
    }

    return data;
  }

  replaceEnter(data: any) {
    return data.map(e => {
      if (typeof e == "string") {
        return e.replace(/↵/g, '');
      } else if (typeof e == "object" && typeof e.text == "string") {
        e.text = e.text.replace(/↵/g, '');
        return e;
      } else if (Array.isArray(e.text)) {
        return {
          type: e.type,
          link: e.link,
          text: this.replaceEnter.call(this, e.text)
        };
      }
      return e;
    });
  }

  execType(data: MdData, func: any) {
    if (typeof data == "string") {
      return func(data);
    } else if (Array.isArray(data)) {
      return data.map(e => this.execType(e, func));
    } else if (typeof data == "object") {
      return {
        type: data.type,
        link: data.link,
        text: this.execType(data.text, func),
      }
    }
  }

  findBold(text: string) {
    return this.find(/\*\*([^\n*]+)\*\*/, 'bold', text);
  }

  findItalic(text:string) {
    return this.find(/_([^\n_]+)_/, 'italic', text);
  }

  find(reg : any, type: string, text: string) {
    const out = [];
    let loop = true;
    while (loop && text.length) {
      let res = reg.exec(text);
      if (res) {
        out.push(text.slice(0, res.index));
        out.push({
          type: type,
          text: res[1],
        });
        text = text.slice(res.index + res[0].length);
      } else {
        loop = false;
      }
    }
    if (!out.length) {
      return text;
    }
    if (text.length) {
      out.push(text);
    }
    if (out.length == 1) {
      return out[0];
    }
    return out;
  }

  getNestedRegexp(level: number) {
    return new RegExp('^(?=\\s{'+level+'}\\-).*','m');
  }

  findBulletList(text: string) {
    return this.findBullet(this.getNestedRegexp(0), 'bullet', text);
  }

  findBullet(reg : any, type: string, text: string) {
    const out = [];
    let loop = true;
    while (loop && text.length) {
      let res = reg.exec(text);
      if (res) {
        out.push(text.slice(0, res.index));
        out.push({
          type: type,
          text: res[0].replace('- ', ''),
        });
        text = text.slice(res.index + res[0].length);
      } else {
        loop = false;
      }
    }
    if (!out.length) {
      return text;
    }
    if (text.length) {
      out.push(text);
    }
    if (out.length == 1) {
      return out[0];
    }
    return out;
  }

  findNumberedList(text: string) {
    return this.find(/(\d+. .*)/, 'numbered', text);
  }

  findHyperlinks(text: string) {
    const out = [];
    let loop = true;
    let reg = new RegExp(/\[(.+?)\]\((.+?)\)/);
    while (loop && text.length) {
      let res = reg.exec(text);
      if (res) {
        // res[0] ==> [Adaptive Cards](http://adaptivecards.io)
        let title = /\[(.+?)\]/.exec(res[0]); // Adaptive Cards
        let link = /\((.+?)\)/.exec(res[0]);      // http://adaptivecards.io
        out.push(text.slice(0, res.index));
        out.push({
          type: 'hyperlinks',
          text: title[1],
          link: link[1],
        });
        text = text.slice(res.index + res[0].length);
      } else {
        loop = false;
      }
    }
    if (!out.length) {
      return text;
    }
    if (text.length) {
      out.push(text);
    }
    if (out.length == 1) {
      return out[0];
    }
    return out;
  }

  renderList(data: MdData, i?) {
    i = !i ? 0 : i++;
    if (!Array.isArray(data)) {
      return;
    } 
    let list: MdData[] = [];
    for (; i < data.length; ++i) {
      if (!listtype.includes(data[i].type)) {
        break;
      } else {
        list.push(data[i]);
      }
    }
    return (
      <View>
        <View>
          {this.createText(list)}
        </View>
        {this.renderMarkdownView(data, i)}
      </View>
    );
  }

  renderText(data: MdData, i?) {
    i = !i ? 0 : i++;
    if (!Array.isArray(data)) {
      return;
    } 
    let list: MdData[] = [];
    for (; i < data.length; ++i) {
      if (listtype.includes(data[i].type)) {
        break;
      } else {
        list.push(data[i]);
      }
    }
    return (
      <View>
        <Text>
          {this.createText(list)}
        </Text>
        {this.renderMarkdownView(data, i)}
      </View>
    );
  }

  renderMarkdownView(data: MdData, i?) {
    i = !i ? 0 : i++;
    if (typeof data == "string") {
      return this.createText(data, i);
    } else if (Array.isArray(data)) {
      if (i >= data.length) {
        return;
      }
      
      if (listtype.includes(data[i].type)) {
        return this.renderList(data, i);
      } else {
        return this.renderText(data, i);
      }
    } else if (typeof data === "object") {
      if (listtype.includes(data.type)) {
        return this.renderList(data);
      } else {
        return this.renderText(data);
      }
    }
  }

  createText(data: any, i?) {
    i = !i ? 0 : i++;
    if (typeof data == "string") {
      return <SimpleText key={i} value={data}/>
    } else if (Array.isArray(data)) {
      return data.map(this.createText.bind(this));
    } else if (typeof data == "object") {
      let value;
      let link :string;
      if (data.type === "hyperlinks") {
        link = data.link;
      }
      if (typeof data.text == "string") {
        value = data.text;
      } else {
        value = this.createText.call(this, data.text, i);
      }
      const actions = {
        'bold': (value: string) => <BoldText key={i} value={value}/>,
        'italic': (value: string) => <ItalicText key={i} value={value}/>,
        'bullet': (value: string) => <BulletText key={i} value={value}/>,
        'numbered': (value: string) => <NumberedText key={i} value={value}/>,
        'hyperlinks': (value: string) => <Hyperlinks link={link} key={i} value={value}/>,
      };
      return actions[data.type](value);
    }
  }
}

const SimpleText = ({value}) => <Text>{value}</Text>;
const BoldText = ({value}) => <Text style={styles.bold}>{value}</Text>;
const ItalicText = ({value}) => <Text style={styles.italic}>{value}</Text>;

interface BulletProp {
  value: string;
}

class BulletText extends React.Component<BulletProp> {
  render() {
    return (
      <View style={styles.bulletContainer}>
        <Text style={styles.bulletPrefix}>
          {'\t' + UNORDERED_PREFIX}
        </Text>
        <Text style={styles.bullet}>
          {this.props.value}
        </Text>
      </View>
    );
  }
}

interface HyperProp {
  link: string;
  value: string;
}

class Hyperlinks extends React.Component<HyperProp> {
  
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
