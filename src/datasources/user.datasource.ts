import { SignUpRequest } from "@interfaces/auth.interface";
import User from "./models/user.model";
import { RedisHelper } from "@helpers/redis.helper";


export const createUser = (signUpData: SignUpRequest) => {

}

export const getUserByEmail = (email:string) => {
    return User.findOne({
        where: {
            email
        }
    });
}

const getUserFromRedis = (id:number) => {
    return RedisHelper.getInstance().get(`USER_${id}`,(err, data)=>{
        if(err) return null;
        return data;
    });
}

const setUserInRedis = (user:User, ttl:number) => {
    return RedisHelper.getInstance().set(`USER_${user.id}`, JSON.stringify(user), ttl);
}

export const getUserById = async (id:number) => {
    let user:any = await getUserFromRedis(id);
    if(user) return JSON.parse(user) as User;

    user = await User.findByPk(id);
    if(user) {
        setUserInRedis(user.get(), 30 * 60);
        return user.get() as User;
    } else return null;

}