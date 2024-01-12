import { Request, Response, NextFunction, RequestHandler } from 'express';
import {
  ElementValidator,
  ValidationError,
  Payload,
  ValidatorFunction,
  ValidatorOptions
} from './@types/index';

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

/**
 * Creates a validator function to be used in
 * validators, automatically appends the optional state
 * @param validateFunc The validator function
 * @returns {ValidationFunction} validator function
 */
export const objectValidator = (
  validateFunc: (object: unknown) => boolean,
  errorMessage?: string
): ValidatorFunction => {
  const validatorFunc = (): ElementValidator => ({
    validate: (object) => validateFunc(object),
    message: errorMessage,
    optional: false
  });

  validatorFunc.optional = (): ElementValidator => ({
    validate: (object) => object === undefined || validateFunc(object),
    message: errorMessage,
    optional: true
  });

  return validatorFunc;
};

/**
 * Default validator, validates a string
 */
export const StringValidator = objectValidator(
  (object) => typeof object === 'string',
  'Invalid type, expected a string'
);
/**
 * Default validator, validates a number
 */
export const NumberValidator = objectValidator(
  (object) => typeof object === 'number',
  'Invalid type, expected a number'
);
/**
 * Default validator, validates a boolean
 */
export const BooleanValidator = objectValidator(
  (object) => typeof object === 'boolean',
  'Invalid type, expected a boolean'
);

/**
 * Creates an express middleware that will validate the payload of
 * a HTTP request, it's method agnostic so does not discriminate between
 * body/query/params.
 * @param validators The validation rules to follow
 * @returns {RequestHandler} An express middleware
 */
const createValidator = (
  validators: Record<string, ElementValidator>,
  options?: ValidatorOptions
): RequestHandler => {
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
        errors[key] = validator.message ?? 'Invalid type';
      }
    }

    if (options?.noExtraElements) {
      for (const key in payload) {
        if (!validators[key]) {
          errors[key] = 'Element does not exist in validator';
        }
      }
    }

    if (Object.keys(errors).length) {
      const errorResponseKey = options?.errorListName ? options.errorListName : 'errors';
      return response.status(400).json({ [errorResponseKey]: errors });
    }

    next();
  };
};

export default createValidator;
export * from './@types/index';
