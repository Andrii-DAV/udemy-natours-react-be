import express from 'express';
import { CastError } from 'mongoose';
import AppError from '../utils/appError';

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyError = any;

const sendErrorDev = (
  err: AnyError,
  req: express.Request,
  res: express.Response,
) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
};

const sendErrorProd = (
  err: AnyError,
  req: express.Request,
  res: express.Response,
) => {
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

      // Programming or other unknown error: don't leak error details
    }
    console.error('ERROR 💥', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.isOperational ? err.message : 'Please try again later',
  });
};

const handleCastErrorDB = (err: CastError) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicatedFieldsDB = (err: AnyError) => {
  const message = `Duplicate field value: ${Object.values(err.keyValue).join(
    ' ',
  )}. Please use another value!`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: AnyError) => {
  const errors = Object.values(err?.errors)
    ?.map((e) => {
      // eslint-disable-next-line
      // @ts-ignore
      return e?.message;
    })
    .join(' ');
  const message = `Invalid input data. ${errors}`;

  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again', 401);
const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

export const handleError = (
  err: AnyError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err?.message };

    if (err?.code === 11000) {
      error = handleDuplicatedFieldsDB(error);
    }
    switch (err.name) {
      case 'CastError':
        error = handleCastErrorDB(error);
        break;
      case 'ValidationError': {
        error = handleValidationErrorDB(error);
        break;
      }
      case 'JsonWebTokenError': {
        error = handleJWTError();
        break;
      }
      case 'TokenExpiredError': {
        error = handleJWTExpiredError();
        break;
      }
    }

    sendErrorProd(error, req, res);
  }
};
