import { Request as ExpressRequest } from 'express';
import { type TourParams } from '../models/tourModel';
interface MiddleWareFields {
  requestTime?: string;
  tour?: TourParams;
}
export interface Request extends ExpressRequest, MiddleWareFields {}
