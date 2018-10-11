import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Index,
  ObjectIdColumn,
  ObjectID,
} from 'typeorm';

export abstract class DocType extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Index({ unique: true })
  @Column()
  uuid: string;

  @CreateDateColumn()
  creation: Date;

  @UpdateDateColumn()
  modified: Date;

  // save user id as string
  @Column()
  createdBy: string;

  // save user id as string
  @Column()
  modifiedBy: string;

  @Column()
  docstatus: number;
}
