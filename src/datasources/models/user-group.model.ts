import { Table, Column, Model } from 'sequelize-typescript';
import Group from './group.model';
import User from './user.model';

@Table({
  tableName: 'user_groups',
  timestamps: true,
  modelName: 'userGroup'
})
export default class UserGroup extends Model {

  @Column({
    field: 'id',
    primaryKey: true,
    autoIncrement: true
  })
  id?: number;

  @Column({
    field: 'user_id'
  })
  userId?: string;

  @Column({
    field: 'group_id'
  })
  groupId?: string;

  @Column({
    field: 'created_at',
  })
  createdAt?: Date;

  @Column({
    field: 'updated_at',
  })
  updatedAt?: Date;
}

export function userGroupAssociations() {
  // UserGroup.hasOne(Group, {
  //   foreignKey: 'id',
  //   sourceKey: 'groupId'
  // })
}