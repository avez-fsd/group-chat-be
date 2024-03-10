import { Table, Column, Model } from 'sequelize-typescript';
import User from './user.model';
import UserGroup from './user-group.model';

@Table({
  tableName: 'groups',
  timestamps: true,
  modelName: 'group'
})
export default class Group extends Model {

  @Column({
    field: 'id',
    primaryKey: true,
    autoIncrement: true
  })
  id?: number;

  @Column({
    field: 'name'
  })
  name?: string;

  @Column({
    field: 'group_uid'
  })
  groupUniqueId?: string;

  @Column({
    field: 'is_group'
  })
  isGroup?: boolean;

  @Column({
    field: 'created_by'
  })
  createdBy?: string;

  @Column({
    field: 'created_at',
  })
  createdAt?: Date;

  @Column({
    field: 'updated_at',
  })
  updatedAt?: Date;

  userGroups?: UserGroup[];

  otherParticipants?: User[];
}

export function groupAssociations() {
    Group.belongsToMany(User, {through: 'userGroup', as:'user'});
    Group.belongsToMany(User, {through: 'userGroup', as: 'otherParticipants'});
    Group.hasMany(UserGroup, {
      foreignKey: 'groupId',
      sourceKey: 'id',
      as: 'userGroup1'
    })
    Group.hasMany(UserGroup, {
      foreignKey: 'groupId',
      sourceKey: 'id',
      as: 'userGroup2'
    })
}