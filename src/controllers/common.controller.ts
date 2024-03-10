import { Request, Response } from "express";

import response from '@helpers/response.helper';
import { TEXT } from '@constants';
import appConfig from '@configs/app.config';
import Group from "@datasources/models/group.model";
import UserGroup from "@datasources/models/user-group.model";
import { Op } from "sequelize";
import User from "@datasources/models/user.model";
var md5 = require('md5');

const CommonController = {
  index: async (req: Request, res: Response) => {
    // const data = await Group.findOne({
    //   include: [{
    //     model: UserGroup,
    //     as:'userGroup1',
    //     where: {
    //       userId: 2
    //     }
    //   },
    // {
    //   model: UserGroup,
    //   as:'userGroup2',
    //   where: {
    //     userId:5
    //   }
    // }],
    //   where: {
    //     isGroup: false
    //   }
    // })
    const data = await Group.findAll({
      include: [
        {
        model: User,
          as: 'user',
          where: {
            id: 1
          },
      },
        {
        model: User,
          as: 'otherParticipants',
          where: {
            id: {
              [Op.ne] : 1
            }
          },
      },
    ],
    // where: {
    //   isGroup: false
    // }
    })
    response.success(req, res, { version: appConfig.version, data })}
    ,

  health: (req: Request, res: Response) => response.success(req, res, { status: TEXT.OK })

}


export default CommonController;