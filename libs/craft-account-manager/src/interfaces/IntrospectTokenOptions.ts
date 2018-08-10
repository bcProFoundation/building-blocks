export interface IntrospectTokenOptions {
  url: string;
  data: any;
  callback: (err?, user?, info?) => any;
}
