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

@Entity()
@Index(['email', 'phone'], { unique: true })
export class User extends BaseEntity implements UserEntity {
  @ObjectIdColumn()
  id: string;

  @CreateDateColumn()
  creation: Date;

  @UpdateDateColumn()
  modified: Date;

  @Column()
  public name: string;

  @Column()
  public phone: string;

  @Column()
  public email: string;

  @Column()
  public password: AuthData;

  @Column(type => Role)
  public roles: Role[];
}
