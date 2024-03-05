import { WS_CONNECTION_CLOSE_REASON } from "@constants";
import { getUserByUniqueId } from "@datasources/user.datasource";
import UnauthorizedException from "@exceptions/unauthorized.exception";
import jwtHelper from "@helpers/jwt.helper";
import { NextFunction, Request, Response } from "express";

export const verifyToken = async (req:Request, res: Response, next: NextFunction) =>{
  if (!req.headers.authorization) throw new UnauthorizedException("Unauthorized");
  const token = jwtHelper.getJwtTokenFromHeader(req.headers.authorization);

  if(!token) throw new UnauthorizedException("Unauthorized");

  await jwtHelper.verifyToken(token);

  const jwtPayload = jwtHelper.decodeJwtToken(token);

  const user = await getUserByUniqueId(jwtPayload?.id);
  if(!user) throw new UnauthorizedException("Unauthorized");

  req.user = user;

  next();
}

export const verifyWsToken = async (req:Request, ws:any) =>{
  if (!req.headers.authorization) throw new UnauthorizedException("Unauthorized");
  const token = jwtHelper.getJwtTokenFromHeader(req.headers.authorization);

  if(!token) throw new UnauthorizedException("Unauthorized");

  await jwtHelper.verifyToken(token);

  const jwtPayload = jwtHelper.decodeJwtToken(token);

  const user = await getUserByUniqueId(jwtPayload?.id);
  if(!user) throw new UnauthorizedException("Unauthorized");
}