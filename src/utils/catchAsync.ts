import { Request } from '../types/Request';
import * as express from 'express';

type ExpressController = (
  req: Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void> | Promise<express.Response>;

export const catchAsync =
  (fn: ExpressController) =>
  (req: Request, res: express.Response, next: express.NextFunction) => {
    fn(req, res, next).catch((err) => next(err));
  };
