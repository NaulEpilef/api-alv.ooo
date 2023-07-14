import { NextFunction, Request, Response } from "express";
import ApiError from "../classes/apiError";

const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  if (err instanceof ApiError) {
    res.status(err.getStatusCode()).json(err.getErrorResponse());
  } else {
    // Caso não seja um erro personalizado, retorne um erro genérico
    res.status(500).json({ error: 'Internal Server Error' });
  }
  next();
}

export default errorHandler;