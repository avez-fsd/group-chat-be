import Joi from "joi";
import CustomException from "./custom.exception";

export default class InvalidRequestException extends CustomException {
  constructor(message: string, requestId?: string, error?: Joi.ValidationError, statusCode:number = 400) {
    let msg = message;
    if (error) {
      msg = error?.details.reduce((newObj, obj) => {
        return obj.message;
      }, message);
    }
    super(msg, requestId, statusCode, true, error);
  }
}