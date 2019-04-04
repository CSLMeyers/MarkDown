export enum types {
  simple,
  bold,
  italic,
  bullet,
  numbered,
  hyperlinks,
};

export var listtype = [types.bullet, types.numbered];

export type enableDataType = string | textData | listData | linkData | Array<any>;

// dealing
export interface MdData {
  data: RegExpExecArray;
  type: types;
}

// dealed
export interface textData {
  type: types;
  data: string | textData | [];
}

export interface listData extends textData {
  title: string;
  data: string | listData | [];
}

export interface linkData extends textData {
  link: string;
  data: string | linkData | [];
}