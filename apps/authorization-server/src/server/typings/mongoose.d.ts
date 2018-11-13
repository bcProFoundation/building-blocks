import { Model, Schema, Document } from 'mongoose';

export interface PaginateOptions {
  select?: object | string;
  sort?: object | string;
  populate?: Array<object> | Array<string> | object | string;
  lean?: boolean;
  leanWithId?: boolean;
  offset?: number;
  page?: number;
  limit?: number;
}

export interface PaginateResult<T> {
  docs: Array<T>;
  total: number;
  limit: number;
  page?: number;
  pages?: number;
  offset?: number;
}

export interface PaginateModel<T extends Document> extends Model<T> {
  paginate(
    query?: object,
    options?: PaginateOptions,
    callback?: (err: any, result: PaginateResult<T>) => void,
  ): Promise<PaginateResult<T>>;
}

export function model<T extends Document>(
  name: string,
  schema?: Schema,
  collection?: string,
  skipInit?: boolean,
): PaginateModel<T>;

export function model<T extends Document, U extends PaginateModel<T>>(
  name: string,
  schema?: Schema,
  collection?: string,
  skipInit?: boolean,
): U;
