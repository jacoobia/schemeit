import { Request, Response, NextFunction, RequestHandler } from 'express';
import { DataTypeValidator, ValidationError, Payload } from './@types/index';

const extractPayload = (request: Request): Payload => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  if (Object.keys(request.body).length > 0) {
    return request.body;
  } else if (Object.keys(request.query).length > 0) {
    return request.query;
  } else if (Object.keys(request.params).length > 0) {
    return request.params;
  } else {
    return null;
  }
};

export const validator = (validators: Record<string, DataTypeValidator>): RequestHandler => {
  return (request: Request, response: Response, next: NextFunction) => {
    const errors: ValidationError = {};
    const payload: Payload = extractPayload(request);

    for (const key in validators) {
      const validator = validators[key];
      const value = payload[key];

      if (value === undefined) {
        if (!validator.optional) {
          errors[key] = 'Required element is missing or undefined';
        }
      } else if (!validator.validate(value)) {
        errors[key] = 'Invalid type';
      }
    }

    if (Object.keys(errors).length) {
      return response.status(400).json({ errors });
    }

    next();
  };
};

export default validator;
export * from './@types/index';
