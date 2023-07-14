import { IErrorResponse } from "../interfaces/error";

export default class ApiError extends Error {
  private statusCode: number;
  private errorReponse: IErrorResponse;

  constructor(message: string, statusCode: number) {
    super(message);
    this.errorReponse = { status: "error", message }
    this.statusCode = statusCode;
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  getErrorResponse(): IErrorResponse {
    return this.errorReponse;
  }
}