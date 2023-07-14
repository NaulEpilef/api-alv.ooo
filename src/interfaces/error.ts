export type ISuccessResponse<T> = { status: "success", data: T };
export type IErrorResponse = { status: "error", message: string };

export type IApiResponse<T> = 
  | ISuccessResponse<T>
  | IErrorResponse;