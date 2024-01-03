import { Request, Response, NextFunction, RequestHandler } from 'express';
import { DataTypeValidator, ValidationError } from './@types/index';

export const validator = (validators: Record<string, DataTypeValidator>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: ValidationError = {};

    for (const key in validators) {
      const validator = validators[key];
      const value = req.body[key];

      if (value === undefined) {
        if (!validator.optional) {
          errors[key] = 'Required element is missing or undefined';
        }
      } else if (!validator.validate(value)) {
        errors[key] = 'Invalid type';
      }
    }

    if (Object.keys(errors).length) {
      return res.status(400).json({ errors });
    }

    next();
  };
};

export default validator;
export * from './@types/index';
