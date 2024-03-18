import authController from '@controllers/auth.controller';
import groupController from '@controllers/group.controller';
import messageController from '@controllers/message.controller';
import userController from '@controllers/user.controller';
import { verifyToken } from '@middelwares/auth.middleware';
import express, {Request, Response, NextFunction } from 'express';

const router = express.Router({ mergeParams: true });

const asyncHandler = (fn:any) => (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

router.post("/auth/signup", authController.signUp.bind(authController));

router.post("/auth/signin", authController.signIn.bind(authController));

router.get("/test", authController.verify.bind(authController));

router.post("/groups", asyncHandler(verifyToken), groupController.create.bind(groupController));

router.post("/groups/join", asyncHandler(verifyToken), groupController.join.bind(groupController));

router.get("/groups", asyncHandler(verifyToken), groupController.list.bind(groupController));

router.get("/users", asyncHandler(verifyToken), userController.search.bind(userController));

router.get("/groups/:groupUniqueId/messages", asyncHandler(verifyToken), messageController.list.bind(messageController));

router.post("/groups/:groupUniqueId/message", asyncHandler(verifyToken), messageController.create.bind(messageController));


export default router;