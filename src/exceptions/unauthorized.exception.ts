import CustomException from "./custom.exception";

export default class UnauthorizedException extends CustomException {
  constructor(message: string, requestId?: string, statusCode:number = 401) {
    super(message, requestId, statusCode, false);
  }
}
