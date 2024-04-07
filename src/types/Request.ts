import { Request as ExpressRequest } from 'express';
import { type TourParams } from '../models/tourModel';
import { IUser } from '../models/userModel';
interface MiddleWareFields {
  requestTime?: string;
  tour?: TourParams;
  user?: IUser;
}
export interface Request extends ExpressRequest, MiddleWareFields {}
