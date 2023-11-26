import User from "@datasources/models/user-model";
import { getUserByEmail } from "@datasources/user.datasource";
import UnauthorizedException from "@exceptions/unauthorized.exception";
import jwtHelper from "@helpers/jwt.helper";
import { SignInRequest, SignUpRequest } from "@interfaces/auth.interface";
import bcrypt from 'bcryptjs'

class AuthService {

    async signUp(signUpData: SignUpRequest){
        const hashedPassword = await bcrypt.hash(signUpData.password, 8);
        
        const user = await User.create({
            ...signUpData,
            password: hashedPassword
        });

        const payload = {
            id: user.id
        };
        return jwtHelper.generateToken(payload);
    }

    async signIn(signInData: SignInRequest, user?: User){
        if(!user) user = await getUserByEmail(signInData.email) as User;

        const isPasswordValid = await bcrypt.compare(signInData.password.toString(), user.password as string);

        if(!isPasswordValid) throw new UnauthorizedException("Invalid Email Or Password!", "", 403);
        
        const payload = {
            id: user.id
        }
        
        return jwtHelper.generateToken(payload);
    }

}

export default AuthService;