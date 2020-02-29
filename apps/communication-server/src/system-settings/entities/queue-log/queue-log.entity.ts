import { Entity, Column, ObjectID, ObjectIdColumn, BaseEntity } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class QueueLog extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  data: any | string;

  @Column()
  senderType: string;

  @Column()
  senderUuid: string;

  constructor() {
    super();
    if (!this.uuid) this.uuid = uuidv4();
  }
}
