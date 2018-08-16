import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ObjectIdColumn,
} from 'typeorm';
import { User } from './user/user.entity';

export abstract class DocType extends BaseEntity {
  @ObjectIdColumn()
  id: string;

  @CreateDateColumn()
  creation: Date;

  @UpdateDateColumn()
  modified: Date;

  // save user id as string
  @Column(type => User)
  createdBy: User;

  // save user id as string
  @Column(type => User)
  modifiedBy: User;

  @Column()
  docstatus: number;
}
