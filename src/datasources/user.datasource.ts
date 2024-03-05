import { SignUpRequest } from "@interfaces/auth.interface";
import User from "./models/user.model";
import { RedisHelper } from "@helpers/redis.helper";
import { Pagination } from "@interfaces/pagination.interface";
import { getOffset, paginate } from "@helpers/pagination.helper";
import { Op } from "sequelize";


export const createUser = (signUpData: SignUpRequest) => {

}

export const getUserByEmail = (email:string) => {
    return User.findOne({
        where: {
            email
        }
    });
}

const getUserFromRedis = (userUniqueId:string) => {
    return RedisHelper.getInstance().get(`USER_${userUniqueId}`,(err, data)=>{
        if(err) return null;
        return data;
    });
}

const setUserInRedis = (user:User, ttl:number) => {
    return RedisHelper.getInstance().set(`USER_${user.userUniqueId}`, JSON.stringify(user), ttl);
}


export const getUserByUniqueId = async (userUniqueId:string) => {
    let user:any = await getUserFromRedis(userUniqueId);
    if(user) return JSON.parse(user) as User;

    user = await User.findOne({
        where: {
            userUniqueId
        }
    })
    if(user) {
        setUserInRedis(user.get(), 30 * 60);
        return user.get() as User;
    } else return null;

}

export async function getUsers(
    page: number,
    pageSize: number,
    searchTerm: string
): Promise<Pagination<User> | null> {

    let where:any = {};

    if(searchTerm) {
        where = {
            [Op.or]: [
                {
                  name: {
                    [Op.like]: `%${searchTerm}%`
                  }
                },
                {
                  email: {
                    [Op.like]: `%${searchTerm}%`
                  }
                }
            ]
        
        }
    }
    const users = await User.findAndCountAll({
        where,
        limit: pageSize,
        offset: getOffset(page, pageSize),
    });

    return paginate<User>(users, page, pageSize);
}
