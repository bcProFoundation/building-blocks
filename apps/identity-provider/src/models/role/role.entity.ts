import {
  Entity,
  Column,
  ManyToMany,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn() id: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 140,
  })
  name: string;

  @ManyToMany(type => User)
  users: Promise<User[]>;
}
