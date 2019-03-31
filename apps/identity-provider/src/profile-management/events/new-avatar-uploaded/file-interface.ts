export interface IFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  path?: string;
  buffer: Buffer | string | any;
  size: number;
}
