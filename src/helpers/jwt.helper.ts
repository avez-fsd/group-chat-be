import UnauthorizedException from '@exceptions/unauthorized.exception';
import jwt from 'jsonwebtoken'

class JwtHelper {

    generateToken(payload:any) {
       return new Promise((resolve, reject) => {
           jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "365 days"
           }, 
           (err: any, token:any) => {
                if(err) reject(err.message);
                resolve(token);
           });
       })
    }

    verifyToken(token:string, options?:any){
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, options, 
            (err: any, token:any) => {
                 if(err) reject(new UnauthorizedException(err.message));
                 resolve(token);
            });
        })
    }

    getJwtTokenFromHeader(authHeaders:string) {
        const authHeader = authHeaders.split(' ');
        if (authHeader.length !== 2) return false;
        if (authHeader[0] !== 'Bearer') return false;
        return authHeader[1];
    }

    decodeJwtToken(token:string){
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    }

    getTokenFromHeaderAndDecode(authHeaders:string) {
        const token = this.getJwtTokenFromHeader(authHeaders);
        if(!token) return null;
        return this.decodeJwtToken(token);
    }
}

export default new JwtHelper();