import { MdData, Types} from './Mddata';

var CR_NEWLINE_R = /\r\n?/g;
var TAB_R = /\t/g;
var FORMFEED_R = /\f/g;

export const Rules = {
  regexobject: {
    headline: /^(\#{1,6})([^\#\n]+)$/m,
    code: /\s\`\`\`\n?([^`]+)\`\`\`/g,
    bold: /\*\*([^\n*]+)\*\*/,
    italic: /_([^\n_]+)_/,
    hr: /^(?:([\*\-_] ?)+)\1\1$/gm,
    lists: /^((\s*((\*|\-)|\d(\.|\))) [^\n]+)\n)+/gm,
    bolditalic: /(?:([\*_~]{1,3}))([^\*_~\n]+[^\*_~\s])\1/g,
    links: /\[([^\]<>]+)\]\(([^ \)<>]+)( "[^\(\)\"]+")?\)/,
    reflinks: /\[([^\]]+)\]\[([^\]]+)\]/g,
    smlinks: /\@([a-z0-9]{3,})\@(t|gh|fb|gp|adn)/gi,
    mail: /<(([a-z0-9_\-\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,7}))>/gmi,
    tables: /\n(([^|\n]+ *\| *)+([^|\n]+\n))((:?\-+:?\|)+(:?\-+:?)*\n)((([^|\n]+ *\| *)+([^|\n]+)\n)+)/g,
    include: /[\[<]include (\S+) from (https?:\/\/[a-z0-9\.\-]+\.[a-z]{2,9}[a-z0-9\.\-\?\&\/]+)[\]>]/gi,
    url: /<([a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[\-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?)>/g,
    url2: /[ \t\n]([a-zA-Z]{2,16}:\/\/[a-zA-Z0-9@:%_\+.~#?&=]{2,256}.[a-z]{2,4}\b(\/[\-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?)[ \t\n]/g
  },
  
  parse(text: string) : any {
    if (!text || !text.length || typeof text !== 'string') {
      return;
    }
    
    // Turn various crazy whitespace into easy to process things
    text = text.replace(CR_NEWLINE_R, '\n')
            .replace(FORMFEED_R, '')
            .replace(TAB_R, '    ');
    
    // parse list
    let out = this.execType(text, this.parseList.bind(this));
    out = this.execType(out, this.parseUnorderList.bind(this));
    // parse link
    out = this.execType(out, this.parseLink.bind(this));
    // parse normal text
    out = this.execType(out, this.parseText.bind(this));

    return out;
  },

  execType(data: any, func: any): any {
    if (typeof data === 'string') {
      return func(data);
    } else if (Array.isArray(data)) {
      return data.map(e => this.execType(e, func));
    } else if (typeof data === 'object') {
      data.data = this.execType(data.data, func);
      return data;
    }
  },

  // Recursive can't express the tree structure, so instead use the loop
  parseList(text: string) {
    let out = [];
    let stra, line;
    while ((stra = /^((\s*(\d(\.|\))) [^\n]+)\n)+/gm.exec(text)) !== null) {
      let before = text.slice(0, stra.index);
      if (before.length) {
        out.push(before);
      }
      
      text = text.slice(stra.index, text.length);
      let helper = stra[0].split('\n');
      let items = [];
      for (let i = 0; i < helper.length; i++) {
        if ((line = /^((\s*)(\d(\.|\))) ([^\n]+))/.exec(helper[i])) !== null) {
          items.push({
            type: Types.simple,
            data: line[5],
          });
        }
      }
      out.push({
        type: Types.orderlist,
        data: items,
      });
      text = text.replace(stra[0], '\n');
    }
    
    if (text.length) {
      out.push(text);
    }

    return out;
  },

  parseUnorderList(text: string) {
    let out = [];
    let stra, line;
    while ((stra = /^((\s*((\*|\-)|\d(\.|\))) [^\n]+)\n)+/gm.exec(text)) !== null) {
      let before = text.slice(0, stra.index);
      if (before.length) {
        out.push({
          // regard text that left is simple text
          type: Types.simple,
          data: before,
        });
      }
      
      text = text.slice(stra.index, text.length);
      let helper = stra[0].split('\n');
      let items = [];
      for (let i = 0; i < helper.length; i++) {
        if ((line = /^((\s*)((\*|\-)|\d(\.|\))) ([^\n]+))/.exec(helper[i])) !== null) {
          items.push({
            type: Types.simple,
            data: line[6],
          });
        }
      }
      out.push({
        type: Types.unorderlist,
        data: items,
      });
      text = text.replace(stra[0], '\n');
    }
    
    if (text.length) {
      out.push({
        type: Types.simple,
        data: text,
      });
    }

    return out;
  },

  parseLink(text: string): any {
    if (this.regexobject.links.exec(text) === null) {
      return text;
    }

    const out = [];
    let regData: RegExpExecArray | null;

    while ((regData = this.regexobject.links.exec(text)) !== null) {
      if (!regData || regData.length < 3) {
        break;
      }
      
      if (regData.index > 0) {
        out.push(text.slice(0, regData.index));
      }
      
      out.push({
        type: Types.hyperlinks,
        link: regData[2],
        data: regData[1],
      });
      text = text.slice(regData.index + regData[0].length);
    }

    if (text.length) {
      out.push(text);
    }

    return out;
  },

  /* bold and italic */
  parseText(text: string) : any {
    if (this.findNextType(text) === null) {
      return text;
    }

    const out = [];
    let regData: MdData | null;
    while ((regData = this.findNextType(text)) !== null) {
      if (regData.data.index > 0) {
        out.push(text.slice(0, regData.data.index));
      }

      out.push({
        type: regData.type,
        data: this.parseText(regData.data[1]),
      });

      text = text.slice(regData.data.index + regData.data[0].length);
    }

    if (text.length) {
      out.push(text);
    }

    return out;
  },

  findNextType(text: string) {
    let boldData: MdData | null = this.findBold(text);
    let italicData: MdData | null = this.findItalic(text);
    
    const data = [];
    if (boldData) {
      data.push(boldData);
    }
    
    if (italicData) {
      data.push(italicData);
    }
    
    let sortedData = data.sort(function(a: MdData, b: MdData) {
      return a.data.index - b.data.index;
    });

    return sortedData.length ? sortedData[0] : null;
  },

  findBold(text: string) {
    return this.find(Rules.regexobject.bold, Types.bold, text);
  },

  findItalic(text: string) {
    return this.find(this.regexobject.italic, Types.italic, text);
  },

  find(reg : any, type: Types, text: string) {
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
