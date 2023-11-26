import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import User, { userAssociations } from './user.model';
import { messageAssociations } from './message.model';

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
  models: [__dirname + `/*-model.ts`] ,
};

const dbConnection = new Sequelize(dbConnectionOptions);
dbConnection.addModels(
  [
    User
  ]
);


// dbConnection.sync({force:true})

userAssociations();
messageAssociations();


export default dbConnection;
