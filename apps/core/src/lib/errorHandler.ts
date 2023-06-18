import { ExpressError } from "..";
import type { Request, Response, NextFunction } from "express";

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ExpressError) {
    res.status(err.status).send(err.message);
  } else {
    res.status(500).send({err: err.message});
    console.log(err)
  }
}
