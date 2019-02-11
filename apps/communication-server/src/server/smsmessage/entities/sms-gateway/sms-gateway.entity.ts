import { Entity, ObjectID, ObjectIdColumn, Column, BaseEntity } from 'typeorm';
import { RequestBody } from './request-body.interface';
import * as uuidv4 from 'uuid/v4';

@Entity()
export class SMSGateway extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  requestURL: string;

  @Column()
  requestType: number; // POST or GET

  @Column()
  messageParam: string;

  @Column()
  numbersParam: string;

  @Column()
  requestBody: RequestBody[];

  constructor() {
    super();
    if (!this.uuid) this.uuid = uuidv4();
  }
}