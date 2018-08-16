import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ObjectIdColumn,
  Index,
} from 'typeorm';
import { Role } from '../role/role.entity';
import { AuthData } from '../auth-data/auth-data.entity';
import { UserEntity } from 'nestjs-session-store';
import * as uuid from 'uuid/v4';

@Entity()
@Index(['email', 'phone', 'uuid'], { unique: true })
export class User extends BaseEntity implements UserEntity {
  @ObjectIdColumn()
  id: string;

  @CreateDateColumn()
  creation: Date;

  @UpdateDateColumn()
  modified: Date;

  @Column()
  disabled: number = 0;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  password: AuthData;

  @Column(type => Role)
  roles: Role[];

  @Column()
  uuid: string;

  constructor() {
    super();
    if (!this.uuid) this.uuid = uuid();
  }
}
