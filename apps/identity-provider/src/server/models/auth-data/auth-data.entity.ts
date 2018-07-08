import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  BaseEntity,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class AuthData extends BaseEntity {
  @PrimaryGeneratedColumn() id: string;

  @Column() password: string;

  @OneToOne(type => User, user => user.password)
  userPassword: Promise<User>;
}
