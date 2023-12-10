import authController from '@controllers/auth.controller';
import groupController from '@controllers/group.controller';
import { verifyToken } from '@middelwares/auth.middleware';
import express, {Request, Response, NextFunction } from 'express';

const router = express.Router({ mergeParams: true });

const asyncHandler = (fn:any) => (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

router.post("/auth/signup", authController.signUp.bind(authController));

router.post("/auth/signin", authController.signIn.bind(authController));

router.get("/test", authController.verify.bind(authController));

router.post("/group/create", asyncHandler(verifyToken), groupController.create.bind(groupController));


export default router;