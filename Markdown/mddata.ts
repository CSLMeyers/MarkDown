export enum types {
  simple,
  bold,
  italic,
  orderlist,
  unorderlist,
  hyperlinks,
};

export type enableDataType =  textData | linkData | Array<any>;

export interface MdData {
  data: RegExpExecArray;
  type: types;
}

export interface textData {
  type: types;
  data: string | textData | [];
}

export interface linkData extends textData {
  link: string;
}