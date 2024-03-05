import { Table, Column, Model } from 'sequelize-typescript';
import Message from './message.model';
import Group from './group.model';
import UserGroup from './user-group.model';

@Table({
  tableName: 'users',
  timestamps: true,
  modelName: 'user'
})
export default class User extends Model {

  @Column({
    field: 'id',
    primaryKey: true,
    autoIncrement: true
  })
  id?: number;

  @Column({
    field: 'user_uid'
  })
  userUniqueId?: string;

  @Column({
    field: 'name'
  })
  name?: string;

  @Column({
    field: 'email'
  })
  email?: string;

  @Column({
    field: 'password'
  })
  password?: string;

  @Column({
    field: 'created_at',
  })
  createdAt?: Date;

  @Column({
    field: 'updated_at',
  })
  updatedAt?: Date;

  userGroups?: UserGroup[];

  groups?: Group[];
}

export function userAssociations() {
    User.hasMany(Message);
    User.belongsToMany(Group, {through: 'userGroup'})
}