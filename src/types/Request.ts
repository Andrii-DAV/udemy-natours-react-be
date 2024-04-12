import { Request as ExpressRequest } from 'express';
import { type ITour } from '../models/tourModel';
import { IUser } from '../models/userModel';
interface MiddleWareFields {
  requestTime?: string;
  tour?: ITour;
  user?: IUser;
}
export interface Request extends ExpressRequest, MiddleWareFields {}
