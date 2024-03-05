import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import User, { userAssociations } from './user.model';
import Message, { messageAssociations } from './message.model';
import Group, { groupAssociations } from './group.model';
import UserGroup, { userGroupAssociations } from './user-group.model';

const dbConnectionOptions: SequelizeOptions = {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: (process.env.DB_PORT || 3306) as number,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: process.env.NODE_ENV === 'local' ? console.log : false,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: process.env.NODE_ENV === 'production' ? true : false,
    }
  },
  models: [__dirname + `/*model.ts`] ,
};

const dbConnection = new Sequelize(dbConnectionOptions);
dbConnection.addModels(
  [
    User,
    Message,
    UserGroup,
    Group
  ]
);

// dbConnection.sync({force:true})

userAssociations();
messageAssociations();
groupAssociations();
userGroupAssociations();

export default dbConnection;
