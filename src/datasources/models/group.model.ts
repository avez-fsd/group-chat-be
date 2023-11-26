import { Table, Column, Model } from 'sequelize-typescript';
import User from './user.model';

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

export function groupAssociations() {
    Group.belongsToMany(User, {through: 'UserGroup'});
}