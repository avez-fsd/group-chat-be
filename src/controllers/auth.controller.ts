import { Request, Response } from "express";
import response from '@helpers/response.helper'
import { validateRequest } from "@helpers/validation.helper";
import { SignInSchema, SignUpSchema } from "@requests/auth.schema";
import AuthService from "@services/auth.service";
import { SignInRequest, SignUpRequest } from "@interfaces/auth.interface";
import { getUserByEmail } from "@datasources/user.datasource";
import InvalidRequestException from "@exceptions/invalid-request.exception";
import logger from "@helpers/logger.helper";
import NotFoundException from "@exceptions/not-found.exception";
class AuthController {

    async signUp(req: Request, res: Response){
        try {
            validateRequest(SignUpSchema, req.body, req);
          
            const user = await getUserByEmail(req.body.email);
            if(user) throw new InvalidRequestException("User Already Exist!");

            const authService = new AuthService();
            const token = await authService.signUp(req.body as SignUpRequest);

            return response.success(req, res, {token});
            
        } catch (err:any) {
            logger.error(err.message, err);
            return response.failed(req, res, err.message, null, err.httpCode);
        }
    }

    async signIn(req: Request, res: Response){
        try {
            validateRequest(SignInSchema, req.body, req);
            
            const user = await getUserByEmail(req.body.email);
            if(!user) throw new NotFoundException("User Not Found!");

            const authService = new AuthService();
            const token = await authService.signIn(req.body as SignInRequest, user);

            return response.success(req, res, {token});
            
        } catch (err:any) {
            return response.failed(req, res, err.message, null, err.httpCode);
        }
    }

    async verify(req: Request, res: Response){
        try {
            console.log('test')
            res.set("Cache-Control", `public, max-age=${3600}`)
            return response.success(req, res, {
                'test':'test'
            });
        } catch (err:any) {
            return response.failed(req, res, err.message, null, err.httpCode);
        }
    }
}

export default new AuthController();