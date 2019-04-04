import { types, enableDataType, MdData, textData, listData, linkData} from './mddata'

var CR_NEWLINE_R = /\r\n?/g;
var TAB_R = /\t/g;
var FORMFEED_R = /\f/g;

export const rulers = {
  regexobject: {
    headline: /^(\#{1,6})([^\#\n]+)$/m,
    code: /\s\`\`\`\n?([^`]+)\`\`\`/g,
    bold: /\*\*([^\n*]+)\*\*/,
    italic: /_([^\n_]+)_/,
    hr: /^(?:([\*\-_] ?)+)\1\1$/gm,
    lists: /^((\s*((\*|\-)|\d(\.|\))) [^\n]+)\n)+/gm,
    bolditalic: /(?:([\*_~]{1,3}))([^\*_~\n]+[^\*_~\s])\1/g,
    links: /!?\[([^\]<>]+)\]\(([^ \)<>]+)( "[^\(\)\"]+")?\)/g,
    reflinks: /\[([^\]]+)\]\[([^\]]+)\]/g,
    smlinks: /\@([a-z0-9]{3,})\@(t|gh|fb|gp|adn)/gi,
    mail: /<(([a-z0-9_\-\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,7}))>/gmi,
    tables: /\n(([^|\n]+ *\| *)+([^|\n]+\n))((:?\-+:?\|)+(:?\-+:?)*\n)((([^|\n]+ *\| *)+([^|\n]+)\n)+)/g,
    include: /[\[<]include (\S+) from (https?:\/\/[a-z0-9\.\-]+\.[a-z]{2,9}[a-z0-9\.\-\?\&\/]+)[\]>]/gi,
    url: /<([a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[\-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?)>/g,
    url2: /[ \t\n]([a-zA-Z]{2,16}:\/\/[a-zA-Z0-9@:%_\+.~#?&=]{2,256}.[a-z]{2,4}\b(\/[\-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?)[ \t\n]/g
  },
  
  parse(text: string) :any {
    if (!text || !text.length || typeof text !== "string") {
      return;
    }
    
    // Turn various crazy whitespace into easy to process things
    text = text.replace(CR_NEWLINE_R, '\n')
            .replace(FORMFEED_R, '')
            .replace(TAB_R, '    ');
    
    // parse list
    let out = this.parseList(text);

    // parse link


    // parse text
    if (Array.isArray(out)) {
      for (let i = 0; i < out.length; ++i) {
        if (typeof out[i].data === "string") {
          out[i].data = this.parseText(out[i].data);
        }
      }
    }

    return out;
  },

  parseList(text: string) {
    const out = [];
    let stra, line, type;
    while ((stra = this.regexobject.lists.exec(text)) !== null) {
      let before = text.slice(0, stra.index).replace(/\n+$/g,'');
      if (before.length) {
        out.push({
          type: types.simple,
          data: before.replace(/\n+$/g,''),
        });
      }
      
      text = text.slice(stra.index, text.length);
      let helper = stra[0].split('\n');
      for (let i = 0; i < helper.length; i++) {
        if ((line = /^((\s*)((\*|\-)|\d(\.|\))) ([^\n]+))/.exec(helper[i])) !== null) {
          if ((line[0].trim().substr(0, 1) === '*') || (line[0].trim().substr(0, 1) === '-')) {
            type = types.bullet;
            out.push({
              type: type,
              title: '\u2022 ',
              data: line[6],
            });
          } else {
            type = types.numbered;
            out.push({
              type: type,
              title: line[3], // 顺序从第一个开始累加 i, i+1, i+2...
              data: line[6],
            });
          }
        }
      }
      text = text.replace(stra[0], '');
    }
    
    out.push({
      type: types.simple,
      data: text,
    });
    return out;
  },

  parseText(text: string) :any {
    if (!text || !text.length || typeof text !== "string") {
      return;
    }
    
    text = text.replace(CR_NEWLINE_R, '\n')
            .replace(FORMFEED_R, '')
            .replace(TAB_R, '    ');
    
    let res: MdData | null = this.findNextType(text);

    if (!res) {
      return text;
    }
    
    const out = [];
    out.push({
      type: types.simple,
      data: text.slice(0, res.data.index),
    });
    
    switch(res.type) {
      case types.bold:
      case types.italic:
        out.push({
          type: res.type,
          data: this.parseText(res.data[1]),
        });
        break;
      case types.hyperlinks:
        out.push(this.handleLink(res));
        break;
      default:
        break;
    }

    text = text.slice(res.data.index + res.data[0].length);
    out.push(this.parseText(text));

    return out;
  },
  
  handleLink(mdData: MdData): linkData | null { 
    if (!mdData || mdData.data.length < 3) {
      return null;
    }

    return {
      type: mdData.type,
      link: mdData.data[2],
      data: this.parseText(mdData.data[1]),
    };
  },

  findNextType(text: string) {
    let boldData: MdData | null = this.findBold(text);
    let italicData: MdData | null = this.findItalic(text);
    let linkData: MdData | null = this.findHyperlink(text);
    
    const data = [];
    if (boldData) {
      data.push(boldData);
    }
    
    if (italicData) {
      data.push(italicData);
    }

    if (linkData) {
      data.push(linkData)
    }

    let sortedData = data.sort(function(a: MdData, b: MdData) {
      return a.data.index - b.data.index;
    });

    return sortedData.length ? sortedData[0] : null;
  },

  findBold(text: string) {
    return this.find(rulers.regexobject.bold, types.bold, text);
  },

  findItalic(text:string) {
    return this.find(this.regexobject.italic, types.italic, text);
  },

  findHyperlink(text: string) {
    return this.find(this.regexobject.links, types.hyperlinks, text);
  },

  find(reg : any, type: types, text: string) {
    let regRes = reg.exec(text);
    if (regRes) {
      let ret: MdData = {
        type: type,
        data: regRes,
      };
      return ret; 
    }

    return null;
  },
};
