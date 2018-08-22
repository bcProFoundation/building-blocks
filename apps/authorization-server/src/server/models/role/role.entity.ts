import {
  Entity,
  Column,
  Index,
  BaseEntity,
  ObjectIdColumn,
  ObjectID,
} from 'typeorm';

@Entity()
@Index(['name'], { unique: true })
export class Role extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  name: string;
}
