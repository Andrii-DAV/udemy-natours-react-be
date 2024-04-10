import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/appError';
import mongoose from 'mongoose';
import APIFeatures from '../utils/apiFeatures';

type Model = typeof mongoose.Model;
type PopulateOptions =
  | mongoose.PopulateOptions
  | mongoose.PopulateOptions[]
  | string[]
  | string;

export const deleteOne = (model: Model) =>
  catchAsync(async (req, res, next) => {
    const document = await model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

export const updateOne = (model: Model) =>
  catchAsync(async (req, res, next) => {
    const document = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: document,
    });
  });

export const createOne = (model: Model) =>
  catchAsync(async (req, res) => {
    const document = await model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: document,
    });
  });

export const getOne = (model: Model, populateOptions?: PopulateOptions) =>
  catchAsync(async (req, res, next) => {
    let documentQuery = model.findById(req.params.id);

    if (populateOptions) {
      documentQuery = await documentQuery.populate('reviews');
    }

    const document = await documentQuery;

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).send({
      status: 'success',
      data: document,
    });
  });

export const getAll = (model: Model) =>
  catchAsync(async (req, res) => {
    let filter = {};

    //allow for nested GET reviews on tour
    if (req.params.tourId) {
      filter = { tour: req.params.tourId };
    }

    const features = new APIFeatures(model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const documents = await features.query;

    res.status(200).json({
      status: 'success',
      results: documents.length,
      data: documents,
    });
  });
