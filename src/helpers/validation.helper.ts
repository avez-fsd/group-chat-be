
import InvalidRequestException from "@exceptions/invalid-request.exception";
import { Request } from "express";
import { ObjectSchema } from "joi";

export function validateRequest(RequestSchema: ObjectSchema, reqBody: any, req?: Request, allowUnknown = false) {
  const { error } = RequestSchema.validate(reqBody, {
    abortEarly: true,
    allowUnknown
  });
  if (error) throw new InvalidRequestException('invalidRequest', req?.requestId, error);
}