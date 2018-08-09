import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { Session } from '../session/session.entity';
import { AuthorizationCode } from '../authorization-code/authorization-code.entity';
import { BearerToken } from '../bearer-token/bearer-token.entity';
import { Role } from '../role/role.entity';
import { AuthData } from '../auth-data/auth-data.entity';
import { UserEntity } from 'nestjs-session-store';

@Entity()
export class User extends BaseEntity implements UserEntity {
  @PrimaryGeneratedColumn() id: string;

  @CreateDateColumn() creation: Date;

  @UpdateDateColumn() modified: Date;

  @Column() public name: string;

  @Column({ type: 'varchar', length: 15 })
  public phone: string;

  @Column({ type: 'varchar', length: 140, unique: true })
  public email: string;

  @OneToOne(type => AuthData)
  @JoinColumn()
  public password: Promise<AuthData>;

  @OneToMany(type => Session, session => session.user)
  public sessions: Session[];

  @OneToMany(type => AuthorizationCode, code => code.user)
  public codes: AuthorizationCode[];

  @OneToMany(type => BearerToken, tokens => tokens.user)
  public tokens: BearerToken[];

  @ManyToMany(type => Role)
  @JoinTable()
  public roles: Promise<Role[]>;
}
