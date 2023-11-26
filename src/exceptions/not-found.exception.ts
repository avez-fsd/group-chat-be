import CustomException from "./custom.exception";

export default class NotFoundException extends CustomException {
  constructor(message: string, requestId?: string, spSessionId?: string) {
    super(message, requestId, 404, false);
  }
}
