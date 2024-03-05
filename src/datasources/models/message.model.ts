import { Table, Column, Model } from 'sequelize-typescript';
import User from './user.model';

@Table({
  tableName: 'messages',
  timestamps: true,
  modelName: 'message'
})
export default class Message extends Model {

  @Column({
    field: 'id',
    primaryKey: true,
    autoIncrement: true
  })
  id?: number;

  @Column({
    field: 'user_id'
  })
  userId?: number;

  @Column({
    field: 'group_id'
  })
  groupId?: number;

  @Column({
    field: 'message'
  })
  message?: string;

  @Column({
    field: 'created_at',
  })
  createdAt?: Date;

  @Column({
    field: 'updated_at',
  })
  updatedAt?: Date;
}

export function messageAssociations() {
    Message.belongsTo(User);
}